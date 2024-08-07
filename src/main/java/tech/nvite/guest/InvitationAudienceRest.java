package tech.nvite.guest;

import java.util.Optional;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import tech.nvite.domain.model.Event;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.InvitationVisitor;
import tech.nvite.domain.usecases.VisitInvitationUseCase;
import tech.nvite.domain.usecases.VisitInvitationUseCase.Request;
import tech.nvite.domain.usecases.VisitInvitationUseCase.Response;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/invitations")
@RequiredArgsConstructor
class InvitationAudienceRest {

    private final VisitInvitationUseCase visitInvitation;

    @GetMapping("{ref}")
    Event visitInvitation(@PathVariable String ref, @RequestParam(required = false) String guest) {
        InvitationVisitor viewer = Optional.ofNullable(guest)
            .map(InvitationVisitor::withName)
            .orElseGet(InvitationVisitor::anonymous);

        Request req = new Request(new EventReference(ref), viewer);
        Response resp = visitInvitation.apply(req);
        return resp.evt();
    }

}