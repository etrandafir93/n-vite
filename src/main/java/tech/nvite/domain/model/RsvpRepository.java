package tech.nvite.domain.model;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RsvpRepository extends MongoRepository<Rsvp, String> {
  List<Rsvp> findAllByEventReference(String ref);
}
