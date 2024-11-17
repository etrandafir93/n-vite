package tech.nvite.domain.model;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

interface EventsMongoRepository extends MongoRepository<Event, EventReference> {

  List<Event> findAllByCreatedBy(String createdBy);
}
