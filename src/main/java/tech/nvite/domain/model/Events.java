package tech.nvite.domain.model;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;
import tech.nvite.infra.security.SecurityAccessor;

import java.util.Optional;
import java.util.stream.Stream;

import static java.time.LocalDateTime.now;

@Repository
@RequiredArgsConstructor
public class Events implements CommandLineRunner {

	private final EventsMongoRepository repo;
	private final SecurityAccessor securityAccessor;

	public EventReference create(Event event) {
		Assert.isNull(event.reference(), "reference must be null when creating a new event!");
		Assert.isNull(event.created(), "created must be null when creating a new event!");

		String ref = "%s-and-%s".formatted(
				event.brideName().replace(" ", ""),
				event.groomName().replace(" ", "")
		);
		EventReference evtRef = new EventReference(ref);
		Assert.isTrue(repo.findById(evtRef).isEmpty(), "Key %s is not unique! We cannot save this event!".formatted(ref));

		var newEvent = event.withReference(evtRef)
				.withCreated(now());

		repo.save(newEvent);
		return evtRef;
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
		return find(ref)
				.orElseThrow(() -> new IllegalArgumentException("cannot find event with eventReference=" + ref));
	}

	public Stream<Event> findAllForLoggedInUser() {
		return repo.findAllByCreatedBy(securityAccessor.getCurrentUserId()).stream();
	}

	@Override
	public void run(String... args) {
	}

}
