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