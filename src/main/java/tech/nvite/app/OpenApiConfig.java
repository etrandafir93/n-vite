package tech.nvite.app;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.OAuthFlow;
import io.swagger.v3.oas.annotations.security.OAuthFlows;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@SecurityScheme(
    type = SecuritySchemeType.OAUTH2,
    name = "Google OAuth2",
    description = "OAuth2 Authentication with Google",
    flows =
        @OAuthFlows(
            authorizationCode =
                @OAuthFlow(
                    authorizationUrl = "https://accounts.google.com/o/oauth2/auth",
                    tokenUrl = "https://oauth2.googleapis.com/token")),
    bearerFormat = "JWT",
    in = SecuritySchemeIn.HEADER,
    scheme = "bearer")
class OpenApiConfig {

  @Bean
  OpenAPI customOpenAPI() {
    return new OpenAPI()
        .info(
            new Info()
                .title("N-Vite API Documentation")
                .version("1.0")
                .description(
                    "This the OpenAPI documentation of the main operations supported by N-Vite backend.")
                .contact(
                    new Contact()
                        .name("N-Vite Tech Support")
                        .email("support@nvite.com")
                        .url("n-vite.slack.com")));
  }
}
