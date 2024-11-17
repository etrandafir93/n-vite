package tech.nvite.host;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import tech.nvite.domain.model.*;
import tech.nvite.domain.usecases.DeleteEventUseCase;

import java.time.Instant;
import java.util.List;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.collectingAndThen;
import static java.util.stream.Collectors.toUnmodifiableList;
import static java.util.stream.Stream.concat;

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
		var dto = getEvent(ref);

		model.addAttribute("event", dto.event);
		model.addAttribute("acceptedCount", dto.acceptedCount);
		model.addAttribute("visitedCount", dto.visitedCount);
		model.addAttribute("declinedCount", dto.declinedCount);
		model.addAttribute("attendingCount", dto.attendingCount);
		model.addAttribute("eventInteractions", dto.interactions);
		return "eventDashboard";
	}

	private static int countAction(List<EventInteraction> actions, String expetcedAction) {
		return (int) actions.stream()
				.map(EventInteraction::action)
				.filter(expetcedAction::equalsIgnoreCase)
				.count();
	}

	@PostMapping("/events/{ref}/delete")
	String deleteEvent(Model model, @PathVariable String ref) {
		deleteEvent.accept(new DeleteEventUseCase.Request(new EventReference(ref)));
		return "redirect:/events";
	}

	@ResponseBody
	@GetMapping("api/events/{reference}")
	EventDetails getEvent(@PathVariable("reference") String reference) {
		var eventReference = new EventReference(reference);
		var event = events.findOrThrow(eventReference);

		var visitList = visits.find(eventReference)
				.map(v -> new EventInteraction(v.visitorName(), null, v.visitTime(), "VISITED"));

		var rspvList = rspvs.findAllByEventReference(reference)
				.stream()
				.map(r -> new EventInteraction(r.guest(), r.partnerName(), r.timestamp(), r.answer()));

		return concat(visitList, rspvList)
				.sorted(comparing(EventInteraction::timestamp).reversed())
				.collect(collectingAndThen(
						toUnmodifiableList(),
						rsvps -> new EventDetails(event, rsvps)
				));
	}


	record EventDetails(
			Event event,
			List<EventInteraction> interactions,
			int acceptedCount,
			int visitedCount,
			int declinedCount,
			int attendingCount
	) {
		public EventDetails(Event event, List<EventInteraction> interactions) {
			this(
					event,
					interactions,
					countAction(interactions, "ACCEPTED"),
					countAction(interactions, "VISITED"),
					countAction(interactions, "DECLINED"),
					countAttending(interactions)
			);
		}

		private static int countAttending(List<EventInteraction> interactions) {
			return interactions.stream()
					.filter(it -> "ACCEPTED".equals(it.action()))
					.mapToInt(it -> it.partnerName == null ? 1 : 2)
					.sum();
		}
	}

	record EventInteraction(String guest, @Nullable String partnerName, Instant timestamp, String action) {
	}

}
