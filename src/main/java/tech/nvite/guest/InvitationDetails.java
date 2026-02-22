package tech.nvite.guest;

import java.time.Instant;

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
    String theme) {}
