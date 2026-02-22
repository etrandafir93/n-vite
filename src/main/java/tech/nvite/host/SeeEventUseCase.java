package tech.nvite.host;

import java.time.Instant;
import java.util.function.Function;
import lombok.RequiredArgsConstructor;
import tech.nvite.domain.Events;
import tech.nvite.host.api.EventBuilderMapper;
import tech.nvite.infra.UseCase;

@UseCase
@RequiredArgsConstructor
public class SeeEventUseCase implements Function<String, SeeEventUseCase.EventFormResponse> {

  private final Events events;
  private final EventBuilderMapper mapper;

  @Override
  public EventFormResponse apply(String reference) {
    var evt = events.findOrThrow(reference);
    return mapper.toFormResponse(evt);
  }

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
      String status) {}
}
