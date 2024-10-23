package tech.nvite.domain.usecases;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.Events;
import tech.nvite.infra.storage.GoogleCloudStorage;
import tech.nvite.util.UseCase;

import java.util.function.Consumer;

@Slf4j
@UseCase
@RequiredArgsConstructor
public class DeleteEventUseCase implements Consumer<DeleteEventUseCase.Request> {

    private final Events events;
	private final GoogleCloudStorage storage;

	@Override
    public void accept(DeleteEventUseCase.Request req) {
        log.info("Deleting event {}", req);
        var event = events.findOrThrow(req.reference());

        events.delete(req.reference());

//        if (event.backgroundImage() != null) {
//            storage.delete(event.backgroundImage());
//        }

        log.info("Event deleted {}", req.reference());
    }

    @Schema(description = "Request body for deleting existing wedding event")
    public record Request(EventReference reference) {
    }
}
