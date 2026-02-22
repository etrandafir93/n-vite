package tech.nvite.domain.usecases;

import com.mongodb.lang.Nullable;
import java.time.Instant;
import java.util.function.Function;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.With;
import lombok.extern.slf4j.Slf4j;
import tech.nvite.app.UseCase;
import tech.nvite.domain.model.Event;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.EventStatus;
import tech.nvite.domain.model.Events;

@Slf4j
@UseCase
@RequiredArgsConstructor
public class EditEventUseCase implements Function<EditEventUseCase.Request, EventReference> {

  private final Events events;

  @Override
  public EventReference apply(EditEventUseCase.Request req) {
    log.info("Editing event {}", req.reference());
    var existing = events.findOrThrow(req.reference());

    var evt =
        Event.builder()
            .groomName(req.groomName())
            .brideName(req.brideName())
            .eventDateTime(req.eventDateTime())
            .backgroundImage(req.backgroundImageUrl())
            .eventLocation(req.ceremonyVenue())
            .eventReception(req.receptionVenue())
            .groomParents(req.groomParents())
            .brideParents(req.brideParents())
            .godparents(req.godparents())
            .ceremonyAddress(req.ceremonyAddress())
            .ceremonyTime(req.ceremonyTime())
            .ceremonyPhotoUrl(req.ceremonyPhotoUrl())
            .ceremonyMapUrl(req.ceremonyMapUrl())
            .receptionAddress(req.receptionAddress())
            .receptionTime(req.receptionTime())
            .receptionPhotoUrl(req.receptionPhotoUrl())
            .receptionMapUrl(req.receptionMapUrl())
            .rsvpDeadline(req.rsvpDeadline())
            .theme(req.theme())
            .status(req.status() != null ? req.status() : existing.status())
            .reference(req.reference())
            .createdBy(existing.createdBy())
            .created(existing.created())
            .build();

    EventReference ref = events.edit(evt);
    log.info("Event edited {}", ref.value());
    return ref;
  }

  public record Request(
      @With @NonNull EventReference reference,
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
      String ceremonyMapUrl,
      @NonNull String receptionVenue,
      String receptionAddress,
      String receptionTime,
      String receptionPhotoUrl,
      String receptionMapUrl,
      String rsvpDeadline,
      @Nullable String theme,
      @NonNull EventStatus status) {}
}
