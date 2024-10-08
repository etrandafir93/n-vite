package tech.nvite.host;

import java.time.Instant;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tech.nvite.domain.model.Event;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.Events;
import tech.nvite.domain.model.InvitationVisits;
import tech.nvite.domain.model.Rsvp;
import tech.nvite.domain.model.RsvpRepository;
import tech.nvite.domain.usecases.CreateEventUseCase;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("api/events")
@RequiredArgsConstructor
class EventBuilderRest {

    private final Events events;
    private final RsvpRepository rsvps;
    private final InvitationVisits invitationVisits;
    private final CreateEventUseCase createEvent;

    @GetMapping
    List<EvtSummary> showEvents() {
        return events.findAllForLoggedInUser()
            .map(it -> new EvtSummary(it.groomName(), it.brideName(), it.reference()
                .value()))
            .toList();
    }

    record EvtSummary(String groomName, String brideName, String reference) {
    }

    @GetMapping("{ref}")
    ResponseEntity<Event> showEvent(@PathVariable String ref) {
        return ResponseEntity.of(events.find(new EventReference(ref)));
    }

    @PostMapping
    CreatedEvtResponse createEvent(@RequestBody CreateEventUseCase.Request req) {
        return new CreatedEvtResponse(createEvent.apply(req)
            .value());
    }

    record CreatedEvtResponse(String reference) {
    }

    @GetMapping("{ref}/visits")
    InvitationVisitsResponse showEventVisits(@PathVariable String ref) {
        var visits = invitationVisits.find(new EventReference(ref))
            .map(it -> new VisitSummary(it.visitorName(), it.visitTime()))
            .toList();
        return new InvitationVisitsResponse(ref, visits);
    }
    record VisitSummary(String name, Instant visitTime) {
    }

    record InvitationVisitsResponse(String eventReference, List<VisitSummary> visits) {
    }

    @GetMapping("{ref}/rsvp")
    List<Rsvp> showEventRsvps(@PathVariable String ref) {
        return rsvps.findAllByEventReference(ref);
    }

}