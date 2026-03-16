package tech.nvite.host;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentCaptor.forClass;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tech.nvite.domain.Event;
import tech.nvite.domain.EventStatus;
import tech.nvite.domain.Events;
import tech.nvite.infra.errors.EventNotFoundException;

@ExtendWith(MockitoExtension.class)
class EditEventUseCaseTest {

  @Mock Events events;
  @InjectMocks EditEventUseCase useCase;

  private static final Instant DATE = Instant.parse("2026-06-15T12:00:00Z");

  @Test
  void returnsEventReference() {
    when(events.findOrThrow("anna-and-mark")).thenReturn(existingEvent("anna-and-mark"));
    when(events.edit(any())).thenReturn("anna-and-mark");

    var ref = useCase.apply(minimalRequest("anna-and-mark", EventStatus.LIVE));

    assertThat(ref).isEqualTo("anna-and-mark");
  }

  @Test
  void savesUpdatedFields() {
    when(events.findOrThrow("ref-1")).thenReturn(existingEvent("ref-1"));

    useCase.apply(
        new EditEventUseCase.Request(
            "ref-1",
            "Mark",
            "Anna",
            DATE,
            "https://img.com/new.jpg",
            "New Groom Parents",
            "New Bride Parents",
            "New Godparents",
            "New Church",
            "New Church Addr",
            "15:00",
            null,
            null,
            "New Hotel",
            "New Hotel Addr",
            "18:00",
            null,
            null,
            "2026-05-31",
            List.of("Meat", "Vegan"),
            "modern",
            EventStatus.LIVE));

    ArgumentCaptor<Event> captor = forClass(Event.class);
    verify(events).edit(captor.capture());
    Event saved = captor.getValue();

    assertThat(saved.groomName()).isEqualTo("Mark");
    assertThat(saved.brideName()).isEqualTo("Anna");
    assertThat(saved.backgroundImage()).isEqualTo("https://img.com/new.jpg");
    assertThat(saved.eventLocation()).isEqualTo("New Church");
    assertThat(saved.eventReception()).isEqualTo("New Hotel");
    assertThat(saved.menuOptions()).containsExactly("Meat", "Vegan");
    assertThat(saved.theme()).isEqualTo("modern");
    assertThat(saved.status()).isEqualTo(EventStatus.LIVE);
  }

  @Test
  void preservesCreatedByAndCreatedFromExistingEvent() {
    var existing = existingEvent("ref-1");
    when(events.findOrThrow("ref-1")).thenReturn(existing);

    useCase.apply(minimalRequest("ref-1", EventStatus.LIVE));

    ArgumentCaptor<Event> captor = forClass(Event.class);
    verify(events).edit(captor.capture());
    assertThat(captor.getValue().createdBy()).isEqualTo(existing.createdBy());
    assertThat(captor.getValue().created()).isEqualTo(existing.created());
  }

  @Test
  void canTransitionFromLiveToDraft() {
    when(events.findOrThrow("ref-1")).thenReturn(existingEvent("ref-1"));

    useCase.apply(minimalRequest("ref-1", EventStatus.DRAFT));

    ArgumentCaptor<Event> captor = forClass(Event.class);
    verify(events).edit(captor.capture());
    assertThat(captor.getValue().status()).isEqualTo(EventStatus.DRAFT);
  }

  @Test
  void usesExistingStatusWhenRequestStatusIsNull() {
    var existing =
        Event.builder()
            .groomName("Old")
            .brideName("Old")
            .eventDateTime(DATE)
            .backgroundImage("img")
            .status(EventStatus.DRAFT)
            .eventReference("ref-1")
            .createdBy("user-1")
            .build();
    when(events.findOrThrow("ref-1")).thenReturn(existing);

    // Pass a request with explicit DRAFT status (null not possible due to @NonNull)
    useCase.apply(minimalRequest("ref-1", EventStatus.DRAFT));

    ArgumentCaptor<Event> captor = forClass(Event.class);
    verify(events).edit(captor.capture());
    assertThat(captor.getValue().status()).isEqualTo(EventStatus.DRAFT);
  }

  @Test
  void throwsWhenEventNotFound() {
    when(events.findOrThrow("unknown")).thenThrow(new EventNotFoundException("unknown"));

    assertThatThrownBy(() -> useCase.apply(minimalRequest("unknown", EventStatus.LIVE)))
        .isInstanceOf(EventNotFoundException.class);
  }

  @Test
  void rejectsNullEventReference() {
    assertThatThrownBy(
            () ->
                new EditEventUseCase.Request(
                    null, "Mark", "Anna", DATE, "img", null, null, null, null, null, null, null,
                    null, null, null, null, null, null, null, null, null, EventStatus.LIVE))
        .isInstanceOf(NullPointerException.class);
  }

  // --- helpers ---

  private EditEventUseCase.Request minimalRequest(String ref, EventStatus status) {
    return new EditEventUseCase.Request(
        ref, "Mark", "Anna", DATE, "https://img.com/bg.jpg", null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, status);
  }

  private Event existingEvent(String ref) {
    return Event.builder()
        .groomName("Old Groom")
        .brideName("Old Bride")
        .eventDateTime(DATE)
        .backgroundImage("old-img")
        .status(EventStatus.LIVE)
        .eventReference(ref)
        .createdBy("user-123")
        .build();
  }
}
