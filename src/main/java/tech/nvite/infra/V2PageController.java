package tech.nvite.infra;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
class V2PageController {

  @GetMapping("/v2")
  String landingPage() {
    return "forward:/v2/index.html";
  }

  @GetMapping("/v2/invitation/{invitationName}/{style}")
  String invitations(@PathVariable String invitationName, @PathVariable String style) {
    return "forward:/v2/index.html";
  }
}
