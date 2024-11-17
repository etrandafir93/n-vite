package tech.nvite.infra.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(
            auth ->
                auth.requestMatchers("/actuator/**")
                    .permitAll()
                    .requestMatchers("/api/**")
                    .permitAll() // temp workaround to start api testing sooner
                    .requestMatchers(
                        "/",
                        "/login",
                        "/invitations/**",
                        "/icons/**",
                        "/css/**",
                        "/js/**",
                        "/images/**")
                    .permitAll()
                    .requestMatchers(
                        "/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**", "/webjars/**")
                    .permitAll()
                    .anyRequest()
                    .authenticated())
        .oauth2Login(oauth2 -> oauth2.loginPage("/").defaultSuccessUrl("/events", true))
        .logout(
            logout ->
                logout
                    .logoutUrl("/logout")
                    .logoutSuccessUrl("/")
                    .invalidateHttpSession(true)
                    .clearAuthentication(true)
                    .deleteCookies("JSESSIONID"));

    return http.build();
  }
}
