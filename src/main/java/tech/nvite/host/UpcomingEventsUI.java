package tech.nvite.host;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;
import tech.nvite.app.errors.ErrorResponse;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.Events;
import tech.nvite.domain.usecases.CreateEventUseCase;
import tech.nvite.domain.usecases.EditEventUseCase;

@Controller
@Slf4j
@RequiredArgsConstructor
@Tag(name = "Upcoming Events", description = "APIs related to the upcoming event")
class UpcomingEventsUI {

  private final Events events;
  private final EditEventUseCase editEvent;
  private final CreateEventUseCase createEvent;

  @GetMapping("/events")
  public String showEvents(Model model) {
    model.addAttribute("events", getEventsForUser());
    return "upcomingEvents";
  }

  @GetMapping("/events/builder")
  public String showBuilder(@RequestParam(required = false) String eventReference, Model model) {
    log.info("showing event builder");
    if (eventReference != null) {
      events
          .find(new EventReference(eventReference))
          .ifPresent(
              evt -> {
                model.addAttribute("groomName", evt.groomName());
                model.addAttribute("brideName", evt.brideName());
                model.addAttribute("eventLocation", evt.eventLocation());
                model.addAttribute("eventReception", evt.eventReception());
                model.addAttribute("eventReference", evt.reference().value());
                model.addAttribute("eventDateTime", evt.eventDateTime());
                model.addAttribute("eventBackgroundImage", evt.backgroundImageOrDefault());
              });
    }
    return "eventBuilder";
  }

  @PostMapping("/events")
  public RedirectView saveEvent(
      @RequestParam String groomName,
      @RequestParam String brideName,
      @RequestParam String eventLocation,
      @RequestParam String eventReception,
      @RequestParam String eventDateTime,
      @RequestParam MultipartFile eventBackgroundImage,
      @RequestParam(required = false) String eventReference,
      @RequestParam String timezone,
      Model model) {

    var instant = toInstant(eventDateTime, timezone);
    if (!StringUtils.isBlank(eventReference)) {
      updateEvent(
          new EditEventUseCase.Request(
              new EventReference(eventReference),
              groomName,
              brideName,
              eventLocation,
              eventReception,
              instant,
              eventBackgroundImage));
    } else {
      createEvent(
          new CreateEventUseCase.Request(
              groomName, brideName, eventLocation, eventReception, instant, eventBackgroundImage));
    }
    return new RedirectView("/events");
  }

  private static Instant toInstant(String eventDateTime, String timezone) {
    LocalDateTime localDateTime =
        LocalDateTime.parse(eventDateTime, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"));
    ZoneId zoneId = ZoneId.of(timezone);
    ZonedDateTime zonedDateTime = localDateTime.atZone(zoneId);
    return zonedDateTime.toInstant();
  }

  @Operation(
      summary = "Update an event",
      description = "Updates an existing event based on the provided details.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Event successfully updated",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = EventReference.class))),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input data",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error while updating event",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class)))
      })
  @PutMapping("api/events")
  public EventReference updateEvent(@RequestBody EditEventUseCase.Request req) {
    return editEvent.apply(req);
  }

  @Operation(
      summary = "Create a new event",
      description = "Creates a new event with the provided details.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "201",
            description = "Event successfully created",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = EventReference.class))),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input data",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error while creating event",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class)))
      })
  @PostMapping("api/events")
  private EventReference createEvent(@RequestBody CreateEventUseCase.Request req) {
    return createEvent.apply(req);
  }

  @Operation(
      summary = "Get events for the logged-in user",
      description =
          "Returns a list of events for the logged-in user with basic details like names and event date.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "List of events successfully retrieved",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = EventListItem.class))),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error while retrieving events",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class)))
      })
  @ResponseBody
  @GetMapping("/api/events")
  public List<EventListItem> getEventsForUser() {
    return events
        .findAllForLoggedInUser()
        .map(
            evt ->
                new EventListItem(
                    evt.groomName(), evt.brideName(), evt.eventDateTime(), evt.reference().value()))
        .toList();
  }

  @Schema(
      description =
          "DTO representing an event with groom name, bride name, event date, and reference")
  public record EventListItem(
      @Schema(description = "Name of the groom", example = "Ion Popescu") String groomName,
      @Schema(description = "Name of the bride", example = "Maria Ionescu") String brideName,
      @Schema(description = "Date and time of the event", example = "2024-11-17T15:00:00Z")
          Instant dateTime,
      @Schema(description = "Reference identifier for the event", example = "Ion-and-Maria")
          String reference) {}
}
