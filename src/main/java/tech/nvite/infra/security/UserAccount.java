package tech.nvite.infra.security;

import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("user_accounts")
public record UserAccount(
    @Id String userId, String email, GlobalRole role, Instant createdAt, Instant lastLoginAt) {}
