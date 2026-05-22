package tech.nvite.domain;

import java.util.Collection;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

interface EventsMongoRepository extends MongoRepository<Event, String> {

  List<Event> findAllByCreatedBy(String createdBy);

  List<Event> findAllByOwnerEmail(String ownerEmail);

  List<Event> findAllByEventReferenceIn(Collection<String> eventReferences);
}
