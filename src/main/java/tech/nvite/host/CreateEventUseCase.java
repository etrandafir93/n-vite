package tech.nvite.host;

import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.UUID;
import java.util.function.Function;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tech.nvite.domain.Event;
import tech.nvite.domain.EventStatus;
import tech.nvite.domain.Events;
import tech.nvite.infra.UseCase;
import tech.nvite.infra.security.CurrentUser;

@Slf4j
@UseCase
@RequiredArgsConstructor
public class CreateEventUseCase implements Function<CreateEventUseCase.Request, String> {

  private final Events events;
  private final CurrentUser currentUser;

  @Override
  public String apply(CreateEventUseCase.Request req) {
    log.info("Creating event for {} and {}", req.groomName(), req.brideName());

    var eventReference = newEventReference(req.brideName(), req.groomName());
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
            .status(req.status() != null ? req.status() : EventStatus.LIVE)
            .eventReference(eventReference)
            .createdBy(currentUser.get().id())
            .build();

    events.create(evt);
    log.info("Event created eventReference={}", eventReference);
    return eventReference;
  }

  private String newEventReference(String bride, String groom) {
    String slug = "%s-and-%s".formatted(bride.replace(" ", ""), groom.replace(" ", ""));
    return events.find(slug).isPresent() ? UUID.randomUUID().toString() : slug;
  }

  public record Request(
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
}
