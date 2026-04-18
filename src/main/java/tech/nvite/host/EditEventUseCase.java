package tech.nvite.host;

import java.time.Instant;
import java.util.List;
import java.util.function.Function;

import com.mongodb.lang.Nullable;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.With;
import lombok.extern.slf4j.Slf4j;
import tech.nvite.domain.Event;
import tech.nvite.domain.EventSection;
import tech.nvite.domain.EventStatus;
import tech.nvite.domain.Events;
import tech.nvite.infra.UseCase;

@Slf4j
@UseCase
@RequiredArgsConstructor
public class EditEventUseCase implements Function<EditEventUseCase.Request, String> {

  private final Events events;

  @Override
  public String apply(EditEventUseCase.Request req) {
    log.info("Editing event {}", req.eventReference());
    var existing = events.findOrThrow(req.eventReference());

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
            .menuOptions(req.menuOptions())
            .theme(req.theme()).envelope(req.envelope())
            .status(req.status() != null ? req.status() : existing.status())
            .sections(req.sections() != null ? req.sections() : existing.sections())
            .eventReference(req.eventReference())
            .createdBy(existing.createdBy())
            .created(existing.created())
            .build();

    String eventReference = events.edit(evt);
    log.info("Event edited {}", eventReference);
    return eventReference;
  }

  public record Request(
      @With @NonNull String eventReference,
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
      String ceremonyMapUrl,
      @Nullable String receptionVenue,
      String receptionAddress,
      String receptionTime,
      String receptionPhotoUrl,
      String receptionMapUrl,
      String rsvpDeadline,
      @Nullable List<String> menuOptions,
      @Nullable String theme, @Nullable String envelope,
      @NonNull EventStatus status,
      @Nullable List<EventSection> sections) {}
}
