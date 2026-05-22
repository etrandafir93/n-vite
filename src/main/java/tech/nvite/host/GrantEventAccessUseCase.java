package tech.nvite.host;

import java.util.function.Function;
import lombok.RequiredArgsConstructor;
import tech.nvite.domain.EventAccessGrants;
import tech.nvite.domain.EventAccessRole;
import tech.nvite.domain.Events;
import tech.nvite.infra.UseCase;
import tech.nvite.infra.errors.ForbiddenOperationException;
import tech.nvite.infra.security.CurrentUser;

@UseCase
@RequiredArgsConstructor
public class GrantEventAccessUseCase
    implements Function<GrantEventAccessUseCase.Request, SeeEventAccessUseCase.Response> {

  private final Events events;
  private final EventAccessGrants eventAccessGrants;
  private final SeeEventAccessUseCase seeEventAccessUseCase;
  private final CurrentUser currentUser;

  @Override
  public SeeEventAccessUseCase.Response apply(Request req) {
    var event = events.findAccessManageableOrThrow(req.eventReference());
    var email = req.email().trim();

    if (event.ownerEmail() != null && event.ownerEmail().equalsIgnoreCase(email)) {
      throw new ForbiddenOperationException("Owner access is already implicit and cannot be granted");
    }

    eventAccessGrants.grant(
        req.eventReference(), email, EventAccessRole.valueOf(req.role()), currentUser.get().email());
    return seeEventAccessUseCase.apply(req.eventReference());
  }

  public record Request(String eventReference, String email, String role) {}
}
