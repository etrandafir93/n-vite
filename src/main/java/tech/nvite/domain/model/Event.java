package tech.nvite.domain.model;

import jakarta.annotation.Nullable;
import lombok.Builder;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;

import static org.apache.commons.lang3.ObjectUtils.firstNonNull;

@Builder
@With
@Document("events")
public record Event(
		String groomName,
		String brideName,
		String eventLocation,
		String eventReception,
		Instant eventDateTime,
		@With @Nullable
		String backgroundImage,
		@With @Nullable
		LocalDateTime created,
		@With @Nullable @Id
		EventReference reference,
		String createdBy
) {

	public Event(String groomName,
				 String brideName,
				 String eventLocation,
				 String eventReception,
				 Instant eventDateTime,
				 String backgroundImage) {
		this(
				groomName,
				brideName,
				eventLocation,
				eventReception,
				eventDateTime,
				backgroundImage,
				null,
				null,
                null
		);
	}

	public String backgroundImageOrDefault() {
		return firstNonNull(
				backgroundImage(),
				"https://www.w3schools.com/w3images/wedding.jpg"
		);
	}
}
