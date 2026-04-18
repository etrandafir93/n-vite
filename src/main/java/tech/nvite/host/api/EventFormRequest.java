package tech.nvite.host.api;

import java.time.Instant;
import java.util.List;

import jakarta.annotation.Nullable;

import lombok.NonNull;
import tech.nvite.domain.EventSection;
import tech.nvite.domain.EventStatus;

record EventFormRequest(
    @NonNull String groomName,
    @NonNull String brideName,
    @NonNull Instant eventDateTime,
    @NonNull String backgroundImageUrl,
    String groomParents,
    String brideParents,
    String godparents,
    @Nullable String ceremonyVenue,
    String ceremonyAddress,
    String ceremonyTime,
    String ceremonyPhotoUrl,
    @Nullable String ceremonyMapUrl,
    @Nullable String receptionVenue,
    String receptionAddress,
    String receptionTime,
    String receptionPhotoUrl,
    @Nullable String receptionMapUrl,
    String rsvpDeadline,
    @Nullable List<String> menuOptions,
    @Nullable String theme, @Nullable String envelope,
    @NonNull EventStatus status,
    @Nullable List<EventSection> sections) {}
