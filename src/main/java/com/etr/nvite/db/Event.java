package com.etr.nvite.db;

import jakarta.annotation.Nullable;
import lombok.With;

import java.time.LocalDateTime;

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
