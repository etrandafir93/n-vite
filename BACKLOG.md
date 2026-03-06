# N-Vite — Coding Tasks Checklist

> Generated from the Fathom meeting recap (March 5, 2026)
> Full recording: https://fathom.video/share/ecxeacKLKzbfzedSofGdsnn8w6gNXtsB

---

## 📋 Feature Development — Organized by Vertical Slices

### 📝 Invitation Lifecycle (Draft → Live → Past)

**Draft Mode**
- [x] **Fix "Enable" button visibility logic on dashboard** — ✅ COMPLETE — only DRAFT events show the "Enable" button, not LIVE ones
- [ ] **Hide share button on dashboard for DRAFT invitations** — draft invitations should not show the share button on the dashboard; only LIVE invitations can be shared
- [ ] **Disable RSVP form on DRAFT invitations** — when viewing a draft invitation directly via URL, the RSVP form should be disabled or show a message like "This invitation is not yet published" instead of allowing guests to accept/decline
- [ ] **Change default status for new invitations to DRAFT** — when creating a new invitation via "Save" button, it should be created as DRAFT by default (not LIVE); hosts must explicitly click "Enable" to make it LIVE; this ensures hosts review their invitation before sharing it

**Live Mode**
- [x] **Dynamic content rendering** — ✅ COMPLETE — hide empty sections conditionally (family sections, ceremony/reception, navigation links, etc.)

**Past Events**
- [x] **Show thank you message for past events** — ✅ COMPLETE — replace RSVP form with thank-you message when event date has passed
- [ ] *(Future)* **Allow guests to upload photos/videos to past event pages** — post-event, the page could serve as a memory board where guests contribute media

---

### 🎨 Guest-Facing Invitation Page

**Redesign** — Reference: **rivals.invite.me** for animations, countdown, and sticky nav

- [ ] **Mobile-first layout** — most guests open invitations on their phones; the desktop layout should be secondary; current layout feels "shrunk" and needs more breathing room and whitespace
- [ ] **Add entrance animations** — page elements should animate in on load, similar to rivals.invite.me
- [ ] **Add countdown timer** — showing time remaining until the event date
- [ ] **Add sticky navigation** — the nav/header should remain visible as guests scroll down the invitation
- [ ] **Fix the "View Demo" link in the event creation flow** — currently broken; it should render the selected template populated with the actual user's event data, not a blank/generic preview

---

### 📋 RSVP Experience (Guest Journey)

- [ ] **Implement conditional logic in the RSVP form** — use dropdowns that reveal follow-up fields based on the guest's answer; example flow: "Do you have allergies?" → Yes → text field appears to specify; fields should stay hidden until triggered
- [ ] **Allow hosts to define custom menu choices** — hosts should be able to set the specific options guests pick from (e.g. meat, vegetarian, vegan); this must be configurable per event, not hardcoded

---

### 📊 Host Dashboard & Analytics

- [x] **Show full accepted/declined guest details** — ✅ COMPLETE — the dashboard now shows full guest information including: attendance status (accepted/declined), plus-one details (yes/no and partner name), menu preference, children count, transportation needs, and notes; all fields are displayed in an expandable details view with menu preference also shown as a table column
- [ ] **Implement guest data export** — hosts need to export the complete guest list to Excel (or similar); the export must include all collected fields (name, attendance, plus-ones, menu choice, children, transport, notes, etc.)

---

### 🗺️ Event Creation & Editing (Host Journey)

- [ ] **Simplify location input** — current text input is too bare; integrate Google Maps so hosts can search and pin a location rather than typing a raw address
- [ ] **Support flexible event type combinations** — an event should be configurable as: ceremony only, reception only, or ceremony + reception; the creation flow and invitation page must both adapt to whatever combination is selected

---

## 🤖 Automated Testing

- [ ] **Set up Claude (browser automation via Claude in Chrome extension) for daily regression testing** — Emanuel demonstrated this during the meeting using a natural language prompt ("Create Mark and Anna wedding invitations") to drive a full user journey; the goal is to run these automatically every day to catch regressions early
- [ ] **Integrate user journeys into the automation suite** — ⚠️ _blocked on Cristiana defining the specific user journeys to automate (her action item)_

---

## 🔧 Technical Improvements

### Testing

- [ ] **Add unit tests for all use cases** — each use case (CreateEventUseCase, EditEventUseCase, RsvpInvitationUseCase, etc.) should have comprehensive unit tests covering happy paths, edge cases, and error scenarios; use JUnit 5 and Mockito for mocking dependencies
  - [ ] CreateEventUseCase — test event creation with valid/invalid data, status handling (DRAFT/LIVE), reference generation
  - [ ] EditEventUseCase — test updating existing events, validation, status transitions
  - [ ] RsvpInvitationUseCase — test RSVP submission, guest counting, validation
  - [ ] Other use cases — ensure all domain logic is covered
- [ ] **Add integration tests for REST controllers** — test the full HTTP request/response cycle including serialization, validation, authentication, and error handling; use Spring Boot Test with @WebMvcTest or @SpringBootTest
  - [ ] EventsController (Host endpoints) — test GET /api/events, POST /api/events, PUT /api/events/{ref}, DELETE /api/events/{ref}
  - [ ] InvitationAudienceV2 (Guest endpoints) — test GET /invitations/{ref}, POST RSVP endpoints
  - [ ] ImageUploadV2 — test image upload flow, validation, storage
  - [ ] EventBuilderV2 — test analytics endpoints
- [ ] **Add unit tests for domain model logic** — test any business logic embedded in domain entities (Event, Rsvp, etc.) including validation rules, state transitions, and computed properties
- [ ] **Set up test coverage reporting** — integrate JaCoCo or similar tool to measure and report test coverage; aim for 80%+ coverage on use cases and domain logic; configure CI pipeline to enforce minimum coverage thresholds

### API Documentation

- [ ] **Extract OpenAPI/Swagger contracts for all REST APIs** — document all endpoints with request/response schemas, validation rules, error codes, and examples; this enables auto-generated documentation and client libraries
  - [ ] Host APIs (EventsController, EventBuilderV2, ImageUploadV2) — document all event management and analytics endpoints
  - [ ] Guest APIs (InvitationAudienceV2) — document invitation viewing and RSVP submission endpoints
- [ ] **Configure Swagger UI for API documentation** — set up springdoc-openapi or similar library to serve interactive API documentation at /swagger-ui.html; this allows developers and frontend teams to explore and test endpoints directly
- [ ] **Add OpenAPI annotations to all endpoints** — use @Operation, @ApiResponse, @Schema annotations to enrich the generated OpenAPI spec with descriptions, examples, and validation constraints
- [ ] **Generate API client libraries from OpenAPI spec (optional)** — use OpenAPI Generator to produce TypeScript/JavaScript client for the frontend; this ensures type safety and reduces manual API integration work

### Developer Experience

- [ ] **Enable backend hot reload with Spring Boot DevTools** — currently developers need to run `mvn clean install` after every backend code change to see the results; integrate Spring Boot DevTools to enable automatic application restart when Java files change (much faster than full rebuild); optionally configure LiveReload browser extension for automatic browser refresh when changes are detected; this will match the frontend's hot reload experience and significantly speed up the development workflow

### CI/CD & Automation

- [ ] **GitHub Action to post BACKLOG.md updates to Slack** — create a GitHub Actions workflow that triggers on every commit to the main/master branch, reads the BACKLOG.md file, and posts it to a designated Slack channel for team visibility and progress tracking; this ensures the team stays informed about completed tasks and current priorities without manually checking the repository
