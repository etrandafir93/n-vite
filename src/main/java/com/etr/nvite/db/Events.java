package com.etr.nvite.db;

import java.util.Optional;
import java.util.stream.Stream;

public interface Events {

	EventReference create(Event event);

	Optional<Event> find(EventReference ref);

	Stream<Event> findAll();

}
