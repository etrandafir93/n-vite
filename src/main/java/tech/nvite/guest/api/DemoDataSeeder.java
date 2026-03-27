package tech.nvite.guest.api;

import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import tech.nvite.domain.Event;
import tech.nvite.domain.EventSection;
import tech.nvite.domain.EventStatus;
import tech.nvite.domain.Events;
import tech.nvite.domain.SectionType;

@Slf4j
@Component
@RequiredArgsConstructor
class DemoDataSeeder {

  private static final String DEMO_REF = "joe-and-jane";

  private final Events events;

  @EventListener(ApplicationStartedEvent.class)
  void seedDemoData() {
    var existing = events.find(DEMO_REF);

    if (existing.isPresent()) {
      if (existing.get().eventDateTime().isAfter(Instant.now())) {
        log.info("Demo data for '{}' is current, skipping seed.", DEMO_REF);
        return;
      }
      log.info("Demo event '{}' is in the past — refreshing with a future date...", DEMO_REF);
      events.edit(buildDemoEvent().withCreated(existing.get().created()));
      log.info("Demo event '{}' updated successfully.", DEMO_REF);
      return;
    }

    log.info("Seeding demo data for '{}'...", DEMO_REF);
    events.create(buildDemoEvent());
    log.info("Demo data seeded successfully. Ref: '{}'", DEMO_REF);
  }

  private Event buildDemoEvent() {
    return Event.builder()
        .eventReference(DEMO_REF)
        .groomName("Joe Doe")
        .brideName("Jane Doe")
        .eventDateTime(Instant.parse("2026-09-13T14:00:00Z"))
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
        .ceremonyMapUrl("https://maps.google.com/maps?q=44.4422684,26.0913552&z=17&output=embed")
        .eventReception("The Grand Ballroom")
        .receptionAddress("456 Elm Avenue")
        .receptionTime("6:00 PM")
        .receptionPhotoUrl(
            "https://cdn-ilcfplf.nitrocdn.com/SyCrIzrKGMjPKhvowtSUaxPZwZPIFwao/assets/images/optimized/rev-8448987/flashbox.ro/wp-content/uploads/2026/02/locatie-pentru-nunta-bucuresti.jpg")
        .receptionMapUrl("https://maps.google.com/maps?q=44.4471355,26.1079432&z=15&output=embed")
        .rsvpDeadline("August 1, 2026")
        .sections(demoSections())
        .status(EventStatus.LIVE)
        .createdBy("system")
        .build();
  }

  private List<EventSection> demoSections() {
    return List.of(
        new EventSection(
            SectionType.DRESS_CODE,
            "Dress Code",
            "Elegant evening attire with warm neutral accents.",
            null,
            null,
            "FORMAL",
            "Champagne, sage green, ivory",
            "Please avoid full white outfits.",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
            null,
            null),
        new EventSection(
            SectionType.ACCOMMODATION,
            "Accommodation",
            "Recommended stays close to the venue.",
            null,
            null,
            null,
            null,
            null,
            null,
            List.of(
                new EventSection.HotelEntry(
                    "Grand Palace Hotel",
                    "5 min walk",
                    "https://example.com/hotel-1",
                    "Use code JOEJANE"),
                new EventSection.HotelEntry(
                    "Riverside Suites", "12 min drive", "https://example.com/hotel-2", null)),
            null),
        new EventSection(
            SectionType.DAY_SCHEDULE,
            "Day Schedule",
            "Key moments of the day.",
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            List.of(
                new EventSection.ScheduleItem("14:00", "Ceremony"),
                new EventSection.ScheduleItem("17:30", "Cocktail hour"),
                new EventSection.ScheduleItem("19:00", "Dinner and party"))),
        genericSection(
            SectionType.GIFT_REGISTRY,
            "Gift Registry",
            "Your presence is the best gift. Registry is optional.",
            null,
            "https://example.com/registry"),
        genericSection(
            SectionType.OUR_STORY,
            "Our Story",
            "From first coffee to forever. Thank you for being part of our journey.",
            "https://images.unsplash.com/photo-1518199266791-5375a83190b7",
            null),
        genericSection(
            SectionType.WEDDING_PARTY,
            "Wedding Party",
            "Meet the friends and family standing with us on our big day.",
            null,
            null),
        genericSection(
            SectionType.FAQ,
            "FAQ",
            "Can I bring kids? Is parking available? Dress code details are above.",
            null,
            null),
        genericSection(
            SectionType.TRANSPORT,
            "Transport",
            "Shuttle buses depart from City Center at 13:00 and 13:30.",
            null,
            null),
        genericSection(
            SectionType.SONG_REQUEST,
            "Song Requests",
            "Tell us your favorite dance-floor song at RSVP.",
            null,
            null),
        genericSection(
            SectionType.HONEYMOON_FUND,
            "Honeymoon Fund",
            "If you wish to contribute, we would be grateful for support for our honeymoon.",
            null,
            "https://example.com/honeymoon"),
        genericSection(
            SectionType.CHILDREN_POLICY,
            "Children Policy",
            "We love your little ones, but this will be an adults-only celebration.",
            null,
            null),
        genericSection(
            SectionType.PARKING,
            "Parking",
            "Complimentary parking available at the venue underground garage.",
            null,
            null),
        genericSection(
            SectionType.LIVE_STREAM,
            "Live Stream",
            "If you cannot attend in person, join us online.",
            null,
            "https://example.com/livestream"),
        genericSection(
            SectionType.MENU_PREVIEW,
            "Menu Preview",
            "Seasonal starters, signature main dishes, and a midnight surprise.",
            null,
            null),
        genericSection(
            SectionType.PHOTO_GALLERY,
            "Photo Gallery",
            "We will upload wedding highlights after the event.",
            "https://images.unsplash.com/photo-1520854221256-17451cc331bf",
            null),
        genericSection(
            SectionType.COUPLE_QUOTE,
            "Couple Quote",
            "\"Whatever our souls are made of, his and mine are the same.\"",
            null,
            null));
  }

  private EventSection genericSection(
      SectionType type, String title, String content, String imageUrl, String linkUrl) {
    return new EventSection(
        type, title, content, imageUrl, linkUrl, null, null, null, null, null, null);
  }
}
