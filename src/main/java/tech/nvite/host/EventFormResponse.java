package tech.nvite.host;

import java.time.Instant;
import tech.nvite.domain.model.EventStatus;

public record EventFormResponse(
    String eventReference,
    String groomName,
    String brideName,
    Instant eventDateTime,
    String backgroundImageUrl,
    String groomParents,
    String brideParents,
    String godparents,
    String ceremonyVenue,
    String ceremonyAddress,
    String ceremonyTime,
    String ceremonyPhotoUrl,
    String ceremonyMapUrl,
    String receptionVenue,
    String receptionAddress,
    String receptionTime,
    String receptionPhotoUrl,
    String receptionMapUrl,
    String rsvpDeadline,
    String theme,
    EventStatus status) {}
