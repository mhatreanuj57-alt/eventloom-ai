# Architecture

## Boundaries

One existing Next.js App Router application provides Server Component pages and interactive Client Components. The studio route group preserves public URLs. Tailwind/CSS tokens, local fonts, Radix-based shadcn components, and Lucide share the warm editorial design.

- src/components/auth/account-provider.tsx tracks browser session identity and account event state.
- src/hooks/use-events.ts chooses private cloud storage for signed-in users or the existing local store for guests.
- src/lib/supabase contains cookie-aware browser/server clients; src/proxy.ts refreshes sessions.
- src/app/api/events verifies users independently with getUser and performs all application cloud writes.
- src/services/ai and src/lib/env.ts are server-only.
- src/lib/validation owns runtime contracts; src/types owns TypeScript contracts.
- src/lib/event-report.ts builds shared report content; pdf-report.ts is dynamically imported on download.

## Planning path

Form → runtime validation → same-origin POST → verified Supabase user → future-date/input checks → atomic PostgreSQL quota reservation → Gemini SDK → structured JSON → independent budget/timeline checks → safe envelope → client checks → confirmed save.

Gemini receives only the brief/current plan and the refinement instruction, never account passwords or server keys. No model tools, bookings, arbitrary code execution, or unchecked HTML are supported. SDK retries are disabled. Invalid responses fail explicitly and leave the old plan intact; drafts remain available.

Refinement keeps hard constraints fixed. Change budget, occasion, guests, location, date or preferences through the editor and regenerate. Semantic compliance with every preference still needs review.

## Persistence

public.events uses a composite (user_id, id) primary key, a JSON payload matching SavedEvent, and a database-controlled updated_at version. Ownership references auth.users with deletion cascading to events.

RLS separately grants authenticated owners select/insert/update/delete on their rows. Anonymous table access is revoked. The server derives user_id from a verified session, never from a client-supplied owner. No service-role credential is needed by the application.

Cloud mutations wait for a successful response before updating state. Updates/deletions compare the previous database timestamp and return 409 on conflicts. Refresh reloads the latest workspace; stale edits require explicit reconciliation. Simultaneous modifications are not automatically merged.

replace_event_workspace runs with invoker permissions in one database transaction; invalid restoration rolls back prior deletion. A trigger enforces 50 events per account. API/runtime validation rejects malformed plans and invalid tracking references.

Guest data stays in localStorage under eventloom.events.v1. Stable snapshots support hydration and cross-tab notifications. Corrupt data remains recoverable; storage exceptions never announce successful writes. The first personal guest event removes the initial illustrative samples.

Account identity changes clear in-memory cloud data. Local backups are not uploaded automatically. Export/restore deliberately moves data between guest and account modes. No guest-to-account auto-merge, offline cloud queue, realtime collaboration, or conflict auto-merge is promised.

## Shared quotas

reserve_ai_request is a tightly scoped SECURITY DEFINER function with an empty search path, explicit qualified table names, and execution limited to authenticated users. It uses auth.uid, an advisory transaction lock, and hourly quota rows hidden from client reads/writes.

The ceiling is 5 reservations per account and 20 studio-wide per UTC hour, across Vercel instances and restarts. Failed generation attempts consume a reservation. Old quota rows are pruned. Development without Supabase retains a process-local quota; production without the shared store fails closed.

## Validation and money

Inputs use safe integer minor units for INR/USD/EUR/GBP; decimal forms allow two fractional digits. Plan allocations sum exactly, match the brief currency/budget, and stay under the budget cap. Actual spending may exceed the cap and displays the excess.

Identifiers are unique; progress keys must belong to the plan. Timelines use valid 24-hour times and cannot overlap or extend beyond one calendar day. Archive data may use past dates; new AI generation requires today/future in the event zone.

## Reports and failure recovery

PDF content includes the brief/source, theme, allocations, actuals, timeline, task progress, vendor questions/status, assumptions, warnings, and estimate disclaimer. Local fonts are embedded; long text wraps and paginates. Unsupported glyphs fail with a readable/printable HTML fallback instead of dropping user text.

PDFs are searchable text but not certified tagged PDFs. Semantic HTML is the accessible reading path. JSON backups preserve the actual event structure for restoration.

Planning, storage, auth and report failures have bounded requests and visible messages. Failed Gemini generation never masquerades as a sample. Regeneration clears trackers only after confirmation and successful validated replacement.
