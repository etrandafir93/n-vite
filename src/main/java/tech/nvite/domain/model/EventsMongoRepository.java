package tech.nvite.domain.model;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

interface EventsMongoRepository extends MongoRepository<Event, EventReference> {

	List<Event> findAllByCreatedBy(String createdBy);

}
