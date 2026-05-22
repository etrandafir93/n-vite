package tech.nvite.infra.security;

import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserAccounts {

  private final UserAccountsMongoRepository repo;
  private final CurrentUser currentUser;
  private final AppSecurityProperties properties;

  public UserAccount current() {
    var user = currentUser.get();
    var normalizedEmail = user.normalizedEmail();
    var role = roleFor(normalizedEmail);
    var existing = repo.findById(user.id()).orElse(null);
    var createdAt = existing != null ? existing.createdAt() : Instant.now();
    return repo.save(new UserAccount(user.id(), normalizedEmail, role, createdAt, Instant.now()));
  }

  public boolean isCurrentUserAdmin() {
    return current().role() == GlobalRole.ADMIN;
  }

  private GlobalRole roleFor(String normalizedEmail) {
    if (normalizedEmail == null) {
      return GlobalRole.CUSTOMER;
    }
    return properties.getAdminEmails().stream()
            .map(String::trim)
            .map(String::toLowerCase)
            .anyMatch(normalizedEmail::equals)
        ? GlobalRole.ADMIN
        : GlobalRole.CUSTOMER;
  }
}
