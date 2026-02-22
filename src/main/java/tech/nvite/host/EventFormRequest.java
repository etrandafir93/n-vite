package tech.nvite.host;

import jakarta.annotation.Nullable;
import java.time.Instant;
import lombok.NonNull;
import tech.nvite.domain.model.EventStatus;

record EventFormRequest(
    @NonNull String groomName,
    @NonNull String brideName,
    @NonNull Instant eventDateTime,
    @NonNull String backgroundImageUrl,
    String groomParents,
    String brideParents,
    String godparents,
    @NonNull String ceremonyVenue,
    String ceremonyAddress,
    String ceremonyTime,
    String ceremonyPhotoUrl,
    @Nullable String ceremonyMapUrl,
    @NonNull String receptionVenue,
    String receptionAddress,
    String receptionTime,
    String receptionPhotoUrl,
    @Nullable String receptionMapUrl,
    String rsvpDeadline,
    @Nullable String theme,
    @NonNull EventStatus status) {}
