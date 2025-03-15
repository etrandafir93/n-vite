package tech.nvite.guest;

import static tech.nvite.domain.model.RsvpAnswer.*;
import static tech.nvite.guest.InvitationAudienceUI.SubmitRspvDto.Answer.ACCEPTED;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Nullable;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.InvitationVisitor;
import tech.nvite.domain.usecases.RsvpInvitationUseCase;
import tech.nvite.domain.usecases.VisitInvitationUseCase;

@Controller
@RequiredArgsConstructor
@Tag(name = "Invitations", description = "APIs related to invitations")
class InvitationAudienceUI {

  private final VisitInvitationUseCase visitInvitation;
  private final RsvpInvitationUseCase rsvpInvitation;

  @GetMapping("/invitations/{ref}")
  String showInvitation(
      @PathVariable("ref") String ref, @RequestParam(required = false) String guest, Model model) {
    VisitInvitationUseCase.Response resp = getInvitation(ref, guest);

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
      @RequestParam(value = "partnerName", required = false) String partnerName) {
    var req =
        new RsvpInvitationUseCase.Request(
            new EventReference(eventReference),
            guest,
            rsvp.equals("ACCEPTED") ? new Accepted() : new Declined(),
            partnerName);
    rsvpInvitation.apply(req);
    return new RedirectView("/events");
  }

  @Operation(
      summary = "Save RSVP response for an invitation",
      description =
          "Saves the RSVP response for a specific invitation, indicating whether the guest is attending or not.")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "RSVP successfully saved"),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid RSVP data",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(
            responseCode = "404",
            description = "Event or invitation not found",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error while saving RSVP",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class)))
      })
  @PostMapping("/api/invitations/{reference}/responses")
  @ResponseBody
  public void saveRsvp(@PathVariable String reference, @RequestBody SubmitRspvDto rsvp) {
    rsvpInvitation.apply(rsvp.map());
  }

  record SubmitRspvDto(String reference, String name, Answer rsvp, @Nullable String partnerName) {

    public enum Answer {
      ACCEPTED,
      DECLINED
    }

    private RsvpInvitationUseCase.Request map() {
      return new RsvpInvitationUseCase.Request(
          new EventReference(reference),
          name,
          rsvp.equals(ACCEPTED) ? new Accepted() : new Declined(),
          partnerName);
    }
  }

  @Operation(
      summary = "See invitation details and add a visit",
      description =
          "Retrieves the invitation for a specific event, with an optional guest name for personalized details.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Invitation successfully retrieved",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = VisitInvitationUseCase.Response.class))),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input data",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(
            responseCode = "404",
            description = "Event or invitation not found",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error while retrieving invitation",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class)))
      })
  @GetMapping("/api/invitations/{reference}")
  @ResponseBody
  public VisitInvitationUseCase.Response getInvitation(
      @PathVariable String reference, @RequestParam(required = false) String guest) {
    InvitationVisitor viewer =
        Optional.ofNullable(guest)
            .map(InvitationVisitor::withName)
            .orElseGet(InvitationVisitor::anonymous);

    VisitInvitationUseCase.Request req =
        new VisitInvitationUseCase.Request(new EventReference(reference), viewer);
    return visitInvitation.apply(req);
  }
}