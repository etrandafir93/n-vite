package tech.nvite.host;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.Events;
import tech.nvite.domain.usecases.CreateEventUseCase;
import tech.nvite.domain.usecases.EditEventUseCase;
import tech.nvite.infra.security.CurrentUser;

import static java.util.stream.Collectors.joining;

@Controller
@Slf4j
@RequiredArgsConstructor
class EventBuilderUI {

	private final Events events;
	private final EditEventUseCase editEvent;
	private final CreateEventUseCase createEvent;
	private final CurrentUser currentUser;

	@GetMapping("/events")
	public String showEvents(Model model) {
		var evts = events.findAllForLoggedInUser()
				.map(evt -> new EventListItem(evt.groomName(), evt.brideName(), evt.eventDateTime(), evt.reference().value()))
				.toList();

		model.addAttribute("events", evts);
		return "eventsList";
	}

	record EventListItem(String groomName, String brideName, String dateTime, String ref) {

	}

	@GetMapping("/events/builder")
	public String showBuilder(@RequestParam(required = false) String eventReference, Model model) {
		log.info("showing event builder");
		if (eventReference != null) {
			events.find(new EventReference(eventReference))
					.ifPresent(evt -> {
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
	public RedirectView saveEvent(@RequestParam String groomName, @RequestParam String brideName,
								  @RequestParam String eventLocation, @RequestParam String eventReception,
								  @RequestParam String eventDateTime, @RequestParam MultipartFile eventBackgroundImage,
								  @RequestParam(required = false) String eventReference, Model model) {

		if (!StringUtils.isBlank(eventReference)) {
			var req = new EditEventUseCase.Request(new EventReference(eventReference), groomName, brideName, eventLocation, eventReception, eventDateTime, eventBackgroundImage);
			editEvent.apply(req);
		} else {
			var req = new CreateEventUseCase.Request(groomName, brideName, eventLocation, eventReception, eventDateTime, eventBackgroundImage);
			createEvent.apply(req);
		}

		return new RedirectView("/events");
	}

}

