package com.etr.nvite.db;

import jakarta.annotation.Nullable;
import lombok.With;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

@Repository
public class Events {
    private final Map<EventReference, Event> events = new HashMap<>();

    public EventReference create(Event event) {
        Assert.isNull(event.reference, "reference must be null when creating a new event!");
        Assert.isNull(event.created, "created must be null when creating a new event!");

        String ref = "%s-and-%s".formatted(
                event.brideName.replace(" ", ""),
                event.groomName.replace(" ", "")
        );
        EventReference evtRef = new EventReference(ref);
        Assert.isNull(events.get(evtRef), "Key %s is not unique! We cannot save this event!".formatted(ref));

        var newEvent = event.withReference(evtRef)
                .withCreated(LocalDateTime.now());

        events.put(evtRef, newEvent);
        return evtRef;
    }

    public Optional<Event> find(EventReference ref) {
        return Optional.ofNullable(events.get(ref));
    }

    public Stream<Event> findAll() {
        return events.values().stream();
    }

    public record EventReference(String value) {
    }

    public record Event(
            String groomName,
            String brideName,
            String eventLocation,
            String eventReception,
            String eventDateTime,

            @With @Nullable
            LocalDateTime created,
            @With @Nullable
            EventReference reference
    ) {

        public Event(String groomName,
                     String brideName,
                     String eventLocation,
                     String eventReception,
                     String eventDateTime) {
            this(
                    groomName,
                    brideName,
                    eventLocation,
                    eventReception,
                    eventDateTime,
                    null,
                    null
            );
        }
    }
}
