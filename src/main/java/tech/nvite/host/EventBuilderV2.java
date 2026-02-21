package tech.nvite.host;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.collectingAndThen;
import static java.util.stream.Collectors.toUnmodifiableList;
import static java.util.stream.Stream.concat;

import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import tech.nvite.domain.model.Event;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.EventStatus;
import tech.nvite.domain.model.Events;
import tech.nvite.domain.model.InvitationVisits;
import tech.nvite.domain.model.RsvpRepository;
import tech.nvite.infra.security.CurrentUser;

@RestController
@RequestMapping("api/events")
@RequiredArgsConstructor
class EventBuilderV2 {

  private final Events events;
  private final CurrentUser currentUser;
  private final EventBuilderMapper mapper;
  private final InvitationVisits visits;
  private final RsvpRepository rsvps;

  public record EventFormRequest(
      String groomName,
      String brideName,
      Instant eventDateTime,
      String backgroundImageUrl,
      String groomParents,
      String brideParents,
      String godparents,
      String ceremonyVenue,
      String ceremonyAddress,
      String ceremonyTime,
      String ceremonyPhotoUrl,
      String ceremonyMapUrl,
      String receptionVenue,
      String receptionAddress,
      String receptionTime,
      String receptionPhotoUrl,
      String receptionMapUrl,
      String rsvpDeadline,
      String theme,
      EventStatus status) {}

  @GetMapping
  public java.util.List<EventListItem> listEvents() {
    return events
        .findAllForLoggedInUser()
        .map(
            evt ->
                new EventListItem(
                    evt.groomName(),
                    evt.brideName(),
                    evt.eventDateTime(),
                    evt.reference().value(),
                    evt.status() != null ? evt.status() : EventStatus.LIVE))
        .toList();
  }

  @GetMapping("/{reference}/form")
  public EventFormResponse getForm(@PathVariable String reference) {
    var evt = events.findOrThrow(new EventReference(reference));
    return mapper.toFormResponse(evt);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public EventReference create(@RequestBody EventFormRequest req) {
    var ref = newReference(req.brideName(), req.groomName());
    events.create(buildEvent(req, ref));
    return ref;
  }

  @PutMapping("/{reference}")
  public EventReference update(@PathVariable String reference, @RequestBody EventFormRequest req) {
    var ref = new EventReference(reference);
    var existing = events.findOrThrow(ref);
    events.edit(buildEvent(req, ref).withCreated(existing.created()));
    return ref;
  }

  @PatchMapping("/{reference}")
  public EventReference patchStatus(
      @PathVariable String reference, @RequestBody java.util.Map<String, Object> updates) {
    var ref = new EventReference(reference);
    var existing = events.findOrThrow(ref);

    EventStatus newStatus =
        updates.containsKey("status")
            ? EventStatus.valueOf(updates.get("status").toString())
            : existing.status();

    events.edit(existing.withStatus(newStatus));
    return ref;
  }

  @DeleteMapping("/{reference}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable String reference) {
    events.delete(new EventReference(reference));
  }

  private Event buildEvent(EventFormRequest req, EventReference ref) {
    return Event.builder()
        .groomName(req.groomName())
        .brideName(req.brideName())
        .eventDateTime(req.eventDateTime())
        .backgroundImage(req.backgroundImageUrl())
        .eventLocation(req.ceremonyVenue())
        .eventReception(req.receptionVenue())
        .groomParents(req.groomParents())
        .brideParents(req.brideParents())
        .godparents(req.godparents())
        .ceremonyAddress(req.ceremonyAddress())
        .ceremonyTime(req.ceremonyTime())
        .ceremonyPhotoUrl(req.ceremonyPhotoUrl())
        .ceremonyMapUrl(req.ceremonyMapUrl())
        .receptionAddress(req.receptionAddress())
        .receptionTime(req.receptionTime())
        .receptionPhotoUrl(req.receptionPhotoUrl())
        .receptionMapUrl(req.receptionMapUrl())
        .rsvpDeadline(req.rsvpDeadline())
        .theme(req.theme())
        .status(req.status() != null ? req.status() : EventStatus.LIVE)
        .reference(ref)
        .createdBy(currentUser.get().id())
        .build();
  }

  private EventReference newReference(String bride, String groom) {
    String slug = "%s-and-%s".formatted(bride.replace(" ", ""), groom.replace(" ", ""));
    var ref = new EventReference(slug);
    return events.find(ref).isPresent() ? new EventReference(UUID.randomUUID().toString()) : ref;
  }

  @GetMapping("/{reference}/dashboard")
  public EventAnalyticsDTO getDashboard(@PathVariable String reference) {
    var eventReference = new EventReference(reference);
    var event = events.findOrThrow(eventReference);

    var visitList =
        visits
            .find(eventReference)
            .map(v -> new EventInteraction(v.visitorName(), null, v.visitTime(), "VISITED"));

    var rsvpList =
        rsvps.findAllByEventReference(reference).stream()
            .map(r -> new EventInteraction(r.guest(), r.partnerName(), r.timestamp(), r.answer()));

    var interactions =
        concat(visitList, rsvpList)
            .sorted(comparing(EventInteraction::timestamp).reversed())
            .collect(collectingAndThen(toUnmodifiableList(), list -> list));

    int acceptedCount = countAction(interactions, "ACCEPTED");
    int declinedCount = countAction(interactions, "DECLINED");
    int visitedCount = countAction(interactions, "VISITED");

    var stats =
        new AnalyticsStats(
            interactions.size(),
            acceptedCount,
            declinedCount,
            interactions.size() - acceptedCount - declinedCount,
            visitedCount);

    var responses =
        interactions.stream()
            .filter(
                i ->
                    "ACCEPTED".equalsIgnoreCase(i.action())
                        || "DECLINED".equalsIgnoreCase(i.action()))
            .map(
                i ->
                    new GuestResponse(
                        i.guest(),
                        "ACCEPTED".equalsIgnoreCase(i.action()),
                        null,
                        i.partnerName() != null,
                        null,
                        i.timestamp()))
            .toList();

    var visitsList =
        interactions.stream()
            .filter(i -> "VISITED".equalsIgnoreCase(i.action()))
            .map(i -> new VisitEntry(i.guest(), i.timestamp()))
            .toList();

    return new EventAnalyticsDTO(event, stats, responses, visitsList);
  }

  private static int countAction(List<EventInteraction> actions, String expectedAction) {
    return (int)
        actions.stream()
            .map(EventInteraction::action)
            .filter(expectedAction::equalsIgnoreCase)
            .count();
  }

  public record EventListItem(
      String groomName, String brideName, Instant dateTime, String reference, EventStatus status) {}

  public record EventInteraction(
      String guest, @Nullable String partnerName, Instant timestamp, String action) {}

  public record EventAnalyticsDTO(
      Event event, AnalyticsStats stats, List<GuestResponse> responses, List<VisitEntry> visits) {}

  public record AnalyticsStats(
      int totalInvited, int accepted, int declined, int pending, int totalViews) {}

  public record GuestResponse(
      String guestName,
      boolean attending,
      @Nullable String menuPreference,
      boolean plusOne,
      @Nullable Integer children,
      Instant timestamp) {}

  public record VisitEntry(String visitor, Instant timestamp) {}
}
