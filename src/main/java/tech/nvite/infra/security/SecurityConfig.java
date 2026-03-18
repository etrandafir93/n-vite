package tech.nvite.infra.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

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
                        "/index.html",
                        "/login",
                        "/invitations/**",
                        "/invitation/**",
                        "/events/**",
                        "/icons/**",
                        "/css/**",
                        "/js/**",
                        "/images/**",
                        "/assets/**")
                    .permitAll()
                    .requestMatchers(
                        "/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**", "/webjars/**")
                    .permitAll()
                    .anyRequest()
                    .authenticated())
        .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
        .cors(cors -> cors.configure(http))
        .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"))
        .oauth2Login(oauth2 -> oauth2.loginPage("/login").defaultSuccessUrl("/events", true))
        .logout(
            logout ->
                logout
                    .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                    .logoutSuccessUrl("/")
                    .invalidateHttpSession(true)
                    .clearAuthentication(true)
                    .deleteCookies("JSESSIONID"));

    return http.build();
  }
}
