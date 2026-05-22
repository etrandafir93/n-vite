package tech.nvite.infra.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
class AuthController {

  private final UserAccounts userAccounts;

  @GetMapping("/me")
  MeResponse me(Authentication authentication) {
    if (authentication == null
        || !(authentication.getPrincipal() instanceof OAuth2User principal)) {
      return new MeResponse(false, null, null, null);
    }

    var account = userAccounts.current();
    String email = account.email();
    String name = email != null ? email.split("@")[0] : null;
    return new MeResponse(true, name, email, account.role().name());
  }

  record MeResponse(boolean authenticated, String name, String email, String role) {}
}
