package tech.nvite.domain.usecases;

import java.util.function.Function;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import tech.nvite.util.UseCase;
import tech.nvite.domain.model.Event;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.Events;
import tech.nvite.domain.model.InvitationVisitor;
import tech.nvite.domain.model.InvitationVisits;

import lombok.RequiredArgsConstructor;

@UseCase
@Slf4j
@RequiredArgsConstructor
public class VisitInvitationUseCase implements Function<VisitInvitationUseCase.Request, VisitInvitationUseCase.Response> {

    private final Events events;
    private final InvitationVisits invitationVisitors;

    @Override
    public Response apply(Request req) {
		log.info("visiting {}", req.eventReference);
        Event evt = events.findOrThrow(req.eventReference);
        invitationVisitors.add(req.viewer(), req.eventReference());
        return new Response(evt);
    }

    public record Request(EventReference eventReference, InvitationVisitor viewer) {
    }

    public record Response(Event evt) {
    }

}
