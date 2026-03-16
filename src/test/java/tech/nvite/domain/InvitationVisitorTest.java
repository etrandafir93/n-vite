package tech.nvite.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentCaptor.forClass;
import static org.mockito.Mockito.verify;

import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

class InvitationVisitorTest {

  @Test
  void withNameCreatesNamedGuest() {
    var visitor = InvitationVisitor.withName("John Doe");

    assertThat(visitor).isInstanceOf(InvitationVisitor.NamedGuest.class);
    assertThat(((InvitationVisitor.NamedGuest) visitor).name()).isEqualTo("John Doe");
  }

  @Test
  void anonymousCreatesAnonymousVisitor() {
    var visitor = InvitationVisitor.anonymous();

    assertThat(visitor).isInstanceOf(InvitationVisitor.Anonymous.class);
  }

  @Test
  void namedGuestAndAnonymousAreDistinctTypes() {
    var named = InvitationVisitor.withName("Alice");
    var anon = InvitationVisitor.anonymous();

    assertThat(named).isNotEqualTo(anon);
    assertThat(named).isNotSameAs(anon);
  }

  @Test
  void namedGuestsWithSameNameAreEqual() {
    var a = InvitationVisitor.withName("Alice");
    var b = InvitationVisitor.withName("Alice");

    assertThat(a).isEqualTo(b);
  }

  @Test
  void twoAnonymousInstancesAreEqual() {
    assertThat(InvitationVisitor.anonymous()).isEqualTo(InvitationVisitor.anonymous());
  }
}

@ExtendWith(MockitoExtension.class)
class InvitationVisitsTest {

  @Mock InvitationVisitsMongoRepository repository;
  @InjectMocks InvitationVisits invitationVisits;

  @Test
  void addNamedGuestSavesVisitWithName() {
    invitationVisits.add(InvitationVisitor.withName("John Doe"), "anna-and-mark");

    ArgumentCaptor<InvitationVisit> captor = forClass(InvitationVisit.class);
    verify(repository).save(captor.capture());

    assertThat(captor.getValue().visitorName()).isEqualTo("John Doe");
    assertThat(captor.getValue().eventRef()).isEqualTo("anna-and-mark");
    assertThat(captor.getValue().id()).isNull();
    assertThat(captor.getValue().visitTime()).isBefore(Instant.now().plusSeconds(5));
  }

  @Test
  void addAnonymousVisitorSavesWithAnonymousLabel() {
    invitationVisits.add(InvitationVisitor.anonymous(), "anna-and-mark");

    ArgumentCaptor<InvitationVisit> captor = forClass(InvitationVisit.class);
    verify(repository).save(captor.capture());

    assertThat(captor.getValue().visitorName()).isEqualTo("ANONYMOUS");
    assertThat(captor.getValue().eventRef()).isEqualTo("anna-and-mark");
  }
}
