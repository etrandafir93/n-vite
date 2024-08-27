package tech.nvite.host;

import static java.util.stream.Collectors.joining;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.Events;
import tech.nvite.domain.usecases.CreateEventUseCase;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tech.nvite.domain.usecases.EditEventUseCase;

@Controller
@Slf4j
@RequiredArgsConstructor
class EventBuilderUI {

    private final Events events;
    private final EditEventUseCase editEvent;
    private final CreateEventUseCase createEvent;

    @GetMapping("/")
    public RedirectView redirectToEvents() {
        return new RedirectView("/events");
    }

    @GetMapping("/events")
    public String showEvents(Model model, @AuthenticationPrincipal OAuth2User principal) {
        var evts = events.findAll()
                .map(evt -> new EventListItem(evt.groomName(), evt.brideName(), evt.eventDateTime(), evt.reference().value()))
                .toList();
        log.info("showing all events, {}", evts.stream()
                .map(evt -> "%s & %s".formatted(evt.groomName, evt.brideName))
                .collect(joining(",")));

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
                                  @RequestParam String eventDateTime, @RequestParam String eventBackgroundImage,
                                  @RequestParam(required = false) String eventReference, Model model) {
        if (!StringUtils.isBlank(eventReference)) {
            var req = new EditEventUseCase.Request(new EventReference(eventReference), groomName, brideName, eventLocation, eventReception, eventDateTime, eventBackgroundImage);
            log.info("editing event {}", req);

            var resp = editEvent.apply(req);
            log.info("event edited {}", resp);
        } else {
            var req = new CreateEventUseCase.Request(groomName, brideName, eventLocation, eventReception, eventDateTime, eventBackgroundImage);
            log.info("saving event {}", req);

            var resp = createEvent.apply(req);
            log.info("event saved {}", resp);
        }

        return new RedirectView("/events");
    }

}

