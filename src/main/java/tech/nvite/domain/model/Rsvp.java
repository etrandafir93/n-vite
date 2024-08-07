package tech.nvite.domain.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.annotation.Nullable;

@Document
public record Rsvp(@Id @Nullable String id, Instant timestamp, String guest, String eventReference, String answer) {
    public Rsvp(String guest, EventReference eventReference, RsvpAnswer answer) {
        this(null, Instant.now(), guest, eventReference.value(), switch (answer) {
            case RsvpAnswer.Accept _ -> "ACCEPTED";
            case RsvpAnswer.Decline _ -> "DECLINE";
        });
    }
}
