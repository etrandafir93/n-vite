package com.etr.nvite.domain.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.stereotype.Repository;

import com.etr.nvite.domain.model.InvitationVisitor.Anonymous;
import com.etr.nvite.domain.model.InvitationVisitor.NamedGuest;

@Repository
public class InvitationVisits {
    private final List<Visit> visits = new ArrayList<>();

    public void add(InvitationVisitor visitor, EventReference event) {
        String visitorName = switch(visitor) {
            case NamedGuest(String name) -> name;
            case Anonymous _ -> "ANONYMOUS";
        };
        visits.add(new Visit(Instant.now(), visitorName, event.value()));
    }

    public record Visit(Instant visitTime, String visitorName, String eventRef) {
    }

    public Stream<Visit> find(EventReference ref) {
        return visits.stream()
            .filter(it -> ref.value().equals(it.eventRef));
    }
}

