package tech.nvite.usecases;

import java.time.Instant;
import java.util.List;
import java.util.function.Supplier;
import lombok.RequiredArgsConstructor;
import tech.nvite.domain.Events;
import tech.nvite.infra.UseCase;

@UseCase
@RequiredArgsConstructor
public class SeeUpcomingEventsUseCase
    implements Supplier<List<SeeUpcomingEventsUseCase.EventListItem>> {

  private final Events events;

  @Override
  public List<EventListItem> get() {
    return events
        .findAllForLoggedInUser()
        .map(
            evt ->
                new EventListItem(
                    evt.groomName(),
                    evt.brideName(),
                    evt.eventDateTime(),
                    evt.eventReference(),
                    evt.status() != null ? evt.status().toString() : "LIVE"))
        .toList();
  }

  public record EventListItem(
      String groomName, String brideName, Instant dateTime, String reference, String status) {}
}
