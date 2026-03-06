# N-Vite — Coding Tasks Checklist

> Generated from the Fathom meeting recap (March 5, 2026)

## 🐛 Bug Fixes

- [ ] Fix the "Enable" button missing for draft events on the dashboard

## 🎨 Invitation Page Redesign

- [ ] Redesign the public-facing invitation page (mobile-first layout)
- [ ] Add more whitespace — current layout feels "shrunk"
- [ ] Add animations (inspired by rivals.invite.me)
- [ ] Add a countdown timer to the invitation page
- [ ] Add sticky navigation to the invitation page
- [ ] Fix the "View Demo" link — should show the selected template with real user data

## ⚙️ Dynamic Content Logic

- [ ] Hide empty sections conditionally (e.g. godparents field when not filled)
- [ ] Replace the RSVP form with a "thank you" message for past events
- [ ] (Future) Allow guests to upload photos/videos to past event pages

## 📋 RSVP Form Enhancements

- [ ] Implement conditional logic in the RSVP form (e.g. "Do you have allergies? → Yes → Specify")
- [ ] Allow hosts to define specific menu choices (e.g. meat, vegetarian, vegan)

## 📊 Dashboard Improvements

- [ ] Make accepted/declined guest details fully visible (plus-ones, menu choices)
- [ ] Implement guest data export feature (e.g. to Excel) — must include all details, not just names

## 🗺️ Event Creation Flow

- [ ] Simplify location input (e.g. Google Maps integration)
- [ ] Support flexible event type combinations (e.g. ceremony only, reception only, both)

## 🤖 Automated Testing

- [ ] Set up Claude (browser automation) for daily regression testing
- [ ] Integrate defined user journeys into the automation suite _(blocked on Cristiana's user journey definitions)_

## 🔧 Technical Improvements

### Testing
- [ ] Add unit tests for all use cases
  - [ ] CreateEventUseCase
  - [ ] EditEventUseCase
  - [ ] RsvpInvitationUseCase
  - [ ] Other use cases
- [ ] Add integration tests for REST controllers
  - [ ] EventsController (Host endpoints)
  - [ ] InvitationAudienceV2 (Guest endpoints)
  - [ ] ImageUploadV2
  - [ ] EventBuilderV2
- [ ] Add unit tests for domain model logic
- [ ] Set up test coverage reporting

### API Documentation
- [ ] Extract OpenAPI/Swagger contracts for all REST APIs
  - [ ] Host APIs (EventsController, EventBuilderV2, ImageUploadV2)
  - [ ] Guest APIs (InvitationAudienceV2)
- [ ] Configure Swagger UI for API documentation
- [ ] Add OpenAPI annotations to all endpoints
- [ ] Generate API client libraries from OpenAPI spec (optional)
