package tech.nvite.domain.model;

import java.util.stream.Stream;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
interface InvitationVisitsMongoRepository extends MongoRepository<InvitationVisit, String> {
  Stream<InvitationVisit> findAllByEventRef(String eventRef);
}
