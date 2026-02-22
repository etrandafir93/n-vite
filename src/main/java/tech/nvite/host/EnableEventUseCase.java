package tech.nvite.host;

import java.util.function.Function;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tech.nvite.domain.EventStatus;
import tech.nvite.domain.Events;
import tech.nvite.infra.UseCase;

@Slf4j
@UseCase
@RequiredArgsConstructor
public class EnableEventUseCase implements Function<String, String> {

  private final Events events;

  @Override
  public String apply(String eventReference) {
    log.info("Enabling event {}", eventReference);
    var existing = events.findOrThrow(eventReference);
    events.edit(existing.withStatus(EventStatus.LIVE));
    log.info("Event enabled {}", eventReference);
    return eventReference;
  }
}
