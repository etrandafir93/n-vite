package tech.nvite.guest;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.InvitationVisitor;
import tech.nvite.domain.model.RsvpAnswer;
import tech.nvite.domain.usecases.RsvpInvitationUseCase;
import tech.nvite.domain.usecases.VisitInvitationUseCase;

import java.util.Optional;

@Controller
@RequiredArgsConstructor
class InvitationAudienceUI {

	private final VisitInvitationUseCase visitInvitation;
	private final RsvpInvitationUseCase rsvpInvitation;

	@GetMapping("/invitations/{ref}")
	String showInvitation(@PathVariable("ref") String ref, @RequestParam(required = false) String guest, Model model) {
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
		model.addAttribute("event_reference", event.reference().value());
		model.addAttribute("event_background_img", event.backgroundImageOrDefault());
		return "invitation";
	}

	@PostMapping("/invitations/{ref}/responses")
	RedirectView submitResponse(
			@PathVariable("ref") String eventReference,
			@RequestParam("guest") String guest,
			@RequestParam("rsvp") String rsvp,
			@RequestParam(value = "partnerName", required = false) String partnerName
	) {
		var req = new RsvpInvitationUseCase.Request(
				new EventReference(eventReference),
				guest,
				rsvp.equals("ACCEPTED") ? new RsvpAnswer.Accepted() : new RsvpAnswer.Declined(),
				partnerName
		);
		rsvpInvitation.apply(req);
		return new RedirectView("/events");
	}
}
