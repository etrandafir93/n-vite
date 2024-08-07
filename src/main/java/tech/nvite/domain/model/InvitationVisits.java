package tech.nvite.domain.model;

import java.time.Instant;
import java.util.stream.Stream;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class InvitationVisits {

    private final InvitationVisitsMongoRepository repository;

    public void add(InvitationVisitor visitor, EventReference event) {
        String visitorName = switch (visitor) {
            case InvitationVisitor.NamedGuest(String name) -> name;
            case InvitationVisitor.Anonymous _ -> "ANONYMOUS";
        };
        repository.save(new Visit(Instant.now(), visitorName, event.value()));
    }

    public Stream<Visit> find(EventReference ref) {
        return repository.findAllByEventRef(ref.value());
    }
}