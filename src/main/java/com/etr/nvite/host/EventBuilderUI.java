package com.etr.nvite.host;

import static java.util.stream.Collectors.joining;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

import com.etr.nvite.domain.model.Events;
import com.etr.nvite.domain.usecases.CreateEventUseCase;
import com.etr.nvite.domain.usecases.CreateEventUseCase.Request;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
class EventBuilderUI {

    private final Events events;
    private final CreateEventUseCase createEvent;

    @GetMapping("/")
    public RedirectView redirectToEvents() {
        return new RedirectView("/events");
    }

    @GetMapping("/events")
    public String showEvents(Model model) {
        var evts = events.findAll()
            .map(evt -> new EventListItem(evt.groomName(), evt.brideName(), evt.eventDateTime(), "/invitations/" + evt.reference()
                .value()))
            .toList();
        log.info("showing all events, {}", evts.stream()
            .map(evt -> "%s & %s".formatted(evt.groomName, evt.brideName))
            .collect(joining(",")));

        model.addAttribute("events", evts);
        return "eventsList";
    }

    record EventListItem(String groomName, String brideName, String dateTime, String link) {
    }

    @GetMapping("/events/builder")
    public String showBuilder() {
        log.info("showing event builder");
        return "eventBuilder";
    }

    @PostMapping("/events")
    public RedirectView createEvent(@RequestParam String groomName, @RequestParam String brideName, @RequestParam String eventLocation, @RequestParam String eventReception, @RequestParam String eventDateTime, Model model) {
        var req = new Request(groomName, brideName, eventLocation, eventReception, eventDateTime);
        log.info("saving event {}", req);

        var resp = createEvent.apply(req);
        log.info("event saved {}", resp);
        return new RedirectView("/events");
    }

}

