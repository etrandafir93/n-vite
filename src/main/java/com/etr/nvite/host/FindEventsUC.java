package com.etr.nvite.host;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
class FindEventsUC {

    @Schema(description = "Response body for retrieving all wedding events")
    public record GetAllEventsResponse(
            @Schema(description = "Name of the bride", example = "Jane Smith")
            String brideName,

            @Schema(description = "Name of the groom", example = "John Doe")
            String groomName,

            @Schema(description = "URL to access the wedding invitation", example = "http://localhost:8080/invitations/john-and-jane")
            String link,

            @Schema(description = "Unique reference of the event", example = "john-and-jane")
            String ref
    ) {
    }

    @Schema(description = "Response body for retrieving a wedding event")
    public record GetOneEventResponse(
            @Schema(description = "Name of the groom", example = "John Doe")
            String groomName,

            @Schema(description = "Name of the bride", example = "Jane Smith")
            String brideName,

            @Schema(description = "Location of the wedding event", example = "Central Park, NY")
            String eventLocation,

            @Schema(description = "Reception details of the wedding event", example = "Rooftop Dinner")
            String eventReception,

            @Schema(description = "Date and time of the wedding event", example = "2024-07-24T14:00:00")
            String eventDateTime,

            @Schema(description = "Unique reference of the event", example = "john-and-jane")
            String reference,

            @Schema(description = "URL to access the wedding invitation", example = "http://localhost:8080/invitations/john-and-jane")
            String link,

            @Schema(description = "Creation timestamp of the event", example = "2024-07-24T14:00:00")
            LocalDateTime createdDate
    ) {
    }
}
