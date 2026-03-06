package tech.nvite.domain;

import jakarta.annotation.Nullable;
import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public record Rsvp(
    @Id @Nullable String id,
    Instant timestamp,
    String guest,
    String eventReference,
    String answer,
    @Nullable String partnerName,
    @Nullable String menuPreference,
    @Nullable Integer children,
    @Nullable Boolean transport,
    @Nullable String notes) {
  public Rsvp(
      String guest,
      String eventReference,
      RsvpAnswer answer,
      String partnerName,
      String menuPreference,
      Integer children,
      Boolean transport,
      String notes) {
    this(
        null,
        Instant.now(),
        guest,
        eventReference,
        switch (answer) {
          case RsvpAnswer.Accepted __ -> "ACCEPTED";
          case RsvpAnswer.Declined __ -> "DECLINED";
        },
        partnerName,
        menuPreference,
        children,
        transport,
        notes);
  }
}
