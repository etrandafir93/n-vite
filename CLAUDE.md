# Project Instructions

## Architecture Overview

N-Vite follows a **Vertical Slice Architecture** organized by actor capabilities rather than technical layers.

### Core Principles

1. **Vertical Slices by Actor**: Code is organized by what different actors (Host, Guest) can do
2. **Use Cases as Functional Interfaces**: Each use case is a focused, single-responsibility functional interface
3. **Shared Domain Model**: Domain entities are shared across all use cases
4. **REST Controllers as Entry Points**: Controllers provide HTTP access to use cases for specific actors

### Architecture Layers

```
┌─────────────────────────────────────────────────┐
│         HTTP Layer (@RestController)            │
│  - EventsController (Host)                      │
│  - InvitationAudienceV2 (Guest)                 │
├─────────────────────────────────────────────────┤
│      Use Case Layer (@UseCase)                  │
│  - CreateEventUseCase                           │
│  - EditEventUseCase                             │
│  - RsvpInvitationUseCase                        │
├─────────────────────────────────────────────────┤
│         Domain Layer (Shared)                   │
│  - Event, Rsvp, InvitationVisit                 │
│  - Events (repository)                          │
└─────────────────────────────────────────────────┘
```

### Vertical Slices

```
tech.nvite/
├── host/                     # Everything the HOST can do
│   ├── EventsController      # CRUD operations on events
│   ├── ImageUploadV2         # Upload event images
│   └── EventBuilderV2        # Event analytics dashboard
│
├── guest/                    # Everything the GUEST can do
│   └── InvitationAudienceV2  # View invitation, submit RSVP
│
├── domain/
│   ├── model/                # Shared domain entities
│   │   ├── Event
│   │   ├── Rsvp
│   │   └── Events (repository)
│   │
│   └── usecases/             # Business operations
│       ├── CreateEventUseCase     # Host capability
│       ├── EditEventUseCase       # Host capability
│       └── RsvpInvitationUseCase  # Guest capability
│
└── infra/                    # Infrastructure concerns
    ├── security/
    └── storage/
```

## Architecture Rules

- Never return `@Document` domain model classes directly from REST API controllers. Always map them to a DTO first.
- Always favor immutable objects and Java records. When mutation is needed, use Lombok's `@With` to produce a modified copy rather than setters.
- Favor MapStruct for mapping between objects (e.g. domain models to DTOs). Avoid manual mapping code.
- In Java, always favor `private` or package-protected access modifiers whenever possible. Avoid `public` unless required by a framework or interface contract.
- Organize code by vertical slices (e.g. what the event host can do, what the guest can see/do), not by technical layers (no `repository`, `controller`, `service` top-level packages). Each slice owns its full stack from controller to persistence.

## API Contract Maintenance

**CRITICAL**: When adding new fields to the domain model, **ALWAYS** update ALL related API contracts:

### Required Updates Checklist

When adding a field (e.g., `envelope`) to the domain model, update:

1. **Domain Model** - `Event.java` (the source of truth)
2. **Request DTOs**:
    - `EventFormRequest.java` (API request body)
    - `CreateEventUseCase.Request` (use case input)
    - `EditEventUseCase.Request` (use case input)
3. **Response DTOs**:
    - `SeeEventUseCase.EventFormResponse` (GET /api/events/{ref}/form - **CRITICAL for edit mode**)
    - `InvitationDetails.java` (GET /api/invitations/{ref} - guest view)
4. **MapStruct Mappers** (auto-map if field names match):
    - `EventBuilderMapper.java` (maps Event ↔ requests/responses)
    - `InvitationMapper.java` (maps Event → InvitationDetails)

### Why This Matters

- **Frontend breaks silently** if response DTOs are missing fields
- **Edit mode fails** if `SeeEventUseCase.EventFormResponse` is incomplete (form won't load saved values)
- **MapStruct auto-maps** fields with matching names, but only if they exist in both source and target
- **Guest view breaks** if `InvitationDetails` is missing fields

### Example: Adding a New Field

```java
// 1. Domain Model
public record Event(String groomName, String brideName, String newField,  // ← Add here first
					// ...
		) {
}

// 2. Request DTOs
record EventFormRequest(String groomName, String brideName, String newField,  // ← Then here
						// ...
) {
}

// 3. Use Case Requests
public record Request(String groomName, String brideName, String newField,  // ← And here
					  // ...
) {
}

// 4. Response DTOs (DON'T FORGET!)
public record EventFormResponse(String groomName, String brideName, String newField,  // ← CRITICAL: Add to responses too!
								// ...
) {
}
```

### Quick Verification

After adding a field, run:

```bash
./mvnw compile
```

MapStruct will generate implementations at compile time. If field names match, mapping is automatic.

## Use Case Pattern

All use cases must follow these conventions:

1. **Annotated with `@UseCase`** - Spring component annotation
2. **Functional Interface** - One of:
   - `Function<Request, Response>` for operations returning a value
   - `Consumer<Request>` for operations with no return value
3. **Immutable Request/Response records** - Using Java records
4. **Single Responsibility** - Each use case does exactly one thing
5. **Constructor Injection** - Dependencies injected via `@RequiredArgsConstructor`

**Example**:
```java
@UseCase
@RequiredArgsConstructor
public class CreateEventUseCase implements Function<Request, EventReference> {

  private final Events events;
  private final CurrentUser currentUser;

  @Override
  public EventReference apply(Request req) {
    // Business logic here
    return eventReference;
  }

  public record Request(
    @NonNull String groomName,
    @NonNull String brideName,
    // ... other fields
  ) {}
}
```

## Draft vs Live Events System

### Overview

Events in the system can have two statuses: `DRAFT` or `LIVE`. This allows users to preview their invitations before making them publicly shareable.

### Event Status

**EventStatus Enum** (`src/main/java/tech/nvite/domain/model/EventStatus.java`):
```java
public enum EventStatus {
  DRAFT,  // Event is in preview mode, not shareable
  LIVE    // Event is published and can be shared with guests
}
```

### How It Works

#### Creating a Draft (Preview)

1. User fills out the invitation form in `/events/builder`
2. Clicks **Preview** button (not Save)
3. Event is saved/updated with `status: DRAFT`
   - New event: `POST /api/events` with `status: DRAFT`
   - Editing existing: `PUT /api/events/{ref}` with `status: DRAFT`
4. Preview opens in new tab at `/invitations/{ref}`
5. User is redirected to `/events` dashboard

#### Publishing a Draft (Making it Live)

1. User edits the draft from `/events` dashboard
2. Clicks **Save** button (or **Create Invitation** for new events)
3. Event status changes from `DRAFT` → `LIVE`
4. Event is now publicly shareable

### Dashboard Behavior

#### Draft Events
- Display with **"Draft" badge** (gold background, navy text)
- Have a **gold left border** and subtle gold background highlight
- Available actions:
  - ✅ **Preview** - View the invitation
  - ✅ **Edit** - Modify the invitation
  - ✅ **Delete** - Remove the draft
  - ❌ **Share** - Hidden for drafts (can't share until live)

#### Live Events
- Display normally without draft badge
- Available actions:
  - ✅ **Preview** - View the invitation
  - ✅ **Edit** - Modify the invitation
  - ✅ **Share** - Share via WhatsApp, Telegram, Messenger, Copy link
  - ✅ **Delete** - Remove the event

### Key Implementation Details

#### Backend

**Event Model** (`Event.java`):
- Field: `@Nullable EventStatus status`
- Defaults to `LIVE` if null (for backward compatibility with old events)

**API Endpoints** (`EventBuilderV2.java`):
- `POST /api/events` - Creates event with provided status
- `PUT /api/events/{ref}` - Updates event including status
- Both endpoints accept `status` in the request body

**Event List API** (`UpcomingEventsUI.java`):
- `GET /api/events` returns `EventListItem` with `status` field
- Status defaults to `LIVE` if null

#### Frontend

**Event Builder** (`EventBuilder.jsx`):
- **Preview button**: Saves with `status: 'DRAFT'`
- **Save button**: Saves with `status: 'LIVE'`
- Both use the same endpoints, just different status values

**Dashboard** (`EventsDashboard.jsx`):
- Detects drafts via `event.status === 'DRAFT'`
- Conditionally renders draft badge
- Hides share button for drafts

**CSS** (`EventsDashboard.css`):
- `.ev-card--draft` - Gold left border + gold background tint
- `.ev-badge--draft` - Small gold badge label

### Workflow Example

#### Scenario 1: New Invitation with Preview
```
1. User → Fills form → Clicks "Preview"
2. System → Creates event (status: DRAFT, ref: "john-and-jane")
3. Browser → Opens /invitations/john-and-jane in new tab
4. Dashboard → Shows event with "Draft" badge, no share button
5. User → Clicks "Edit" → Makes changes → Clicks "Save"
6. System → Updates event (status: LIVE)
7. Dashboard → Shows event without draft badge, share button appears
```

#### Scenario 2: Editing Live Event Back to Draft
```
1. User → Has live event "jane-and-john"
2. User → Clicks "Edit" → Makes changes → Clicks "Preview"
3. System → Updates event (status: DRAFT)
4. Browser → Opens preview in new tab
5. Dashboard → Event now shows "Draft" badge, share button hidden
6. User → Clicks "Edit" → Clicks "Save"
7. System → Updates event (status: LIVE)
8. Dashboard → Event is live again, share button returns
```

### Database

Events are stored in MongoDB `events` collection with an optional `status` field:
```json
{
  "groomName": "John",
  "brideName": "Jane",
  "reference": "john-and-jane",
  "status": "DRAFT",  // or "LIVE" or null (defaults to LIVE)
  ...
}
```

### Important Notes

- **No duplicate events**: Preview doesn't create a new event, it just toggles the status
- **Backward compatibility**: Old events without `status` field default to `LIVE`
- **Share button**: Only visible for `LIVE` events
- **URL structure**: Both drafts and live events use the same URL pattern: `/invitations/{ref}`
- **Theme support**: Preview respects the selected theme (classic, romantic, modern, natural)

## Task Management with BACKLOG.md

### Overview

The project maintains a `BACKLOG.md` file that serves as the central checklist for all coding tasks, features, and bug fixes.

### Workflow

1. **Reference the backlog**: When starting work, check `BACKLOG.md` for the current list of tasks
2. **Check off completed items**: As tasks are completed, mark them with `[x]` in the checklist
3. **Add new tasks**: When new requirements emerge, add them to the appropriate section
4. **Create sub-tasks**: Break down complex tasks into smaller sub-tasks as needed using nested checkboxes
5. **Keep it updated**: The backlog should always reflect the current state of work

### Working with Claude

- Claude will proactively reference `BACKLOG.md` when discussing tasks
- When completing work, Claude will update the checklist to mark items as done
- New tasks discovered during implementation should be added to the backlog
- The backlog provides context for prioritization and planning discussions