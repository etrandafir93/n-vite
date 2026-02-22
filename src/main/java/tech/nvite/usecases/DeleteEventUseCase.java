package tech.nvite.usecases;

import java.util.function.Consumer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tech.nvite.domain.Events;
import tech.nvite.infra.UseCase;
import tech.nvite.infra.storage.GoogleCloudStorage;

@Slf4j
@UseCase
@RequiredArgsConstructor
public class DeleteEventUseCase implements Consumer<DeleteEventUseCase.Request> {

  private final Events events;
  private final GoogleCloudStorage storage;

  @Override
  public void accept(DeleteEventUseCase.Request req) {
    log.info("Deleting event {}", req);
    var event = events.findOrThrow(req.eventReference());

    events.delete(req.eventReference());

    //        if (event.backgroundImage() != null) {
    //            storage.delete(event.backgroundImage());
    //        }

    log.info("Event deleted {}", req.eventReference());
  }

  public record Request(String eventReference) {}
}
