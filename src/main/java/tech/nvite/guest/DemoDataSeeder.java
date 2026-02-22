package tech.nvite.guest;

import java.time.Instant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import tech.nvite.domain.Event;
import tech.nvite.domain.Events;

@Slf4j
@Component
@RequiredArgsConstructor
class DemoDataSeeder {

  private static final String DEMO_REF = "joe-and-jane";

  private final Events events;

  @EventListener(ApplicationStartedEvent.class)
  void seedDemoData() {
    if (events.find(DEMO_REF).isPresent()) {
      log.info("Demo data for '{}' already exists, skipping seed.", DEMO_REF);
      return;
    }

    log.info("Seeding demo data for '{}'...", DEMO_REF);

    var event =
        Event.builder()
            .eventReference(DEMO_REF)
            .groomName("Joe Doe")
            .brideName("Jane Doe")
            .eventDateTime(Instant.parse("2025-09-13T14:00:00Z"))
            .backgroundImage(
                "https://hips.hearstapps.com/hmg-prod/images/gettyimages-1190043570-1-672cee697e7c8.jpg?crop=0.668xw:1.00xh;0.0865xw,0&resize=1120:*")
            .groomParents("Michael & Susan Doe")
            .brideParents("Robert & Elena Smith")
            .godparents("George & Maria Johnson")
            .eventLocation("St. Mary's Cathedral")
            .ceremonyAddress("123 Church Street")
            .ceremonyTime("2:00 PM")
            .ceremonyPhotoUrl(
                "https://doxologia.ro/sites/default/files/styles/imagine_articol_320/public/articol/2016/05/cununii-foto-benedict-both.jpg?itok=lU-DNou6")
            .ceremonyMapUrl(
                "https://maps.google.com/maps?q=44.4422684,26.0913552&z=17&output=embed")
            .eventReception("The Grand Ballroom")
            .receptionAddress("456 Elm Avenue")
            .receptionTime("6:00 PM")
            .receptionPhotoUrl(
                "https://cdn-ilcfplf.nitrocdn.com/SyCrIzrKGMjPKhvowtSUaxPZwZPIFwao/assets/images/optimized/rev-8448987/flashbox.ro/wp-content/uploads/2026/02/locatie-pentru-nunta-bucuresti.jpg")
            .receptionMapUrl(
                "https://maps.google.com/maps?q=44.4471355,26.1079432&z=15&output=embed")
            .rsvpDeadline("August 1, 2025")
            .createdBy("system")
            .build();

    events.create(event);
    log.info("Demo data seeded successfully. Ref: '{}'", DEMO_REF);
  }
}
