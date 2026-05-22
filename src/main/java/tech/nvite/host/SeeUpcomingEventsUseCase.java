package tech.nvite.host;

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
        .findAllAccessibleForCurrentUser()
        .map(
            access ->
                new EventListItem(
                    access.event().groomName(),
                    access.event().brideName(),
                    access.event().eventDateTime(),
                    access.event().eventReference(),
                    access.event().status() != null ? access.event().status().toString() : "LIVE",
                    access.ownerEmail(),
                    access.editors(),
                    access.accessRole(),
                    access.canEdit(),
                    access.canDelete(),
                    access.canManageAccess()))
        .toList();
  }

  public record EventListItem(
      String groomName,
      String brideName,
      Instant dateTime,
      String reference,
      String status,
      String ownerEmail,
      java.util.List<String> editors,
      String accessRole,
      boolean canEdit,
      boolean canDelete,
      boolean canManageAccess) {}
}
