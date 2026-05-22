package tech.nvite.host;

import java.util.function.Function;
import lombok.RequiredArgsConstructor;
import tech.nvite.domain.EventAccessGrants;
import tech.nvite.domain.Events;
import tech.nvite.infra.UseCase;
import tech.nvite.infra.errors.ForbiddenOperationException;

@UseCase
@RequiredArgsConstructor
public class RevokeEventAccessUseCase
    implements Function<RevokeEventAccessUseCase.Request, SeeEventAccessUseCase.Response> {

  private final Events events;
  private final EventAccessGrants eventAccessGrants;
  private final SeeEventAccessUseCase seeEventAccessUseCase;

  @Override
  public SeeEventAccessUseCase.Response apply(Request req) {
    var event = events.findAccessManageableOrThrow(req.eventReference());

    if (event.ownerEmail() != null && event.ownerEmail().equalsIgnoreCase(req.email())) {
      throw new ForbiddenOperationException("Owner access cannot be revoked");
    }

    eventAccessGrants.revoke(req.eventReference(), req.email());
    return seeEventAccessUseCase.apply(req.eventReference());
  }

  public record Request(String eventReference, String email) {}
}
