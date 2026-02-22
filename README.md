## N-Vite

Our platform enables couples to create and share elegant, 
customizable electronic wedding invitations, complete with personalized designs and interactive features. 

It also offers tools to manage guest lists, track RSVPs, and streamline communication, 
making wedding planning simpler and more eco-friendly.

Here is a [spreadsheet checklist](https://docs.google.com/spreadsheets/d/1p1IBNcukyfj4lw2CZX7oXG4OgLBP_xVST_9aSGrVU08/edit?usp=sharing) with all the supported functionalities, including testcases, [bugs](https://github.com/etrandafir93/n-vite/issues?q=is%3Aissue+is%3Aopen+label%3ABUG) and [improvements](https://github.com/etrandafir93/n-vite/issues?q=is%3Aissue+is%3Aopen+label%3Aimprovement).

<br/>
<p align="center">
  <img src="./src/main/resources/static/icons/n-vite-logo.png"/>
</p>
<br/>

---

## Architecture

N-Vite follows a **Vertical Slice Architecture** organized by actor capabilities rather than technical layers.

### Core Principles

1. **Vertical Slices by Actor**: Code is organized by what different actors (Host, Guest) can do
2. **Use Cases as Functional Interfaces**: Each use case is a focused, single-responsibility functional interface
3. **Shared Domain Model**: Domain entities are shared across all use cases
4. **REST Controllers as Entry Points**: Controllers provide HTTP access to use cases for specific actors

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          HTTP Layer (REST API)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────┐      ┌──────────────────────────────┐   │
│  │   Host Controllers       │      │   Guest Controllers          │   │
│  │   (@RestController)      │      │   (@RestController)          │   │
│  ├──────────────────────────┤      ├──────────────────────────────┤   │
│  │ - EventsController       │      │ - InvitationAudienceV2       │   │
│  │ - ImageUploadV2          │      │                              │   │
│  │ - EventBuilderV2         │      │                              │   │
│  └──────────┬───────────────┘      └──────────┬───────────────────┘   │
│             │                                  │                       │
│             │                                  │                       │
├─────────────┼──────────────────────────────────┼───────────────────────┤
│             │        Use Case Layer            │                       │
│             │        (@UseCase)                │                       │
│             ▼                                  ▼                       │
│  ┌──────────────────────────┐      ┌──────────────────────────────┐   │
│  │   Host Use Cases         │      │   Guest Use Cases            │   │
│  │   (Functional Interfaces)│      │   (Functional Interfaces)    │   │
│  ├──────────────────────────┤      ├──────────────────────────────┤   │
│  │ - CreateEventUseCase     │      │ - RsvpInvitationUseCase      │   │
│  │ - EditEventUseCase       │      │ - VisitInvitationUseCase     │   │
│  │ - DeleteEventUseCase     │      │                              │   │
│  └──────────┬───────────────┘      └──────────┬───────────────────┘   │
│             │                                  │                       │
│             └──────────────┬───────────────────┘                       │
│                            │                                           │
├────────────────────────────┼───────────────────────────────────────────┤
│                            │   Domain Layer (Shared)                   │
│                            ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  Domain Models (@Document)                                      │  │
│  │  - Event, Rsvp, InvitationVisit, EventReference, EventStatus   │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  Repositories (MongoDB)                                         │  │
│  │  - Events, RsvpRepository, InvitationVisits                     │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

#### 1. **REST Controllers** (`@RestController`)
- **Location**: `tech.nvite.host.*` or `tech.nvite.guest.*`
- **Responsibility**: HTTP concerns only (routing, request/response mapping)
- **Rule**: Controllers delegate business logic to Use Cases
- **Example**: `EventsController` provides event management endpoints for hosts

#### 2. **Use Cases** (`@UseCase`)
- **Location**: `tech.nvite.domain.usecases.*`
- **Responsibility**: Single, focused business operation
- **Rule**: Must be functional interfaces (`Function<Request, Response>` or `Consumer<Request>`)
- **Example**:
  ```java
  @UseCase
  public class CreateEventUseCase implements Function<Request, EventReference> {
    // Single responsibility: Create a new event
  }
  ```

#### 3. **Domain Layer** (Shared)
- **Location**: `tech.nvite.domain.model.*`
- **Responsibility**: Business entities and repository interfaces
- **Rule**: Domain is shared across all use cases and actors
- **Example**: `Event`, `Rsvp`, `EventReference`

### Vertical Slices

```
tech.nvite/
├── host/                     # Everything the event HOST can do
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
│   │   ├── InvitationVisit
│   │   └── Events (repository)
│   │
│   └── usecases/             # Business operations
│       ├── CreateEventUseCase     # Host capability
│       ├── EditEventUseCase       # Host capability
│       ├── DeleteEventUseCase     # Host capability
│       ├── RsvpInvitationUseCase  # Guest capability
│       └── VisitInvitationUseCase # Guest capability
│
└── infra/                    # Infrastructure concerns
    ├── security/
    └── storage/
```

### Use Case Pattern

All use cases follow these conventions:

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

### Benefits of This Architecture

✅ **Clear Actor Boundaries**: Easy to see what each actor (Host/Guest) can do
✅ **Single Responsibility**: Each use case has one job
✅ **Testability**: Use cases can be tested independently of HTTP layer
✅ **Reusability**: Use cases can be reused across different controllers
✅ **Domain-Driven**: Domain model is central and shared
✅ **Functional Style**: Use cases as pure functions promote predictability
✅ **Vertical Slicing**: Features are complete slices, not scattered across layers

---

### Development

#### Start Application Locally
- login to gcloud and grant access to the application: `gcloud auth application-default login`

#### Build Image

- `mvn clean install`
- `docker build -t n-vite:1.2.3 .`

#### Upload to Google Registry

- `gcloud auth login`
- `gcloud config set project n-vite`
- `gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://europe-southwest1-docker.pkg.dev`


- `docker tag n-vite:1.2.3 europe-southwest1-docker.pkg.dev/n-vite/nvite-registry/n-vite:1.2.3`
- `docker push europe-southwest1-docker.pkg.dev/n-vite/nvite-registry/n-vite:1.2.3`




