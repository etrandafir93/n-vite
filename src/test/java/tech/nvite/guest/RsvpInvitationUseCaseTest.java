package tech.nvite.guest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentCaptor.forClass;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tech.nvite.domain.Rsvp;
import tech.nvite.domain.RsvpRepository;

@ExtendWith(MockitoExtension.class)
class RsvpInvitationUseCaseTest {

  @Mock RsvpRepository rsvpRepository;
  @InjectMocks RsvpInvitationUseCase useCase;

  @Test
  void savesAcceptedRsvp() {
    when(rsvpRepository.save(any())).thenAnswer(inv -> withId(inv.getArgument(0), "rsvp-1"));

    var response = useCase.apply(acceptedRequest());

    assertThat(response.rsvpId()).isEqualTo("rsvp-1");

    ArgumentCaptor<Rsvp> captor = forClass(Rsvp.class);
    verify(rsvpRepository).save(captor.capture());
    Rsvp saved = captor.getValue();

    assertThat(saved.guest()).isEqualTo("John Doe");
    assertThat(saved.eventReference()).isEqualTo("anna-and-mark");
    assertThat(saved.answer()).isEqualTo("ACCEPTED");
    assertThat(saved.partnerName()).isEqualTo("Jane Doe");
    assertThat(saved.menuPreference()).isEqualTo("Fish");
    assertThat(saved.children()).isEqualTo(2);
    assertThat(saved.transport()).isTrue();
    assertThat(saved.allergies()).isEqualTo("Nuts");
    assertThat(saved.notes()).isEqualTo("Wheelchair access needed");
  }

  @Test
  void savesDeclinedRsvp() {
    when(rsvpRepository.save(any())).thenAnswer(inv -> withId(inv.getArgument(0), "rsvp-2"));

    var response =
        useCase.apply(
            new RsvpInvitationUseCase.Request(
                "anna-and-mark", "Jane Smith", "DECLINED", null, null, null, null, null, null));

    assertThat(response.rsvpId()).isEqualTo("rsvp-2");

    ArgumentCaptor<Rsvp> captor = forClass(Rsvp.class);
    verify(rsvpRepository).save(captor.capture());
    assertThat(captor.getValue().answer()).isEqualTo("DECLINED");
    assertThat(captor.getValue().partnerName()).isNull();
  }

  @Test
  void savesRsvpWithNullOptionalFields() {
    when(rsvpRepository.save(any())).thenAnswer(inv -> withId(inv.getArgument(0), "rsvp-3"));

    useCase.apply(
        new RsvpInvitationUseCase.Request(
            "anna-and-mark", "Solo Guest", "ACCEPTED", null, null, null, null, null, null));

    ArgumentCaptor<Rsvp> captor = forClass(Rsvp.class);
    verify(rsvpRepository).save(captor.capture());
    Rsvp saved = captor.getValue();

    assertThat(saved.partnerName()).isNull();
    assertThat(saved.menuPreference()).isNull();
    assertThat(saved.children()).isNull();
    assertThat(saved.transport()).isNull();
    assertThat(saved.allergies()).isNull();
    assertThat(saved.notes()).isNull();
  }

  @Test
  void rejectsInvalidRsvpAnswer() {
    assertThatThrownBy(
            () ->
                useCase.apply(
                    new RsvpInvitationUseCase.Request(
                        "anna-and-mark", "Bad Actor", "MAYBE", null, null, null, null, null, null)))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("MAYBE");
  }

  @Test
  void timestampIsSetOnSave() {
    when(rsvpRepository.save(any())).thenAnswer(inv -> withId(inv.getArgument(0), "rsvp-4"));

    useCase.apply(acceptedRequest());

    ArgumentCaptor<Rsvp> captor = forClass(Rsvp.class);
    verify(rsvpRepository).save(captor.capture());
    assertThat(captor.getValue().timestamp()).isNotNull().isBefore(Instant.now().plusSeconds(5));
  }

  @Test
  void withEventReferenceProducesNewRequestWithUpdatedRef() {
    var req = acceptedRequest();
    var updated = req.withEventReference("new-ref");

    assertThat(updated.eventReference()).isEqualTo("new-ref");
    assertThat(updated.name()).isEqualTo(req.name());
    assertThat(updated.rsvp()).isEqualTo(req.rsvp());
  }

  // --- helpers ---

  private RsvpInvitationUseCase.Request acceptedRequest() {
    return new RsvpInvitationUseCase.Request(
        "anna-and-mark",
        "John Doe",
        "ACCEPTED",
        "Jane Doe",
        "Fish",
        2,
        true,
        "Nuts",
        "Wheelchair access needed");
  }

  private Rsvp withId(Rsvp rsvp, String id) {
    return new Rsvp(
        id,
        rsvp.timestamp(),
        rsvp.guest(),
        rsvp.eventReference(),
        rsvp.answer(),
        rsvp.partnerName(),
        rsvp.menuPreference(),
        rsvp.children(),
        rsvp.transport(),
        rsvp.allergies(),
        rsvp.notes());
  }
}
