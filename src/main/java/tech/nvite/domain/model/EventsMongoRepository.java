package tech.nvite.domain.model;

import org.springframework.data.mongodb.repository.MongoRepository;

interface EventsMongoRepository extends MongoRepository<Event, String> {

	Event findByReference(EventReference reference);

}
