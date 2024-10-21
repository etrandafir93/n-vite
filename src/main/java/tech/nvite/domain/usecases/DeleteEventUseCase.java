package tech.nvite.domain.usecases;

import java.util.function.Function;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tech.nvite.domain.model.Event;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.Events;
import tech.nvite.infra.security.CurrentUser;
import tech.nvite.infra.storage.GoogleCloudStorage;
import tech.nvite.util.UseCase;

@Slf4j
@UseCase
@RequiredArgsConstructor
public class DeleteEventUseCase implements Function<DeleteEventUseCase.Request, Void> {

    private final Events events;
	private final GoogleCloudStorage storage;

	@Override
    public Void apply(DeleteEventUseCase.Request req) {
        log.info("Deleting event {}", req);
        var event = events.findOrThrow(req.reference());

        events.delete(req.reference());

//        if (event.backgroundImage() != null) {
//            storage.delete(event.backgroundImage());
//        }

        log.info("Event deleted {}", req.reference());
        return null;
    }

    @Schema(description = "Request body for deleting existing wedding event")
    public record Request(EventReference reference) {
    }
}
