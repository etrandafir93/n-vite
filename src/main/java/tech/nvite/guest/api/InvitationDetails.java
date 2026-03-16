package tech.nvite.guest.api;

import java.time.Instant;
import java.util.List;
import tech.nvite.domain.EventStatus;

record InvitationDetails(
    String brideName,
    String groomName,
    Instant eventDate,
    String eventReference,
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
    List<String> menuOptions,
    String theme,
    EventStatus status) {}
