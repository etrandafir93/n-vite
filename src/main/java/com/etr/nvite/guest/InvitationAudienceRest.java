package com.etr.nvite.guest;

import java.util.Optional;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.etr.nvite.domain.model.Event;
import com.etr.nvite.domain.model.EventReference;
import com.etr.nvite.domain.model.InvitationVisitor;
import com.etr.nvite.domain.usecases.VisitInvitationUseCase;
import com.etr.nvite.domain.usecases.VisitInvitationUseCase.Request;
import com.etr.nvite.domain.usecases.VisitInvitationUseCase.Response;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/invitations")
@RequiredArgsConstructor
class InvitationAudienceRest {

    private final VisitInvitationUseCase visitInvitation;

    @GetMapping("{ref}")
    Event visitInvitation(@PathVariable String ref, @RequestParam(required = false) String guest) {
        InvitationVisitor viewer = Optional.ofNullable(guest)
            .map(InvitationVisitor::NamedGuest)
            .orElseGet(InvitationVisitor::Anonymous);

        Request req = new Request(new EventReference(ref), viewer);
        Response resp = visitInvitation.apply(req);
        return resp.evt();
    }

}
