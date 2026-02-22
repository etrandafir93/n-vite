package tech.nvite.guest;

import java.util.Optional;
import java.util.function.Function;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tech.nvite.domain.Event;
import tech.nvite.domain.Events;
import tech.nvite.domain.InvitationVisitor;
import tech.nvite.domain.InvitationVisits;
import tech.nvite.infra.UseCase;

@Slf4j
@UseCase
@RequiredArgsConstructor
public class VisitInvitationUseCase
    implements Function<VisitInvitationUseCase.Request, VisitInvitationUseCase.Response> {

  private final Events events;
  private final InvitationVisits invitationVisitors;

  @Override
  public Response apply(Request req) {
    log.info("Visiting invitation {}", req);
    Event evt = events.findOrThrow(req.eventReference);

    InvitationVisitor viewer =
        Optional.ofNullable(req.viewer)
            .map(InvitationVisitor::withName)
            .orElseGet(InvitationVisitor::anonymous);

    invitationVisitors.add(viewer, req.eventReference);
    return new Response(evt);
  }

  public record Request(String eventReference, String viewer) {}

  public record Response(Event evt) {}
}
