package com.etr.nvite.db;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.util.Optional;
import java.util.stream.Stream;

import static java.time.LocalDateTime.now;

@Repository
@RequiredArgsConstructor
class MongoEvents implements Events, CommandLineRunner {

	private final EventsMongoRepository repo;

	@Override
	public EventReference create(Event event) {
		Assert.isNull(event.reference(), "reference must be null when creating a new event!");
		Assert.isNull(event.created(), "created must be null when creating a new event!");

		String ref = "%s-and-%s".formatted(
				event.brideName().replace(" ", ""),
				event.groomName().replace(" ", "")
		);
		EventReference evtRef = new EventReference(ref);
		Assert.isNull(repo.findByReference(evtRef), "Key %s is not unique! We cannot save this event!".formatted(ref));

		var newEvent = event.withReference(evtRef)
				.withCreated(now());

		repo.save(newEvent);
		return evtRef;
	}

	@Override
	public Optional<Event> find(EventReference ref) {
		return Optional.ofNullable(repo.findByReference(ref));
	}

	@Override
	public Stream<Event> findAll() {
		return repo.findAll().stream();
	}

	@Override
	public void run(String... args) {
		if (repo.count() == 0) {
			create(new Event("John Snow", "Daeneys", "Castely Rock", "North of the Wall", now().minusYears(10).toString()));
			create(new Event("Dorel", "Ileana", "Turnu Magurele", "Biserica Sf Patrafir", now().plusDays(10).toString()));
		}
	}

}