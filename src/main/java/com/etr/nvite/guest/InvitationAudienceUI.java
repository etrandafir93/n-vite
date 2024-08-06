package com.etr.nvite.guest;

import com.etr.nvite.domain.model.Events;
import com.etr.nvite.domain.model.EventReference;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
@RequiredArgsConstructor
class InvitationAudienceUI {

    private final Events events;

    @GetMapping("/invitations/{ref}")
    String showInvitation(@PathVariable("ref") String ref, Model model) {
        var event = events.findOrThrow(new EventReference(ref));

        model.addAttribute("bride_name", event.brideName());
        model.addAttribute("groom_name", event.groomName());
        model.addAttribute("event_date", event.eventDateTime());
        model.addAttribute("event_location", event.eventLocation());
        model.addAttribute("event_reception", event.eventReception());

        return "invitation";
    }
}
