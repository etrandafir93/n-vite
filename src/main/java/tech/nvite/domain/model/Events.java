package tech.nvite.domain.model;

import static java.time.LocalDateTime.now;

import java.util.Optional;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;
import tech.nvite.app.errors.EventNotFoundException;
import tech.nvite.infra.security.CurrentUser;

@Repository
@RequiredArgsConstructor
public class Events {

  private final EventsMongoRepository repo;
  private final CurrentUser currentUser;

  public EventReference create(Event event) {
    Assert.notNull(event.reference(), "reference cannot be null.");
    Assert.isNull(event.created(), "created must be null when creating a new event!");

    Assert.isTrue(
        repo.findById(event.reference()).isEmpty(),
        "Key %s is not unique! We cannot save this event!".formatted(event.reference().value()));

    var newEvent = event.withReference(event.reference()).withCreated(now());

    repo.save(newEvent);
    return event.reference();
  }

  public void delete(EventReference ref) {
    repo.deleteById(ref);
  }

  public EventReference edit(Event event) {
    Assert.notNull(event.reference(), "Reference must not be null when editing existing event!");
    repo.save(event);
    return event.reference();
  }

  public Optional<Event> find(EventReference ref) {
    return repo.findById(ref);
  }

  public Event findOrThrow(EventReference ref) {
    return find(ref).orElseThrow(() -> new EventNotFoundException(ref));
  }

  public Stream<Event> findAllForLoggedInUser() {
    return repo.findAllByCreatedBy(currentUser.get().id()).stream();
  }
}
