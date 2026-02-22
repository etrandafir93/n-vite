package tech.nvite.domain;

import static java.time.LocalDateTime.now;

import java.util.Optional;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;
import tech.nvite.infra.errors.EventNotFoundException;
import tech.nvite.infra.security.CurrentUser;

@Repository
@RequiredArgsConstructor
public class Events {

  private final EventsMongoRepository repo;
  private final CurrentUser currentUser;

  public String create(Event event) {
    Assert.notNull(event.eventReference(), "eventReference cannot be null.");
    Assert.isNull(event.created(), "created must be null when creating a new event!");

    Assert.isTrue(
        repo.findById(event.eventReference()).isEmpty(),
        "Key %s is not unique! We cannot save this event!".formatted(event.eventReference()));

    var newEvent = event.withEventReference(event.eventReference()).withCreated(now());

    repo.save(newEvent);
    return event.eventReference();
  }

  public void delete(String eventReference) {
    repo.deleteById(eventReference);
  }

  public String edit(Event event) {
    Assert.notNull(
        event.eventReference(), "eventReference must not be null when editing existing event!");
    repo.save(event);
    return event.eventReference();
  }

  public Optional<Event> find(String eventReference) {
    return repo.findById(eventReference);
  }

  public Event findOrThrow(String eventReference) {
    return find(eventReference).orElseThrow(() -> new EventNotFoundException(eventReference));
  }

  public Stream<Event> findAllForLoggedInUser() {
    return repo.findAllByCreatedBy(currentUser.get().id()).stream();
  }
}
