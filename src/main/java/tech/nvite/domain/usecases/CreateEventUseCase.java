package tech.nvite.domain.usecases;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import tech.nvite.domain.model.Event;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.Events;
import tech.nvite.infra.security.SecurityAccessor;
import tech.nvite.infra.storage.GoogleCloudStorage;
import tech.nvite.util.UseCase;

import java.util.function.Function;

@UseCase
@RequiredArgsConstructor
public class CreateEventUseCase implements Function<CreateEventUseCase.Request, EventReference> {

	private final Events events;
	private final SecurityAccessor securityAccessor;
	private final GoogleCloudStorage storage;

	@Override
	public EventReference apply(CreateEventUseCase.Request req) {
		String imageUrl = storage.uploadFile(req.eventBackgroundImage());
		var evt = new Event(req.groomName(), req.brideName(), req.eventLocation(), req.eventReception(), req.eventDateTime(), imageUrl)
				.withCreatedBy(securityAccessor.getCurrentUserId());
		return events.create(evt);
	}

	@Schema(description = "Request body for creating a new wedding event")
	public record Request(
			@NotBlank(message = "Groom name is required") @Size(min = 3, max = 22, message = "Groom name must be between {min} and {max} characters") @Schema(description = "Name of the groom", example = "John Doe") String groomName,

			@NotBlank(message = "Bride name is required") @Size(min = 3, max = 22, message = "Bride name must be between {min} and {max} characters") @Schema(description = "Name of the bride", example = "Jane Smith") String brideName,

			@NotBlank(message = "Event Location is required") @Size(min = 3, max = 44, message = "Event Location must be between {min} and {max} characters") @Schema(description = "Location of the wedding event", example = "Central Park, NY") String eventLocation,

			@NotBlank(message = "Event Reception name is required") @Size(min = 3, max = 44, message = "Event Reception must be between {min} and {max} characters") @Schema(description = "Reception details of the wedding event", example = "Rooftop Dinner") String eventReception,

			@NotBlank(message = "Event Date name is required") @Size(min = 3, max = 44, message = "Event Date must be between {min} and {max} characters") @Schema(description = "Date and time of the wedding event", example = "2024-07-24T14:00:00") String eventDateTime,

			MultipartFile eventBackgroundImage
	) {
	}
}
