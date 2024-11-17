package tech.nvite.host;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.collectingAndThen;
import static java.util.stream.Collectors.toUnmodifiableList;
import static java.util.stream.Stream.concat;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import tech.nvite.app.errors.ErrorResponse;
import tech.nvite.domain.model.*;
import tech.nvite.domain.usecases.DeleteEventUseCase;

@Slf4j
@Controller
@RequiredArgsConstructor
@Tag(name = "Event Dashboard", description = "APIs related to event dashboard")
class EventDashboardUI {

  private final DeleteEventUseCase deleteEvent;
  private final InvitationVisits visits;
  private final RsvpRepository rspvs;
  private final Events events;

  @GetMapping("/events/{ref}")
  String eventDashboard(Model model, @PathVariable String ref) {
    log.debug("eventDashboard ref: {}", ref);
    var dto = getEvent(ref);

    model.addAttribute("event", dto.event);
    model.addAttribute("acceptedCount", dto.acceptedCount);
    model.addAttribute("visitedCount", dto.visitedCount);
    model.addAttribute("declinedCount", dto.declinedCount);
    model.addAttribute("attendingCount", dto.attendingCount);
    model.addAttribute("eventInteractions", dto.interactions);
    return "eventDashboard";
  }

  @PostMapping("/events/{ref}/delete")
  String deleteEvent(Model model, @PathVariable String ref) {
    deleteEvent(ref);
    return "redirect:/events";
  }

  @Operation(
      summary = "Delete an Event",
      description = "Deletes an event based on the provided reference ID.")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "204", description = "Event deleted successfully"),
        @ApiResponse(
            responseCode = "404",
            description = "Event not found",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class))),
      })
  @DeleteMapping("api/events/{reference}")
  @ResponseBody
  void deleteEvent(
      @Parameter(
              description = "Reference ID of the event to be deleted",
              required = true,
              example = "Ion-and-Maria")
          @PathVariable("reference")
          String reference) {
    deleteEvent.accept(new DeleteEventUseCase.Request(new EventReference(reference)));
  }

  @GetMapping("api/events/{reference}")
  @Operation(
      summary = "Get Event Details",
      description =
          "Retrieve detailed information about an event including interactions and statistics.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Event details retrieved successfully",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = EventDetails.class))),
        @ApiResponse(
            responseCode = "404",
            description = "Event not found",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class))),
      })
  @ResponseBody
  public EventDetails getEvent(
      @Parameter(
              description = "Reference ID of the event",
              required = true,
              example = "Ion-and-Maria")
          @PathVariable("reference")
          String reference) {
    var eventReference = new EventReference(reference);
    var event = events.findOrThrow(eventReference);

    var visitList =
        visits
            .find(eventReference)
            .map(v -> new EventInteraction(v.visitorName(), null, v.visitTime(), "VISITED"));

    var rspvList =
        rspvs.findAllByEventReference(reference).stream()
            .map(r -> new EventInteraction(r.guest(), r.partnerName(), r.timestamp(), r.answer()));

    return concat(visitList, rspvList)
        .sorted(comparing(EventInteraction::timestamp).reversed())
        .collect(collectingAndThen(toUnmodifiableList(), rsvps -> new EventDetails(event, rsvps)));
  }

  @Schema(
      description =
          "Detailed information about an event, including its statistics and interactions.")
  public record EventDetails(
      @Schema(description = "Event details") Event event,
      @Schema(description = "List of interactions related to the event")
          List<EventInteraction> interactions,
      @Schema(description = "Number of accepted RSVPs") int acceptedCount,
      @Schema(description = "Number of visitors") int visitedCount,
      @Schema(description = "Number of declined RSVPs") int declinedCount,
      @Schema(description = "Number of attendees (including partners)") int attendingCount) {
    public EventDetails(Event event, List<EventInteraction> interactions) {
      this(
          event,
          interactions,
          countAction(interactions, "ACCEPTED"),
          countAction(interactions, "VISITED"),
          countAction(interactions, "DECLINED"),
          countAttending(interactions));
    }

    private static int countAttending(List<EventInteraction> interactions) {
      return interactions.stream()
          .filter(it -> "ACCEPTED".equals(it.action()))
          .mapToInt(it -> it.partnerName == null ? 1 : 2)
          .sum();
    }

    private static int countAction(List<EventInteraction> actions, String expetcedAction) {
      return (int)
          actions.stream()
              .map(EventInteraction::action)
              .filter(expetcedAction::equalsIgnoreCase)
              .count();
    }
  }

  @Schema(
      description =
          "Represents an interaction related to an event invitation. "
              + "An interaction can represent a ACCEPTED/DECLINED invitation or a simple VISIT.")
  public record EventInteraction(
      @Schema(description = "Name of the guest") String guest,
      @Schema(description = "Name of the guest's partner (if applicable)", nullable = true)
          @Nullable String partnerName,
      @Schema(description = "Timestamp of the interaction") Instant timestamp,
      @Schema(description = "Type of action performed. One of: [ACCEPTED | VISITED | DECLINED]")
          String action) {}
}
