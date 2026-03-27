# N-Vite — Coding Tasks Checklist

> Generated from the Fathom meeting recap (March 5, 2026)
> Full recording: https://fathom.video/share/ecxeacKLKzbfzedSofGdsnn8w6gNXtsB
>
> Updated from the Fathom session recap (March 24, 2026)
> Full recording: https://fathom.video/share/GRga1yFkKEgejLssi2H_5Fp4x16kJKt5

---

## 📋 Feature Development — Organized by Vertical Slices

### 📝 Invitation Lifecycle (Draft → Live → Past)

**Draft Mode**
- [x] **Fix "Enable" button visibility logic on dashboard** — ✅ COMPLETE — only DRAFT events show the "Enable" button, not LIVE ones
- [x] **Hide share button on dashboard for DRAFT invitations** — ✅ COMPLETE — draft invitations do not show the share button; only LIVE invitations can be shared
- [x] **Disable RSVP form on DRAFT invitations** — ✅ COMPLETE — when viewing a draft invitation directly via URL, the RSVP form is replaced with a "Coming Soon / This invitation has not been published yet" message across all 4 themes
- [x] **Change default status for new invitations to DRAFT** — ✅ COMPLETE — new invitations are created as DRAFT by default; hosts must explicitly click "Enable" to make them LIVE

**Live Mode**
- [x] **Dynamic content rendering** — ✅ COMPLETE — hide empty sections conditionally (family sections, ceremony/reception, navigation links, etc.)

**Past Events**
- [x] **Show thank you message for past events** — ✅ COMPLETE — replace RSVP form with thank-you message when event date has passed
- [ ] *(Future)* **Allow guests to upload photos/videos to past event pages** — post-event, the page could serve as a memory board where guests contribute media

---

### 🎨 Guest-Facing Invitation Page

**Redesign** — Reference: **rivals.invite.me** for animations, countdown, and sticky nav

- [x] **Mobile-first layout** — ✅ COMPLETE — fixed broken Modern theme 720px media query (`.spt-` → `.mdn-` prefix); made wrapper padding, section padding, and RSVP padding fluid via clamp(); increased toggle/menu button padding for larger touch targets across all 4 themes
- [x] **Add entrance animations** — ✅ COMPLETE — envelope intro screen added to all 4 themes; guest sees a closed envelope with a pulsing "Tap to open" hint; clicking animates the flap open and letter sliding up, then fades the overlay away to reveal the invitation; each theme has its own color scheme (cream/gold, dark navy/gold, blush/rose, sage/green)
- [x] **Add countdown timer** — ✅ COMPLETE — all 4 themes show a live days/hours/min/sec countdown in the hero section; auto-hides for past events
- [x] **Add sticky navigation** — ✅ COMPLETE — already implemented across all 4 themes (position: sticky, backdrop-filter blur)
- [x] **Fix the "View Demo" link in the event creation flow** — ✅ COMPLETE — when editing an existing event, theme cards show a "Preview" link pointing to the actual invitation URL with the selected theme; new events still show generic "View Demo"

---

### 📋 RSVP Experience (Guest Journey)

- [x] **Implement conditional logic in the RSVP form** — ✅ COMPLETE — added "Do you have any food allergies?" Yes/No field across all 4 themes; selecting Yes reveals a text input for details; stored in backend, shown in analytics dashboard and Excel export
- [x] **Allow hosts to define custom menu choices** — ✅ COMPLETE — hosts can add/remove menu options in the event builder (RSVP section); options stored per event; RSVP form on all 4 themes renders the custom options dynamically, falling back to Meat/Fish/Vegetarian when none are set

---

### 📊 Host Dashboard & Analytics

- [x] **Show full accepted/declined guest details** — ✅ COMPLETE — the dashboard now shows full guest information including: attendance status (accepted/declined), plus-one details (yes/no and partner name), menu preference, children count, transportation needs, and notes; all fields are displayed in an expandable details view with menu preference also shown as a table column
- [x] **Implement guest data export** — ✅ COMPLETE — hosts can export the complete guest list to Excel via `GET /api/events/{ref}/export`; includes all fields: name, attendance, plus-ones, partner name, menu choice, children, transport, notes, RSVP date; export button on the analytics dashboard

---

### 🗺️ Event Creation & Editing (Host Journey)

- [x] **Improve event form validation UX** — ✅ COMPLETE — frontend validates all required fields (groom/bride name, event date, background image, ceremony venue, reception venue) before submitting; invalid fields are highlighted with red borders and inline error messages; a banner lists all missing fields by name; errors clear as the user fills them in
- [x] **Simplify location input** — ✅ COMPLETE — Google Maps Places Autocomplete added to ceremony and reception address fields in the event builder; selecting a place auto-populates the address and generates the Google Maps embed URL; API key read from GOOGLE_MAPS_API_KEY env var and served via GET /api/config
- [x] **Support flexible event type combinations** — ✅ COMPLETE — host can choose Ceremony + Reception / Ceremony Only / Reception Only in the event builder; ceremony/reception form sections show/hide accordingly; validation only requires the active venue(s); unused venue data is nulled out on save; invitation pages already conditionally render based on null venues

---

## 🤖 Automated Testing

- [ ] **Set up Claude (browser automation via Claude in Chrome extension) for daily regression testing** — Emanuel demonstrated this during the meeting using a natural language prompt ("Create Mark and Anna wedding invitations") to drive a full user journey; the goal is to run these automatically every day to catch regressions early
- [ ] **Integrate user journeys into the automation suite** — ⚠️ _blocked on Cristiana defining the specific user journeys to automate (her action item)_

---

## 🔧 Technical Improvements

### Testing

- [x] **Add unit tests for all use cases** — ✅ COMPLETE — comprehensive unit tests written for all three main use cases using JUnit 5 + Mockito; 20 tests total covering happy paths, edge cases, error scenarios, status transitions, null validation, and slug generation
  - [x] CreateEventUseCase — 7 tests: slug generation, spaces stripped, UUID fallback, field mapping, DRAFT/LIVE status, null rejection
  - [x] EditEventUseCase — 7 tests: field updates, createdBy/created preserved, LIVE→DRAFT transition, existing status fallback, not-found error, null rejection
  - [x] RsvpInvitationUseCase — 6 tests: accepted/declined/null fields, invalid answer rejection, timestamp set, @With record copy
- [x] **Add integration tests for REST controllers** — ✅ COMPLETE — 16 @WebMvcTest tests covering all main REST endpoints with mocked use cases; uses TestSecurityConfig to bypass OAuth2 in test context
  - [x] EventsController (Host endpoints) — 10 tests: GET list/form, POST create (201+status), PUT update (ref from path), PATCH enable, DELETE (204), GET export (Excel headers+bytes)
  - [x] InvitationController (Guest endpoints) — 6 tests: GET invitation (mapped fields, guest param, no guest param), POST RSVP (all fields, ref from path, 200 response)
  - [ ] ImagesController — image upload flow (skipped: requires GCS mock setup)
  - [ ] EventsController dashboard/analytics endpoint
- [x] **Add unit tests for domain model logic** — ✅ COMPLETE — 24 tests covering all domain entities: Event (builder, @With immutability, backgroundImageOrDefault fallback, @NonNull enforcement), Rsvp (answer serialization, timestamp auto-set, field mapping), InvitationVisitor (factory methods, sealed type equality), InvitationVisits (named vs anonymous visitor name resolution)
- [ ] **Set up test coverage reporting** — integrate JaCoCo or similar tool to measure and report test coverage; aim for 80%+ coverage on use cases and domain logic; configure CI pipeline to enforce minimum coverage thresholds

### API Documentation

- [ ] **Extract OpenAPI/Swagger contracts for all REST APIs** — document all endpoints with request/response schemas, validation rules, error codes, and examples; this enables auto-generated documentation and client libraries
  - [ ] Host APIs (EventsController, EventBuilderV2, ImageUploadV2) — document all event management and analytics endpoints
  - [ ] Guest APIs (InvitationAudienceV2) — document invitation viewing and RSVP submission endpoints
- [ ] **Configure Swagger UI for API documentation** — set up springdoc-openapi or similar library to serve interactive API documentation at /swagger-ui.html; this allows developers and frontend teams to explore and test endpoints directly
- [ ] **Add OpenAPI annotations to all endpoints** — use @Operation, @ApiResponse, @Schema annotations to enrich the generated OpenAPI spec with descriptions, examples, and validation constraints
- [ ] **Generate API client libraries from OpenAPI spec (optional)** — use OpenAPI Generator to produce TypeScript/JavaScript client for the frontend; this ensures type safety and reduces manual API integration work

### Developer Experience

- [x] **Enable backend hot reload with Spring Boot DevTools** — ✅ COMPLETE — `spring-boot-devtools` added to pom.xml — currently developers need to run `mvn clean install` after every backend code change to see the results; integrate Spring Boot DevTools to enable automatic application restart when Java files change (much faster than full rebuild); optionally configure LiveReload browser extension for automatic browser refresh when changes are detected; this will match the frontend's hot reload experience and significantly speed up the development workflow

### CI/CD & Automation

- [ ] **GitHub Action to post BACKLOG.md updates to Slack** — create a GitHub Actions workflow that triggers on every commit to the main/master branch, reads the BACKLOG.md file, and posts it to a designated Slack channel for team visibility and progress tracking; this ensures the team stays informed about completed tasks and current priorities without manually checking the repository

---

## 🌍 Internationalization (i18n)

> From March 24 session — support multiple languages starting with Romanian, Ukrainian, English, Spanish

- [ ] **Set up i18n framework** — choose and integrate a localization library (e.g. i18next for frontend, Spring MessageSource for backend); define locale detection strategy (browser preference, URL param, or user setting)
- [x] **Extract all hardcoded UI strings** — ✅ COMPLETE — `i18next` + `react-i18next` installed; `src/i18n.js` initialised with browser-language detection + localStorage persistence; all landing page components (Navbar, Hero, HowItWorks, Templates, Features, Pricing, Footer) now use `useTranslation()`; locale files created for `en`, `ro`, `uk`, `es` covering all UI strings including arrays (steps, feature items, pricing plans, comparison table); language switcher dropdown added to Navbar
- [ ] **Implement Romanian translations** — translate all UI strings to Romanian; highest priority as primary target market
- [ ] **Implement Ukrainian translations** — translate all UI strings to Ukrainian
- [ ] **Implement English translations** — baseline locale; ensure all keys exist and are correct
- [ ] **Implement Spanish translations** — translate all UI strings to Spanish
- [ ] **Add language switcher UI** — allow guests to switch language on the invitation page; persist preference in localStorage

---

## 🎨 New Invitation Templates

> From March 24 session — create at least 3 new templates with unique animations/designs

- [ ] **"Scratch-off" reveal template** — guest scratches a card-like overlay to reveal the invitation details underneath; use canvas or CSS clip-path animation
- [ ] **Envelope open template** — a sealed envelope animates open on the screen, revealing the invitation inside (distinct from the existing envelope intro overlay; this is the full theme layout built around the envelope metaphor)
- [ ] **Day/Night theme** — dual-mode invitation: renders daytime palette during day hours, switches to a night-sky/starry palette after sunset; use CSS custom properties toggled by time-of-day check on load

---

## 🏠 Landing Page — Demo Section

> From March 24 session — showcase invitation templates to new visitors without requiring login

- [x] **Add demo section to landing page** — ✅ COMPLETE — `Templates.jsx` section added between HowItWorks and Features; 4 theme cards with gradient mini-previews, each linking to `/invitations/joe-and-jane/{theme}` in a new tab; mobile-responsive (4-col → 2-col → 1-col); "Templates" nav link added to Navbar and Footer
  - [x] Design the section layout (template cards with thumbnail + theme name + "View Demo" CTA)
  - [x] Wire each card to a real demo invitation URL for the corresponding theme
  - [x] Make the section mobile-responsive

---

## 🔓 Public Demo Access (No Login Required)

> From March 24 session — let the public explore templates without a Google login

- [x] **Set up a shared demo/test user account** — ✅ COMPLETE — `DemoDataSeeder` updated: event date bumped to 2026-09-13 (future), RSVP deadline to Aug 2026, explicit `status: LIVE`; smart refresh logic auto-updates the existing DB record if its date is in the past; `/invitations/**` already public without auth via `SecurityConfig`
- [ ] **Ensure demo events are read-only** — demo RSVPs should be accepted but not stored (or stored under a clearly marked demo bucket); prevent demo events from appearing in real host dashboards

---

## 💰 Monetization — Paid Add-Ons

> From March 24 session — free base templates, paid add-on features

- [ ] **Define the paid add-on model** — decide which features are free vs paid (e.g. extra themes, countdown timer, accommodation block, custom content sections); document the tiers
- [ ] **Implement feature gating on the backend** — add a subscription/plan field to the user/event model; enforce limits server-side
- [ ] **Accommodation info block (paid add-on)** — allow hosts to add hotel/accommodation recommendations with name, distance, booking link; rendered as a dedicated section on the invitation
- [ ] **Custom content blocks (paid add-on)** — allow hosts to add freeform sections (text + optional image) to the invitation; useful for dress code, travel tips, etc.
- [ ] **Integrate a payment provider** — evaluate Stripe or similar; implement checkout flow for upgrading to a paid plan
