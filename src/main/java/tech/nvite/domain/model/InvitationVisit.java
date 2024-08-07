package tech.nvite.domain.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.annotation.Nullable;

@Document
public record InvitationVisit(@Id @Nullable String id, Instant visitTime, String visitorName, String eventRef) {
    public InvitationVisit(Instant visitTime, String visitorName, String eventRef) {
        this(null, visitTime, visitorName, eventRef);
    }
}