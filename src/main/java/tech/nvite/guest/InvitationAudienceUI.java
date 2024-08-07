package tech.nvite.guest;

import java.util.Optional;

import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.Events;
import tech.nvite.domain.model.InvitationVisitor;
import tech.nvite.domain.usecases.VisitInvitationUseCase;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
class InvitationAudienceUI {

	private final Events events;
	private final VisitInvitationUseCase visitInvitation;

	@GetMapping("/invitations/{ref}")
	String showInvitation(@PathVariable("ref") String ref,@RequestParam(required = false) String guest, Model model) {
		InvitationVisitor viewer = Optional.ofNullable(guest)
			.map(InvitationVisitor::withName)
			.orElseGet(InvitationVisitor::anonymous);

		VisitInvitationUseCase.Request req = new VisitInvitationUseCase.Request(new EventReference(ref), viewer);
		VisitInvitationUseCase.Response resp = visitInvitation.apply(req);

		var event = resp.evt();
		model.addAttribute("bride_name", event.brideName());
		model.addAttribute("groom_name", event.groomName());
		model.addAttribute("event_date", event.eventDateTime());
		model.addAttribute("event_location", event.eventLocation());
		model.addAttribute("event_reception", event.eventReception());
		return "invitation";
	}
}
