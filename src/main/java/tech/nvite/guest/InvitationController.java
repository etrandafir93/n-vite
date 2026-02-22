package tech.nvite.guest;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tech.nvite.usecases.RsvpInvitationUseCase;
import tech.nvite.usecases.VisitInvitationUseCase;

@RestController
@RequestMapping("api/invitations/{ref}")
@RequiredArgsConstructor
class InvitationController {

  private final VisitInvitationUseCase visitInvitationUseCase;
  private final RsvpInvitationUseCase rsvpInvitationUseCase;
  private final InvitationMapper invitationMapper;

  @GetMapping
  public InvitationDetails invitationDetails(
      @PathVariable String ref, @RequestParam(required = false) String guest) {
    var request = new VisitInvitationUseCase.Request(ref, guest);
    var response = visitInvitationUseCase.apply(request);
    return invitationMapper.toDto(response.evt());
  }

  @PostMapping("/responses")
  public void rsvp(@PathVariable String ref, @RequestBody RsvpRequest rsvpRequest) {
    var request =
        new RsvpInvitationUseCase.Request(
            ref, rsvpRequest.guestName(), rsvpRequest.answer, rsvpRequest.partnerName());

    rsvpInvitationUseCase.apply(request);
  }

  public record RsvpRequest(String guestName, String answer, String partnerName) {}
}
