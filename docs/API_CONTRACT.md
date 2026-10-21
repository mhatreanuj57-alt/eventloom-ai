# Proposed API contract

**Design only:** both route handlers are zero-byte placeholders. No endpoint currently accepts requests. Field names, limits, and response shapes must be finalized and tested during implementation.

## Shared conventions

- Local JSON POST requests, validated on the server.
- Project-owned request/response types in `src/types/api.ts`.
- Dates use an unambiguous calendar-date format; the brief carries an explicit IANA time zone for scheduling.
- Budget amounts use integer minor units and an explicit supported currency code. Currency scale must be validated rather than assumed.
- All string, collection, body-size, and generation limits must be selected and documented before release.
- Do not transmit the Gemini credential in any browser payload.
- Generate a request identifier for support without exposing provider internals.

## POST /api/plans

Placeholder: `src/app/api/plans/route.ts`.

### Proposed request

| Field | Meaning | Required validation |
| --- | --- | --- |
| `eventType` | Supported celebration category | Allowlisted supported value |
| `guestCount` | Number of attendees | Positive bounded integer |
| `budgetMinor` | Available amount in minor units | Positive safe integer with a documented cap |
| `currency` | Currency for all cost estimates | Supported currency and minor-unit scale |
| `eventDate` | Local event date | Real date with documented past-date handling |
| `timeZone` | Scheduling time zone | Valid supported IANA identifier |
| `location` | City/region or approximate setting | Bounded text; no exact address required |
| `preferences` | Theme, food, accessibility, cultural preferences | Bounded collection of bounded strings |
| `exclusions` | Explicit items to avoid | Bounded collection of bounded strings |

### Proposed success result

A success envelope contains `data` and `requestId`. The plan in `data` contains:

| Plan field | Intended content |
| --- | --- |
| `title`, `summary`, `theme` | Human-readable proposal |
| `currency`, `budgetMinor` | Agreed financial boundary |
| `budgetItems` | Categories and estimated integer minor-unit amounts |
| `estimatedTotalMinor` | Checked sum of budget allocations |
| `itinerary` | Local start/end times, time zone, and activities |
| `checklist` | Practical preparation tasks and relative due dates |
| `assumptions` | Missing details the model inferred |
| `warnings` | Feasibility concerns, estimates, or items needing confirmation |

Use HTTP 200 for synchronous success. Validate the result before returning it. A budget that cannot be met should produce an explained, valid response or a documented feasibility failure; never silently exceed the brief.

No database plan identifier is required because persistence is outside the initial scope.

## POST /api/plans/refine

Placeholder: `src/app/api/plans/refine/route.ts`.

The proposed request contains `event` (the original validated brief), `currentPlan` (the complete plan), and `instruction` (a bounded revision request). Do not trust a plan simply because a browser claims it was generated earlier.

Return the same success envelope and plan shape as generation. Preserve unaffected constraints and explicitly communicate assumptions. If an instruction changes a budget or date, validate the effective updated brief and return it alongside the revised plan so the client can use it in later revisions. The exact updated-event field must be finalized in the shared types before implementation.

This stateless design does not require accounts, ownership lookup, or a saved-plan endpoint.

## Proposed failure envelope

A failure contains `error` with a stable `code`, a safe `message`, optional field-level validation details, and `requestId`. Never include raw provider responses, prompts, credentials, or stack traces.

| HTTP status | Proposed code | Meaning |
| --- | --- | --- |
| 400 | `INVALID_INPUT` | Malformed JSON or invalid event/revision fields |
| 413 | `PAYLOAD_TOO_LARGE` | Request exceeds the agreed body-size limit |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | Request is not supported JSON content |
| 429 | `RATE_LIMITED` | Application quota or mapped provider quota limit |
| 502 | `INVALID_AI_RESPONSE` | Provider output cannot pass validation |
| 503 | `AI_UNAVAILABLE` | Provider is unavailable or cannot serve the request |
| 504 | `AI_TIMEOUT` | Provider deadline exceeded |
| 500 | `INTERNAL_ERROR` | Unexpected application/configuration failure |

Finalize provider-error mapping and retry behavior in integration tests. A retry should be bounded and user-visible; repeated submissions can consume quota.

## Contract acceptance checks

Reject malformed requests before contacting Gemini. Cover invalid currencies and dates, excessive counts and lengths, budget arithmetic, malformed AI output, explicit exclusions, revised constraints, provider failures, and error-message redaction. Browser tests should confirm that failed submissions preserve the brief and offer recovery.
