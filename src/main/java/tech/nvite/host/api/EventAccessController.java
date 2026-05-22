package tech.nvite.host.api;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tech.nvite.host.GrantEventAccessUseCase;
import tech.nvite.host.RevokeEventAccessUseCase;
import tech.nvite.host.SeeEventAccessUseCase;

@RestController
@RequestMapping("api/events/{reference}/access")
@RequiredArgsConstructor
class EventAccessController {

  private final SeeEventAccessUseCase seeEventAccessUseCase;
  private final GrantEventAccessUseCase grantEventAccessUseCase;
  private final RevokeEventAccessUseCase revokeEventAccessUseCase;

  @GetMapping
  public SeeEventAccessUseCase.Response list(@PathVariable String reference) {
    return seeEventAccessUseCase.apply(reference);
  }

  @PostMapping
  public SeeEventAccessUseCase.Response grant(
      @PathVariable String reference, @RequestBody AccessGrantRequest request) {
    return grantEventAccessUseCase.apply(
        new GrantEventAccessUseCase.Request(reference, request.email(), request.role()));
  }

  @DeleteMapping
  public SeeEventAccessUseCase.Response revoke(
      @PathVariable String reference, @RequestParam String email) {
    return revokeEventAccessUseCase.apply(new RevokeEventAccessUseCase.Request(reference, email));
  }

  record AccessGrantRequest(String email, String role) {}
}
