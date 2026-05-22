package tech.nvite.domain;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class EventAccessGrants {

  private final EventAccessGrantsMongoRepository repo;

  public Optional<EventAccessGrant> find(String eventReference, String userEmail) {
    return repo.findByEventReferenceAndUserEmail(eventReference, normalize(userEmail));
  }

  public List<EventAccessGrant> findByEventReference(String eventReference) {
    return repo.findAllByEventReference(eventReference);
  }

  public List<EventAccessGrant> findByUserEmail(String userEmail) {
    return repo.findAllByUserEmail(normalize(userEmail));
  }

  public EventAccessGrant grant(
      String eventReference, String userEmail, EventAccessRole role, String grantedBy) {
    var normalizedEmail = normalize(userEmail);
    var id = "%s:%s".formatted(eventReference, normalizedEmail);
    return repo.save(
        new EventAccessGrant(
            id, eventReference, normalizedEmail, role, normalize(grantedBy), Instant.now()));
  }

  public void revoke(String eventReference, String userEmail) {
    repo.deleteByEventReferenceAndUserEmail(eventReference, normalize(userEmail));
  }

  private String normalize(String email) {
    return email == null ? null : email.trim().toLowerCase(Locale.ROOT);
  }
}
