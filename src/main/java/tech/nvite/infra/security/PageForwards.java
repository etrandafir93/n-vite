package tech.nvite.infra.security;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
class PageForwards {

  @GetMapping("/")
  String home() {
    return "forward:/index.html";
  }

  @GetMapping("/invitations/{ref}")
  String invitationPage(@PathVariable String ref) {
    return "forward:/index.html";
  }

  @GetMapping("/invitation/{invitationName}/{style}")
  String invitations(@PathVariable String invitationName, @PathVariable String style) {
    return "forward:/index.html";
  }

  @GetMapping("/events")
  String eventsDashboard() {
    return "forward:/index.html";
  }

  @GetMapping("/events/builder")
  String eventsBuilder() {
    return "forward:/index.html";
  }

  @GetMapping("/events/{ref}/dashboard")
  String eventDashboard(@PathVariable String ref) {
    return "forward:/index.html";
  }
}
