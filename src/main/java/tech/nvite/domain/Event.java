package tech.nvite.domain;

import static org.apache.commons.lang3.ObjectUtils.firstNonNull;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.NonNull;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Builder
@With
@Document("events")
public record Event(
    @NonNull String groomName,
    @NonNull String brideName,
    String eventLocation,
    String eventReception,
    @NonNull Instant eventDateTime,
    @With String backgroundImage,
    @With LocalDateTime created,
    @With @Id String eventReference,
    String createdBy,
    String groomParents,
    String brideParents,
    String godparents,
    String ceremonyAddress,
    String ceremonyTime,
    String ceremonyPhotoUrl,
    String ceremonyMapUrl,
    String receptionAddress,
    String receptionTime,
    String receptionPhotoUrl,
    String receptionMapUrl,
    String rsvpDeadline,
    List<String> menuOptions,
    String theme,
    EventStatus status,
    List<EventSection> sections) {

  public Event(
      String groomName,
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
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null);
  }

  public String backgroundImageOrDefault() {
    return firstNonNull(backgroundImage(), "https://www.w3schools.com/w3images/wedding.jpg");
  }
}
