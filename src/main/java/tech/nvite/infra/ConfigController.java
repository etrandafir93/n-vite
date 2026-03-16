package tech.nvite.infra;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/config")
class ConfigController {

  @Value("${google.maps.api-key:}")
  private String mapsApiKey;

  @GetMapping
  public Map<String, String> config() {
    return Map.of("mapsApiKey", mapsApiKey);
  }
}
