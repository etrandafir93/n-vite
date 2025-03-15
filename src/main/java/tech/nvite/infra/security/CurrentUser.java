package tech.nvite.infra.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import tech.nvite.app.errors.NoUserInContextException;

@Slf4j
@Component
public class CurrentUser {

  public User get() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth instanceof TestingAuthenticationToken testAuth) {
      return new User(testAuth.toString(), testAuth.toString() + "@nvite.com");
    }
    if (auth == null || !(auth.getPrincipal() instanceof OAuth2User principal)) {
      throw new NoUserInContextException();
    }
    log.debug("Current User Data: {}", principal);
    return new User(principal.getAttribute("sub"), principal.getAttribute("email"));
  }

  public record User(String id, String email) {}
}
