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
    @Nullable String partnerName) {
  public Rsvp(String guest, String eventReference, RsvpAnswer answer, String partnerName) {
    this(
        null,
        Instant.now(),
        guest,
        eventReference,
        switch (answer) {
          case RsvpAnswer.Accepted __ -> "ACCEPTED";
          case RsvpAnswer.Declined __ -> "DECLINED";
        },
        partnerName);
  }
}
