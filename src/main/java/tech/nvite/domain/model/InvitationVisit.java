package tech.nvite.domain.model;

import jakarta.annotation.Nullable;
import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public record InvitationVisit(
    @Id @Nullable String id, Instant visitTime, String visitorName, String eventRef) {
  public InvitationVisit(Instant visitTime, String visitorName, String eventRef) {
    this(null, visitTime, visitorName, eventRef);
  }
}
