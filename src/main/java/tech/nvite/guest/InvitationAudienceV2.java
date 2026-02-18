package tech.nvite.guest;

import java.time.Instant;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import tech.nvite.domain.model.Event;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.InvitationVisitor;
import tech.nvite.domain.model.RsvpAnswer;
import tech.nvite.domain.usecases.RsvpInvitationUseCase;
import tech.nvite.domain.usecases.VisitInvitationUseCase;

@Slf4j
@RestController
@RequestMapping("api/v2/invitations/{ref}")
@RequiredArgsConstructor
public class InvitationAudienceV2 {

  private final VisitInvitationUseCase visitInvitationUseCase;
  private final RsvpInvitationUseCase rsvpInvitationUseCase;

  @GetMapping(produces = "application/json")
  public InvitationDetailsDto invitationDetails(
      @PathVariable String ref, @RequestParam(required = false) String guest) {
    log.info("Fetching invitation details for ref: {} and guest: {}", ref, guest);
    InvitationVisitor viewer =
        Optional.ofNullable(guest)
            .map(InvitationVisitor::withName)
            .orElseGet(InvitationVisitor::anonymous);
    var request = new VisitInvitationUseCase.Request(new EventReference(ref), viewer);
    var response = visitInvitationUseCase.apply(request);
    return InvitationDetailsDto.from(response.evt());
  }

  @PostMapping("/responses")
  @ResponseStatus(HttpStatus.CREATED)
  public void rsvp(@PathVariable String ref, @RequestBody RsvpRequestDto rsvpRequest) {
    log.info("Submitting RSVP for ref: {} with request: {}", ref, rsvpRequest);
    var rsvpAnswer =
        "ACCEPTED".equalsIgnoreCase(rsvpRequest.answer())
            ? new RsvpAnswer.Accepted()
            : new RsvpAnswer.Declined();

    var request =
        new RsvpInvitationUseCase.Request(
            new EventReference(ref), rsvpRequest.guestName(), rsvpAnswer, rsvpRequest.partnerName());

    rsvpInvitationUseCase.apply(request);
  }

  public record RsvpRequestDto(String guestName, String answer, String partnerName) {}

  public record InvitationDetailsDto(
      String brideName,
      String groomName,
      Instant eventDate,
      String eventLocation,
      String eventReception,
      String eventReference,
      String backgroundImageUrl) {
    public static InvitationDetailsDto from(Event event) {
      return new InvitationDetailsDto(
          event.brideName(),
          event.groomName(),
          event.eventDateTime(),
          event.eventLocation(),
          event.eventReception(),
          event.reference().value(),
          event.backgroundImageOrDefault());
    }
  }
}
