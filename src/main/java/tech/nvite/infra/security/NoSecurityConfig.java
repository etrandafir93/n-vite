package tech.nvite.infra.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Base64;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Component;

@Configuration
@EnableWebSecurity
@Profile("test")
class NoSecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http.authorizeHttpRequests(
            auth -> auth.requestMatchers("/**").permitAll().anyRequest().permitAll())
        .csrf()
        .disable()
        .build();
  }

  @Component
  @Order(1)
  static class TestUserAuth implements Filter {

    @Override
    public void doFilter(
        ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
        throws IOException, ServletException {
      if (!(servletRequest instanceof HttpServletRequest)) {
        filterChain.doFilter(servletRequest, servletResponse);
        return;
      }

      HttpServletRequest request = (HttpServletRequest) servletRequest;
      String header = request.getHeader("Authorization");

      if (header == null) {
        filterChain.doFilter(servletRequest, servletResponse);
        return;
      }

      String token = header.split("Basic ")[1];
      token = new String(Base64.getDecoder().decode(token));
      token = token.split(":")[0];

      SecurityContextHolder.getContext()
          .setAuthentication(new TestingAuthenticationToken(token, null, "ROLE_USER"));
      filterChain.doFilter(servletRequest, servletResponse);
    }
  }
}
