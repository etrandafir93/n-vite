package com.etr.nvite.host;

import com.etr.nvite.db.Events;
import com.etr.nvite.db.Events.Event;
import com.etr.nvite.db.Events.EventReference;
import com.etr.nvite.host.CreateEventUC.CreateEventRequest;
import com.etr.nvite.host.CreateEventUC.CreateEventResponse;
import com.etr.nvite.host.FindEventsUC.GetAllEventsResponse;
import com.etr.nvite.host.FindEventsUC.GetOneEventResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/events")
class EventsController {

    private final Events events;

    @PostMapping
    @Operation(
            summary = "Create an event/wedding invitation",
            description = "Creates a new wedding invitation with the provided details and returns the invitation reference and URL."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Event created successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request due to invalid input")
    })
    CreateEventResponse create(
            @Parameter(description = "Details of the wedding invitation to be created")
            @Valid @RequestBody CreateEventRequest req
    ) {
        var evt = new Event(
                req.groomName(),
                req.brideName(),
                req.eventLocation(),
                req.eventReception(),
                req.eventDateTime()
        );

        EventReference ref = events.create(evt);
        return new CreateEventResponse(ref.value(), "http://localhost:8080/invitations/" + ref.value());
    }

    @GetMapping
    @Operation(
            summary = "Retrieve all wedding invitations",
            description = "Fetches a list of all wedding invitations with details including bride and groom names, invitation link, and reference."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of all events retrieved successfully")
    })
    List<GetAllEventsResponse> getAllEvents() {
        return events.findAll()
                .map(it -> new GetAllEventsResponse(it.brideName(), it.groomName(), toLink(it.reference()), it.reference().value()))
                .toList();
    }

    @GetMapping("/{ref}")
    @Operation(
            summary = "Retrieve a wedding invitation by reference",
            description = "Fetches the details of a wedding invitation using the provided reference."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Event details retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Event not found for the provided reference")
    })
    GetOneEventResponse getOneEvent(@PathVariable String ref) {
        return events.find(new EventReference(ref))
                .map(it -> new GetOneEventResponse(
                        it.groomName(),
                        it.brideName(),
                        it.eventLocation(),
                        it.eventReception(),
                        it.eventDateTime(),
                        it.reference().value(),
                        toLink(it.reference()),
                        it.created()))
                .orElseThrow();
    }

    private String toLink(EventReference ref) {
        return "http://localhost:8080/invitations/" + ref.value();
    }
}
