package tech.nvite.domain;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

interface EventAccessGrantsMongoRepository extends MongoRepository<EventAccessGrant, String> {

  Optional<EventAccessGrant> findByEventReferenceAndUserEmail(String eventReference, String userEmail);

  List<EventAccessGrant> findAllByEventReference(String eventReference);

  List<EventAccessGrant> findAllByUserEmail(String userEmail);

  void deleteByEventReferenceAndUserEmail(String eventReference, String userEmail);
}
