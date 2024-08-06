package com.etr.nvite.domain.usecases;

import java.util.function.Function;

import org.springframework.stereotype.Component;

import com.etr.nvite.domain.model.Events;
import com.etr.nvite.domain.model.Event;
import com.etr.nvite.domain.model.EventReference;
import com.etr.nvite.domain.model.InvitationVisitor;
import com.etr.nvite.domain.model.InvitationVisits;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VisitInvitationUseCase implements Function<VisitInvitationUseCase.Request, VisitInvitationUseCase.Response> {

    private final Events events;
    private final InvitationVisits invitationVisitors;

    @Override
    public Response apply(Request req) {
        Event evt = events.findOrThrow(req.eventReference);
        invitationVisitors.add(req.viewer(), req.eventReference());
        return new Response(evt);
    }

    public record Request(EventReference eventReference, InvitationVisitor viewer) {
    }

    public record Response(Event evt) {
    }

}
