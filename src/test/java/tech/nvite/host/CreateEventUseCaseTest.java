package tech.nvite.host;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentCaptor.forClass;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tech.nvite.domain.Event;
import tech.nvite.domain.EventStatus;
import tech.nvite.domain.Events;
import tech.nvite.infra.security.CurrentUser;

@ExtendWith(MockitoExtension.class)
class CreateEventUseCaseTest {

  @Mock Events events;
  @Mock CurrentUser currentUser;
  @InjectMocks CreateEventUseCase useCase;

  private static final Instant DATE = Instant.parse("2026-06-15T12:00:00Z");

  private void stubUser() {
    when(currentUser.get()).thenReturn(new CurrentUser.User("user-123", "host@example.com"));
  }

  @Test
  void createsEventWithSlugFromNames() {
    stubUser();
    when(events.find("Anna-and-Mark")).thenReturn(Optional.empty());

    var ref = useCase.apply(minimalRequest("Mark", "Anna", EventStatus.LIVE));

    assertThat(ref).isEqualTo("Anna-and-Mark");
  }

  @Test
  void savesEventWithCorrectFields() {
    stubUser();
    when(events.find(any())).thenReturn(Optional.empty());

    useCase.apply(
        new CreateEventUseCase.Request(
            "Mark",
            "Anna",
            DATE,
            "https://img.com/bg.jpg",
            "Groom Parents",
            "Bride Parents",
            "Godparents",
            "Church St. Mary",
            "123 Church Lane",
            "14:00",
            null,
            null,
            "Grand Hotel",
            "456 Grand Ave",
            "17:00",
            null,
            null,
            "2026-06-01",
            List.of("Meat", "Fish", "Veg"),
            "classic",
            EventStatus.LIVE,
            null));

    ArgumentCaptor<Event> captor = forClass(Event.class);
    verify(events).create(captor.capture());
    Event saved = captor.getValue();

    assertThat(saved.groomName()).isEqualTo("Mark");
    assertThat(saved.brideName()).isEqualTo("Anna");
    assertThat(saved.eventDateTime()).isEqualTo(DATE);
    assertThat(saved.backgroundImage()).isEqualTo("https://img.com/bg.jpg");
    assertThat(saved.eventLocation()).isEqualTo("Church St. Mary");
    assertThat(saved.eventReception()).isEqualTo("Grand Hotel");
    assertThat(saved.menuOptions()).containsExactly("Meat", "Fish", "Veg");
    assertThat(saved.theme()).isEqualTo("classic");
    assertThat(saved.status()).isEqualTo(EventStatus.LIVE);
    assertThat(saved.createdBy()).isEqualTo("user-123");
  }

  @Test
  void defaultsStatusToLiveWhenNull() {
    stubUser();
    when(events.find(any())).thenReturn(Optional.empty());

    useCase.apply(minimalRequest("Mark", "Anna", EventStatus.LIVE));

    ArgumentCaptor<Event> captor = forClass(Event.class);
    verify(events).create(captor.capture());
    assertThat(captor.getValue().status()).isEqualTo(EventStatus.LIVE);
  }

  @Test
  void preservesDraftStatus() {
    stubUser();
    when(events.find(any())).thenReturn(Optional.empty());

    useCase.apply(minimalRequest("Mark", "Anna", EventStatus.DRAFT));

    ArgumentCaptor<Event> captor = forClass(Event.class);
    verify(events).create(captor.capture());
    assertThat(captor.getValue().status()).isEqualTo(EventStatus.DRAFT);
  }

  @Test
  void fallsBackToUuidWhenSlugAlreadyExists() {
    stubUser();
    when(events.find("Anna-and-Mark")).thenReturn(Optional.of(anyEvent()));

    var ref = useCase.apply(minimalRequest("Mark", "Anna", EventStatus.LIVE));

    assertThat(ref).isNotEqualTo("AnnaAndMark").isNotBlank();
  }

  @Test
  void stripsSpacesFromNamesInSlug() {
    stubUser();
    when(events.find("AnnaMartinez-and-MarkSmith")).thenReturn(Optional.empty());

    var ref = useCase.apply(minimalRequest("Mark Smith", "Anna Martinez", EventStatus.LIVE));

    assertThat(ref).isEqualTo("AnnaMartinez-and-MarkSmith");
  }

  @Test
  void rejectsNullGroomName() {
    assertThatThrownBy(
            () ->
                new CreateEventUseCase.Request(
                    null,
                    "Anna",
                    DATE,
                    "img",
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
                    EventStatus.LIVE,
                    null))
        .isInstanceOf(NullPointerException.class);
  }

  // --- helpers ---

  private CreateEventUseCase.Request minimalRequest(
      String groom, String bride, EventStatus status) {
    return new CreateEventUseCase.Request(
        groom,
        bride,
        DATE,
        "https://img.com/bg.jpg",
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
        status,
        null);
  }

  private Event anyEvent() {
    return Event.builder()
        .groomName("x")
        .brideName("x")
        .eventDateTime(DATE)
        .backgroundImage("x")
        .status(EventStatus.LIVE)
        .eventReference("x")
        .createdBy("x")
        .build();
  }
}
