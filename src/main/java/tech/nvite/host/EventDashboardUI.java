package tech.nvite.host;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.Events;
import tech.nvite.domain.model.InvitationVisits;
import tech.nvite.domain.model.RsvpRepository;

import java.time.Instant;
import java.util.Comparator;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Controller
@Slf4j
@RequiredArgsConstructor
class EventDashboardUI {

	private final InvitationVisits visits;
	private final RsvpRepository rspvs;
	private final Events events;

	@GetMapping("/events/{ref}")
	String eventDashboard(Model model, @PathVariable String ref) {
		log.debug("eventDashboard ref: {}", ref);

		var eventReference = new EventReference(ref);
		var event = events.findOrThrow(eventReference);
		var visitList = visits.find(eventReference).map(v -> new EventDetails(v.visitorName(), v.visitTime(), "VISIT"));
		var rspvList = rspvs.findAllByEventReference(ref).stream().map(r -> new EventDetails(r.guest(), r.timestamp(), r.answer()));
		var wholeList = Stream.concat(visitList, rspvList).sorted(Comparator.comparing(EventDetails::timestamp).reversed()).toList();

		model.addAttribute("event", event);
		model.addAttribute("eventActivityList", wholeList);
		return "eventDashboard";
	}

	private record EventDetails(String guest, Instant timestamp, String action) {

	}

}