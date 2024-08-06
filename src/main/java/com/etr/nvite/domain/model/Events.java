package com.etr.nvite.domain.model;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import static java.time.LocalDateTime.now;

import com.etr.nvite.domain.model.Event;
import com.etr.nvite.domain.model.EventReference;

@Repository
public class Events {
    private final Map<EventReference, Event> events = new HashMap<>();

    @PostConstruct
    void testEvents() {
        create(new Event("John Snow", "Daeneys", "Castely Rock", "North of the Wall", now().minusYears(10).toString()));
        create(new Event("Dorel", "Ileana", "Turnu Magurele", "Biserica Sf Patrafir", now().plusDays(10).toString()));
    }

    public EventReference create(Event event) {
        Assert.isNull(event.reference(), "reference must be null when creating a new event!");
        Assert.isNull(event.created(), "created must be null when creating a new event!");

        String ref = "%s-and-%s".formatted(
                event.brideName().replace(" ", ""),
                event.groomName().replace(" ", "")
        );
        EventReference evtRef = new EventReference(ref);
        Assert.isNull(events.get(evtRef), "Key %s is not unique! We cannot save this event!".formatted(ref));

        var newEvent = event.withReference(evtRef)
                .withCreated(now());

        events.put(evtRef, newEvent);
        return evtRef;
    }

    public Optional<Event> find(EventReference ref) {
        return Optional.ofNullable(events.get(ref));
    }

    public Event findOrThrow(EventReference ref) {
        return find(ref)
            .orElseThrow(() -> new IllegalArgumentException("cannot find event with eventReference=" + ref));
    }

    public Stream<Event> findAll() {
        return events.values().stream();
    }


}
