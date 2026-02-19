package tech.nvite.host;

import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import tech.nvite.domain.model.Event;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.Events;
import tech.nvite.infra.security.CurrentUser;

@Slf4j
@RestController
@RequestMapping("api/v2/events")
@RequiredArgsConstructor
class EventBuilderV2 {

  private final Events events;
  private final CurrentUser currentUser;
  private final EventBuilderMapper mapper;

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
      String rsvpDeadline) {}

  @GetMapping("/{reference}/form")
  public EventFormResponse getForm(@PathVariable String reference) {
    log.info("Fetching form data for event {}", reference);
    var evt = events.findOrThrow(new EventReference(reference));
    return mapper.toFormResponse(evt);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public EventReference create(@RequestBody EventFormRequest req) {
    log.info("Creating event via v2 builder for {} & {}", req.groomName(), req.brideName());
    var ref = newReference(req.brideName(), req.groomName());
    events.create(buildEvent(req, ref));
    return ref;
  }

  @PutMapping("/{reference}")
  public EventReference update(@PathVariable String reference, @RequestBody EventFormRequest req) {
    log.info("Updating event {} via v2 builder", reference);
    var ref = new EventReference(reference);
    var existing = events.findOrThrow(ref);
    events.edit(buildEvent(req, ref).withCreated(existing.created()));
    return ref;
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
        .reference(ref)
        .createdBy(currentUser.get().id())
        .build();
  }

  private EventReference newReference(String bride, String groom) {
    String slug = "%s-and-%s".formatted(bride.replace(" ", ""), groom.replace(" ", ""));
    var ref = new EventReference(slug);
    return events.find(ref).isPresent() ? new EventReference(UUID.randomUUID().toString()) : ref;
  }
}
