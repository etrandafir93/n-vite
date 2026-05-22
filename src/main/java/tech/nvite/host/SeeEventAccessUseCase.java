package tech.nvite.host;

import java.time.Instant;
import java.util.List;
import java.util.function.Function;
import lombok.RequiredArgsConstructor;
import tech.nvite.domain.EventAccessGrant;
import tech.nvite.domain.EventAccessGrants;
import tech.nvite.domain.Events;
import tech.nvite.infra.UseCase;

@UseCase
@RequiredArgsConstructor
public class SeeEventAccessUseCase implements Function<String, SeeEventAccessUseCase.Response> {

  private final Events events;
  private final EventAccessGrants eventAccessGrants;

  @Override
  public Response apply(String eventReference) {
    var event = events.findAccessManageableOrThrow(eventReference);
    return new Response(
        eventReference,
        event.ownerEmail(),
        eventAccessGrants.findByEventReference(eventReference).stream().map(this::toEntry).toList());
  }

  private Entry toEntry(EventAccessGrant grant) {
    return new Entry(grant.userEmail(), grant.role().name(), grant.grantedBy(), grant.grantedAt());
  }

  public record Response(String eventReference, String ownerEmail, List<Entry> grants) {}

  public record Entry(String email, String role, String grantedBy, Instant grantedAt) {}
}
