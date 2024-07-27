package com.etr.nvite.host.create.event;

import com.etr.nvite.db.Event;
import com.etr.nvite.db.EventReference;
import com.etr.nvite.db.Events;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class CreateEventUseCase implements Function<CreateEventRequest, EventReference> {

    private final Events events;

    @Override
    public EventReference apply(CreateEventRequest req) {
        var evt = new Event(
                req.groomName(),
                req.brideName(),
                req.eventLocation(),
                req.eventReception(),
                req.eventDateTime()
        );
        return events.create(evt);
    }
}
