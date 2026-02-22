package tech.nvite.domain;

import java.time.Instant;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InvitationVisits {

  private final InvitationVisitsMongoRepository repository;

  public void add(InvitationVisitor visitor, String eventReference) {
    String visitorName =
        switch (visitor) {
          case InvitationVisitor.NamedGuest(String name) -> name;
          case InvitationVisitor.Anonymous __ -> "ANONYMOUS";
        };
    repository.save(new InvitationVisit(Instant.now(), visitorName, eventReference));
  }

  public Stream<InvitationVisit> find(String eventReference) {
    return repository.findAllByEventRef(eventReference);
  }
}
