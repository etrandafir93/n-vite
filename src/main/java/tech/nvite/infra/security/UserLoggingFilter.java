package tech.nvite.infra.security;

import jakarta.servlet.*;
import java.io.IOException;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Component;

@Component
@Order(2)
class UserLoggingFilter implements Filter {
  private static final String USER_KEY = "username";

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

      if (authentication instanceof TestingAuthenticationToken testAuth) {
        MDC.put(USER_KEY, testAuth.getPrincipal().toString());
        chain.doFilter(request, response);
        return;
      }

      if (authentication != null
          && authentication.getPrincipal() != null
          && authentication.getPrincipal() instanceof DefaultOAuth2User user) {
        MDC.put(USER_KEY, user.getAttribute("email"));
      } else {
        MDC.put(USER_KEY, "anonymous");
      }
      chain.doFilter(request, response);
    } finally {
      MDC.remove(USER_KEY);
    }
  }

  @Override
  public void init(FilterConfig filterConfig) throws ServletException {}

  @Override
  public void destroy() {}
}
