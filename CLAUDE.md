# Project Instructions

## Architecture Rules

- Never return `@Document` domain model classes directly from REST API controllers. Always map them to a DTO first.
- Always favor immutable objects and Java records. When mutation is needed, use Lombok's `@With` to produce a modified copy rather than setters.
- Favor MapStruct for mapping between objects (e.g. domain models to DTOs). Avoid manual mapping code.
nw