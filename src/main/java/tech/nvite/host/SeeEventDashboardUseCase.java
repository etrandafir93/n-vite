package tech.nvite.host;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.collectingAndThen;
import static java.util.stream.Collectors.toUnmodifiableList;
import static java.util.stream.Stream.concat;

import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.List;
import java.util.function.Function;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import tech.nvite.domain.Event;
import tech.nvite.domain.Events;
import tech.nvite.domain.InvitationVisits;
import tech.nvite.domain.RsvpRepository;
import tech.nvite.infra.UseCase;

@UseCase
@RequiredArgsConstructor
public class SeeEventDashboardUseCase
    implements Function<String, SeeEventDashboardUseCase.EventStats> {

  private final Events events;
  private final InvitationVisits visits;
  private final RsvpRepository rsvps;

  @Override
  public EventStats apply(String eventReference) {
    var event = events.findOrThrow(eventReference);

    var visitList =
        visits
            .find(eventReference)
            .map(v -> new EventInteraction(v.visitorName(), null, v.visitTime(), "VISITED"));

    var allRsvps = rsvps.findAllByEventReference(eventReference);

    var rsvpList =
        allRsvps.stream()
            .map(r -> new EventInteraction(r.guest(), r.partnerName(), r.timestamp(), r.answer()));

    var interactions =
        concat(visitList, rsvpList)
            .sorted(comparing(EventInteraction::timestamp).reversed())
            .collect(collectingAndThen(toUnmodifiableList(), list -> list));

    int acceptedCount = countAction(interactions, "ACCEPTED");
    int declinedCount = countAction(interactions, "DECLINED");
    int visitedCount = countAction(interactions, "VISITED");

    int peopleAttending =
        interactions.stream()
            .filter(i -> "ACCEPTED".equalsIgnoreCase(i.action()))
            .mapToInt(i -> 1 + (i.partnerName() != null ? 1 : 0))
            .sum();

    var stats =
        new Stats(
            interactions.size(),
            acceptedCount,
            declinedCount,
            interactions.size() - acceptedCount - declinedCount,
            visitedCount,
            peopleAttending);

    var responses =
        allRsvps.stream()
            .map(
                r ->
                    new GuestResponse(
                        r.guest(),
                        "ACCEPTED".equalsIgnoreCase(r.answer()),
                        r.menuPreference(),
                        r.partnerName() != null,
                        r.partnerName(),
                        r.children(),
                        r.transport(),
                        r.notes(),
                        r.timestamp()))
            .sorted(comparing(GuestResponse::timestamp).reversed())
            .toList();

    var visitsList =
        interactions.stream()
            .filter(i -> "VISITED".equalsIgnoreCase(i.action()))
            .map(i -> new VisitEntry(i.guest(), i.timestamp()))
            .toList();

    return new EventStats(event, stats, responses, visitsList);
  }

  private static int countAction(List<EventInteraction> actions, String expectedAction) {
    return (int)
        actions.stream()
            .map(EventInteraction::action)
            .filter(expectedAction::equalsIgnoreCase)
            .count();
  }

  public record Request(@NonNull String eventReference) {}

  public record EventStats(
      Event event, Stats stats, List<GuestResponse> responses, List<VisitEntry> visits) {}

  public record EventInteraction(
      String guest, @Nullable String partnerName, Instant timestamp, String action) {}

  public record Stats(
      int totalInvited,
      int accepted,
      int declined,
      int pending,
      int totalViews,
      int peopleAttending) {}

  public record GuestResponse(
      String guestName,
      boolean attending,
      @Nullable String menuPreference,
      boolean plusOne,
      @Nullable String partnerName,
      @Nullable Integer children,
      @Nullable Boolean transport,
      @Nullable String notes,
      Instant timestamp) {}

  public record VisitEntry(String visitor, Instant timestamp) {}
}
