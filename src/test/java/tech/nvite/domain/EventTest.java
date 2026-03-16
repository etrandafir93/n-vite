package tech.nvite.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;

class EventTest {

  private static final Instant DATE = Instant.parse("2026-06-15T12:00:00Z");

  @Test
  void backgroundImageOrDefaultReturnsActualImageWhenSet() {
    var event = minimalEvent().withBackgroundImage("https://img.com/photo.jpg");

    assertThat(event.backgroundImageOrDefault()).isEqualTo("https://img.com/photo.jpg");
  }

  @Test
  void backgroundImageOrDefaultReturnsFallbackWhenNull() {
    var event = minimalEvent().withBackgroundImage(null);

    assertThat(event.backgroundImageOrDefault())
        .isEqualTo("https://www.w3schools.com/w3images/wedding.jpg");
  }

  @Test
  void withBackgroundImageProducesNewInstanceWithUpdatedField() {
    var original = minimalEvent().withBackgroundImage("original.jpg");
    var updated = original.withBackgroundImage("updated.jpg");

    assertThat(updated.backgroundImage()).isEqualTo("updated.jpg");
    assertThat(original.backgroundImage()).isEqualTo("original.jpg");
  }

  @Test
  void withStatusProducesNewInstanceWithUpdatedStatus() {
    var draft = minimalEvent().withStatus(EventStatus.DRAFT);
    var live = draft.withStatus(EventStatus.LIVE);

    assertThat(live.status()).isEqualTo(EventStatus.LIVE);
    assertThat(draft.status()).isEqualTo(EventStatus.DRAFT);
  }

  @Test
  void withEventReferenceProducesNewInstanceWithUpdatedRef() {
    var event = minimalEvent().withEventReference("anna-and-mark");
    var renamed = event.withEventReference("mark-and-anna");

    assertThat(renamed.eventReference()).isEqualTo("mark-and-anna");
    assertThat(event.eventReference()).isEqualTo("anna-and-mark");
  }

  @Test
  void builderSetsAllProvidedFields() {
    var event =
        Event.builder()
            .groomName("Mark")
            .brideName("Anna")
            .eventDateTime(DATE)
            .backgroundImage("img.jpg")
            .eventLocation("Church")
            .eventReception("Hotel")
            .eventReference("anna-and-mark")
            .createdBy("user-1")
            .groomParents("Groom Parents")
            .brideParents("Bride Parents")
            .godparents("Godparents")
            .menuOptions(List.of("Meat", "Fish"))
            .theme("classic")
            .status(EventStatus.LIVE)
            .build();

    assertThat(event.groomName()).isEqualTo("Mark");
    assertThat(event.brideName()).isEqualTo("Anna");
    assertThat(event.eventDateTime()).isEqualTo(DATE);
    assertThat(event.eventLocation()).isEqualTo("Church");
    assertThat(event.eventReception()).isEqualTo("Hotel");
    assertThat(event.menuOptions()).containsExactly("Meat", "Fish");
    assertThat(event.theme()).isEqualTo("classic");
    assertThat(event.status()).isEqualTo(EventStatus.LIVE);
    assertThat(event.createdBy()).isEqualTo("user-1");
  }

  @Test
  void builderRejectsNullGroomName() {
    assertThatThrownBy(() -> Event.builder().groomName(null).brideName("Anna").eventDateTime(DATE)
            .backgroundImage("img").build())
        .isInstanceOf(NullPointerException.class);
  }

  @Test
  void builderRejectsNullBrideName() {
    assertThatThrownBy(() -> Event.builder().groomName("Mark").brideName(null).eventDateTime(DATE)
            .backgroundImage("img").build())
        .isInstanceOf(NullPointerException.class);
  }

  @Test
  void builderRejectsNullEventDateTime() {
    assertThatThrownBy(() -> Event.builder().groomName("Mark").brideName("Anna").eventDateTime(null)
            .backgroundImage("img").build())
        .isInstanceOf(NullPointerException.class);
  }

  @Test
  void convenienceConstructorSetsAllProvidedFields() {
    var event = new Event("Mark", "Anna", "Church", "Hotel", DATE, "img.jpg");

    assertThat(event.groomName()).isEqualTo("Mark");
    assertThat(event.brideName()).isEqualTo("Anna");
    assertThat(event.eventLocation()).isEqualTo("Church");
    assertThat(event.eventReception()).isEqualTo("Hotel");
    assertThat(event.backgroundImage()).isEqualTo("img.jpg");
    assertThat(event.eventReference()).isNull();
    assertThat(event.status()).isNull();
  }

  // --- helpers ---

  private Event minimalEvent() {
    return Event.builder()
        .groomName("Mark")
        .brideName("Anna")
        .eventDateTime(DATE)
        .backgroundImage("img.jpg")
        .build();
  }
}
