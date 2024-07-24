package com.etr.nvite.host;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
class CreateEventUC {

    @Schema(description = "Request body for creating a new wedding event")
    record CreateEventRequest(
            @NotBlank(message = "Groom name is required")
            @Size(min = 3, max = 22, message = "Groom name must be between {min} and {max} characters")
            @Schema(description = "Name of the groom", example = "John Doe")
            String groomName,

            @NotBlank(message = "Bride name is required")
            @Size(min = 3, max = 22, message = "Bride name must be between {min} and {max} characters")
            @Schema(description = "Name of the bride", example = "Jane Smith")
            String brideName,

            @NotBlank(message = "Event Location is required")
            @Size(min = 3, max = 44, message = "Event Location must be between {min} and {max} characters")
            @Schema(description = "Location of the wedding event", example = "Central Park, NY")
            String eventLocation,

            @NotBlank(message = "Event Reception name is required")
            @Size(min = 3, max = 44, message = "Event Reception must be between {min} and {max} characters")
            @Schema(description = "Reception details of the wedding event", example = "Rooftop Dinner")
            String eventReception,

            @NotBlank(message = "Event Date name is required")
            @Size(min = 3, max = 44, message = "Event Date must be between {min} and {max} characters")
            @Schema(description = "Date and time of the wedding event", example = "2024-07-24T14:00:00")
            String eventDateTime
    ) {
    }

    @Schema(description = "Response body for creating a new wedding event")
    record CreateEventResponse(
            @Schema(description = "Unique reference of the created event", example = "john-and-jane")
            String reference,

            @Schema(description = "URL to access the wedding invitation", example = "http://localhost:8080/invitations/john-and-jane")
            String link
    ) {
    }

}
