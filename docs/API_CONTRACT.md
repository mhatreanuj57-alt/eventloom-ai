# API contract

Both routes are implemented Node.js Next.js route handlers. Responses use Cache-Control: no-store and include requestId plus X-Request-Id. GET is not implemented.

## Shared request rules

Use Content-Type: application/json. Planning bodies are limited to 65,536 bytes while streaming. With Supabase configured, the server verifies the cookie-authenticated account. An optional studio bearer token is retained only for development without Supabase; it does not bypass account authentication. Supplied Origin must match the browser-facing Host/protocol, including behind Next/Vercel.

Supabase atomically enforces 5 AI attempts per account and 20 per studio per UTC hour. Invalid/unauthorized input does not call Gemini. Each provider call has a 45-second SDK timeout and 8,000-token output cap. The client aborts after 75 seconds; AI routes declare a 90-second hosting duration. SDK/client automatic retries are disabled. Quota storage failure returns 503 before generation.

## POST /api/plans

Body: the event brief directly, with no wrapper.

| Field | Validation |
| --- | --- |
| title | Trimmed string, 3–80 characters |
| eventType | wedding, birthday, or community |
| guestCount | Integer 1–500 |
| budgetMinor | Safe integer 100–10,000,000,000 |
| currency | INR, USD, EUR, or GBP; amounts use hundredths |
| eventDate | Real YYYY-MM-DD calendar date, today or later in timeZone |
| timeZone | Valid IANA time-zone identifier, at most 80 characters |
| location | Trimmed city/region, 2–120 characters |
| preferences | At most 10 nonempty strings, each at most 200 characters |
| exclusions | Same bounds as preferences |

Unknown brief properties are rejected. The server does not require an exact address or guest identities.

## POST /api/plans/refine

The body contains event (the current validated brief), currentPlan (the complete valid plan), and instruction (trimmed text, 1–1,000 characters). Unknown top-level properties are rejected.

The current plan must satisfy the same currency, budget, arithmetic, identifier, and schedule checks as a new response. The model is instructed to preserve hard event fields; a response with a changed budget/currency is rejected. Creative revisions replace the full plan. The UI directs structured changes to the event editor.

## Success envelope

HTTP 200 returns data (the plan), effectiveEvent (the validated event brief), and requestId. The browser allocates an event identifier; saving that event is a separate local or authenticated account operation.

The plan contains title, summary, currency, budgetMinor, estimatedTotalMinor, theme, budgetItems, itinerary, checklist, vendorChecklist, assumptions, and warnings.

| Section | Implemented shape and limits |
| --- | --- |
| Theme | name, description, 3–5 six-digit hex colors in palette, 2–6 ideas |
| Budget | 1–12 items with id, label, amountMinor, note |
| Itinerary | 1–12 items with id, HH:mm time, durationMinutes 1–480, title, description |
| Preparation | 1–16 items with id, title, daysBefore 0–365 |
| Vendors | 1–8 category items with id, category, description, 1–5 questions |
| Assumptions/warnings | Up to 8 nonempty strings each |

General plan text is bounded to 600 characters per string. IDs use 1–50 letters, numbers, underscores, or hyphens and must be unique within each section.

Budget items must sum exactly to estimatedTotalMinor, remain within the brief budget, and retain the brief currency/budget. Itinerary activities must be ordered, non-overlapping, and end within the same local day. Vendor items never claim an AI-confirmed booking; user status is stored separately.

The provider receives the compatible schema structure and enums; richer constraints remain in the authoritative server validator. Model output is parsed and validated independently. Invalid output is rejected rather than silently repaired or replaced by a sample. SDK and client automatic retries are disabled.

## Error envelope

A failure contains error with code, message, optional field arrays, and requestId. Messages exclude provider details and secrets.

| Status | Codes |
| --- | --- |
| 400 | INVALID_INPUT |
| 401 | SIGN_IN_REQUIRED, ACCESS_REQUIRED |
| 403 | INVALID_ORIGIN |
| 413 | PAYLOAD_TOO_LARGE |
| 415 | UNSUPPORTED_MEDIA_TYPE |
| 429 | RATE_LIMITED |
| 502 | INVALID_AI_RESPONSE |
| 503 | AI_NOT_CONFIGURED, ACCESS_NOT_CONFIGURED, AI_UNAVAILABLE, LIMITER_UNAVAILABLE |
| 504 | AI_TIMEOUT |
| 500 | INTERNAL_ERROR |

Provider quota failures map to 429; missing provider credentials map to 503. Unknown exceptions return a generic 500. The UI retains the brief/previous plan after failures and allows an explicit retry or draft save.

See [architecture](ARCHITECTURE.md), [tests](../tests/README.md), and [security](../SECURITY.md) for the practical limits of these guarantees.

## Account event API: /api/events

All methods verify the Supabase user and use owner-scoped queries with RLS. Responses are private/no-store. Mutations require a same-origin Origin header. SavedEvent uses the existing brief/plan plus id, source, status, completedTasks, vendorStatus, actualSpent and ISO timestamps; unknown fields and foreign progress identifiers are rejected.

| Method | Input and result |
| --- | --- |
| GET | Returns events and a versions map keyed by event ID |
| POST | Accepts {event, version?}; inserts a new event or conditionally updates an existing database version; returns version |
| DELETE | Accepts {id, version}; conditionally deletes the owner's matching row |
| PUT | Accepts the full validated event array and replaces only that user's workspace atomically |

Individual saves accept at most 100 KB, and workspace restoration accepts at most 4 MB and 50 events. IDs use 1–100 letters, digits, underscores or hyphens and must be unique. Stale/duplicate writes and deletes return 409 EVENT_CONFLICT rather than overwriting another version. Invalid backups return 400 before database mutation; database restoration errors roll back prior deletion.

Account API errors use {error:{code,message}}. They do not claim the AI routes' requestId envelope. Missing sessions return 401; backend storage failures return safe 503 messages.
