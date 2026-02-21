package tech.nvite.infra;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Slf4j
@Controller
class V2PageController {

  @GetMapping("/v2")
  String landingPage() {
    log.info("Serving V2 landing page");
    return "forward:/v2/index.html";
  }

  @GetMapping("/v2/invitations/{ref}")
  String invitationPage(@PathVariable String ref) {
    log.info("Serving V2 invitation page for ref: {}", ref);
    return "forward:/v2/index.html";
  }

  @GetMapping("/v2/invitation/{invitationName}/{style}")
  String invitations(@PathVariable String invitationName, @PathVariable String style) {
    log.info("Serving V2 invitation page for name: {} and style: {}", invitationName, style);
    return "forward:/v2/index.html";
  }

  @GetMapping("/v2/events")
  String eventsDashboard() {
    log.info("Serving V2 events dashboard");
    return "forward:/v2/index.html";
  }

  @GetMapping("/v2/events/builder")
  String eventsBuilder() {
    log.info("Serving V2 events builder");
    return "forward:/v2/index.html";
  }

  @GetMapping("/v2/events/{ref}/dashboard")
  String eventDashboard(@PathVariable String ref) {
    log.info("Serving V2 event dashboard for reference: {}", ref);
    return "forward:/v2/index.html";
  }
}
