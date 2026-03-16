package tech.nvite.domain;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import org.junit.jupiter.api.Test;

class RsvpTest {

  @Test
  void constructorSerializesAcceptedAnswer() {
    var rsvp =
        new Rsvp("John", "anna-and-mark", new RsvpAnswer.Accepted(), null, null, null, null, null, null);

    assertThat(rsvp.answer()).isEqualTo("ACCEPTED");
  }

  @Test
  void constructorSerializesDeclinedAnswer() {
    var rsvp =
        new Rsvp("John", "anna-and-mark", new RsvpAnswer.Declined(), null, null, null, null, null, null);

    assertThat(rsvp.answer()).isEqualTo("DECLINED");
  }

  @Test
  void constructorSetsTimestampToNow() {
    var before = Instant.now();
    var rsvp =
        new Rsvp("John", "anna-and-mark", new RsvpAnswer.Accepted(), null, null, null, null, null, null);
    var after = Instant.now();

    assertThat(rsvp.timestamp()).isBetween(before, after);
  }

  @Test
  void constructorSetsIdToNull() {
    var rsvp =
        new Rsvp("John", "anna-and-mark", new RsvpAnswer.Accepted(), null, null, null, null, null, null);

    assertThat(rsvp.id()).isNull();
  }

  @Test
  void constructorMapsAllOptionalFields() {
    var rsvp =
        new Rsvp(
            "John Doe",
            "anna-and-mark",
            new RsvpAnswer.Accepted(),
            "Jane Doe",
            "Fish",
            2,
            true,
            "Nuts",
            "Wheelchair access");

    assertThat(rsvp.guest()).isEqualTo("John Doe");
    assertThat(rsvp.eventReference()).isEqualTo("anna-and-mark");
    assertThat(rsvp.partnerName()).isEqualTo("Jane Doe");
    assertThat(rsvp.menuPreference()).isEqualTo("Fish");
    assertThat(rsvp.children()).isEqualTo(2);
    assertThat(rsvp.transport()).isTrue();
    assertThat(rsvp.allergies()).isEqualTo("Nuts");
    assertThat(rsvp.notes()).isEqualTo("Wheelchair access");
  }

  @Test
  void constructorAcceptsNullOptionalFields() {
    var rsvp =
        new Rsvp("Solo", "ref", new RsvpAnswer.Declined(), null, null, null, null, null, null);

    assertThat(rsvp.partnerName()).isNull();
    assertThat(rsvp.menuPreference()).isNull();
    assertThat(rsvp.children()).isNull();
    assertThat(rsvp.transport()).isNull();
    assertThat(rsvp.allergies()).isNull();
    assertThat(rsvp.notes()).isNull();
  }

  @Test
  void fullConstructorPreservesAllFields() {
    var ts = Instant.parse("2026-06-15T12:00:00Z");
    var rsvp = new Rsvp("id-1", ts, "John", "anna-and-mark", "ACCEPTED", "Jane", "Meat", 1, false, "Peanuts", "Note");

    assertThat(rsvp.id()).isEqualTo("id-1");
    assertThat(rsvp.timestamp()).isEqualTo(ts);
    assertThat(rsvp.guest()).isEqualTo("John");
    assertThat(rsvp.answer()).isEqualTo("ACCEPTED");
    assertThat(rsvp.allergies()).isEqualTo("Peanuts");
  }
}
