package tech.nvite.infra;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
class LandingPageController {

  @GetMapping({"/v2", "/v2/"})
  String landingPage() {
    return "forward:/v2/index.html";
  }
}
