# Draft vs Live Events System

## Overview

Events in the system can have two statuses: `DRAFT` or `LIVE`. This allows users to preview their invitations before making them publicly shareable.

## Event Status

**EventStatus Enum** (`src/main/java/tech/nvite/domain/model/EventStatus.java`):
```java
public enum EventStatus {
  DRAFT,  // Event is in preview mode, not shareable
  LIVE    // Event is published and can be shared with guests
}
```

## How It Works

### Creating a Draft (Preview)

1. User fills out the invitation form in `/v2/events/builder`
2. Clicks **Preview** button (not Save)
3. Event is saved/updated with `status: DRAFT`
   - New event: `POST /api/v2/events` with `status: DRAFT`
   - Editing existing: `PUT /api/v2/events/{ref}` with `status: DRAFT`
4. Preview opens in new tab at `/v2/invitations/{ref}`
5. User is redirected to `/v2/events` dashboard

### Publishing a Draft (Making it Live)

1. User edits the draft from `/v2/events` dashboard
2. Clicks **Save** button (or **Create Invitation** for new events)
3. Event status changes from `DRAFT` → `LIVE`
4. Event is now publicly shareable

## Dashboard Behavior

### Draft Events
- Display with **"Draft" badge** (gold background, navy text)
- Have a **gold left border** and subtle gold background highlight
- Available actions:
  - ✅ **Preview** - View the invitation
  - ✅ **Edit** - Modify the invitation
  - ✅ **Delete** - Remove the draft
  - ❌ **Share** - Hidden for drafts (can't share until live)

### Live Events
- Display normally without draft badge
- Available actions:
  - ✅ **Preview** - View the invitation
  - ✅ **Edit** - Modify the invitation
  - ✅ **Share** - Share via WhatsApp, Telegram, Messenger, Copy link
  - ✅ **Delete** - Remove the event

## Key Implementation Details

### Backend

**Event Model** (`Event.java`):
- Field: `@Nullable EventStatus status`
- Defaults to `LIVE` if null (for backward compatibility with old events)

**API Endpoints** (`EventBuilderV2.java`):
- `POST /api/v2/events` - Creates event with provided status
- `PUT /api/v2/events/{ref}` - Updates event including status
- Both endpoints accept `status` in the request body

**Event List API** (`UpcomingEventsUI.java`):
- `GET /api/events` returns `EventListItem` with `status` field
- Status defaults to `LIVE` if null

### Frontend

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

## Workflow Example

### Scenario 1: New Invitation with Preview
```
1. User → Fills form → Clicks "Preview"
2. System → Creates event (status: DRAFT, ref: "john-and-jane")
3. Browser → Opens /v2/invitations/john-and-jane in new tab
4. Dashboard → Shows event with "Draft" badge, no share button
5. User → Clicks "Edit" → Makes changes → Clicks "Save"
6. System → Updates event (status: LIVE)
7. Dashboard → Shows event without draft badge, share button appears
```

### Scenario 2: Editing Live Event Back to Draft
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

## Database

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

## Important Notes

- **No duplicate events**: Preview doesn't create a new event, it just toggles the status
- **Backward compatibility**: Old events without `status` field default to `LIVE`
- **Share button**: Only visible for `LIVE` events
- **URL structure**: Both drafts and live events use the same URL pattern: `/v2/invitations/{ref}`
- **Theme support**: Preview respects the selected theme (classic, romantic, sporty, natural)
