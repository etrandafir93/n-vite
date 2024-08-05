package com.etr.nvite.db;

import org.springframework.data.mongodb.repository.MongoRepository;

interface EventsMongoRepository extends MongoRepository<Event, String> {

	Event findByReference(EventReference reference);

}
