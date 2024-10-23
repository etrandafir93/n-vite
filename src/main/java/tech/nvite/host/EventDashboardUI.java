package tech.nvite.host;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

import jakarta.annotation.Nullable;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.Events;
import tech.nvite.domain.model.InvitationVisits;
import tech.nvite.domain.model.RsvpRepository;
import tech.nvite.domain.usecases.DeleteEventUseCase;

@Controller
@Slf4j
@RequiredArgsConstructor
class EventDashboardUI {

    private final DeleteEventUseCase deleteEvent;
    private final InvitationVisits visits;
    private final RsvpRepository rspvs;
    private final Events events;

    @GetMapping("/events/{ref}")
    String eventDashboard(Model model, @PathVariable String ref) {
        log.debug("eventDashboard ref: {}", ref);

        var eventReference = new EventReference(ref);
        var event = events.findOrThrow(eventReference);

        var visitList = visits.find(eventReference)
            .map(v -> new EventDetails(v.visitorName(), null, v.visitTime(), "VISITED"));

        var rspvList = rspvs.findAllByEventReference(ref)
            .stream()
            .map(r -> new EventDetails(r.guest(), r.partnerName(), r.timestamp(), r.answer()));

        var wholeList = Stream.concat(visitList, rspvList)
            .sorted(Comparator.comparing(EventDetails::timestamp)
                .reversed())
            .toList();

        model.addAttribute("event", event);
		model.addAttribute("acceptedCount", countAction(wholeList, "ACCEPTED"));
        model.addAttribute("visitedCount", countAction(wholeList, "VISITED"));
        model.addAttribute("declinedCount", countAction(wholeList, "DECLINED"));

        model.addAttribute("eventActivityList", wholeList);
        model.addAttribute("attendingCount", wholeList.stream()
            .filter(it -> "ACCEPTED".equals(it.action()))
            .mapToInt(it -> it.partnerName == null ? 1 : 2)
	        .sum());

        return "eventDashboard";
    }

    private static long countAction(List<EventDetails> actions, String action) {
        return actions.stream()
            .filter(a -> action.equalsIgnoreCase(a.action()))
            .count();
    }

    @PostMapping("/events/{ref}/delete")
    String deleteEvent(Model model, @PathVariable String ref) {
        deleteEvent.accept(new DeleteEventUseCase.Request(new EventReference(ref)));
        return "redirect:/events";
    }

    private record EventDetails(String guest, @Nullable String partnerName, Instant timestamp, String action) {
    }

}
