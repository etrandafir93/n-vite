# Project Instructions

## Architecture Rules

- Never return `@Document` domain model classes directly from REST API controllers. Always map them to a DTO first.
- Always favor immutable objects and Java records. When mutation is needed, use Lombok's `@With` to produce a modified copy rather than setters.
- Favor MapStruct for mapping between objects (e.g. domain models to DTOs). Avoid manual mapping code.
- In Java, always favor `private` or package-protected access modifiers whenever possible. Avoid `public` unless required by a framework or interface contract.
- Organize code by vertical slices (e.g. what the event host can do, what the guest can see/do), not by technical layers (no `repository`, `controller`, `service` top-level packages). Each slice owns its full stack from controller to persistence.
nw