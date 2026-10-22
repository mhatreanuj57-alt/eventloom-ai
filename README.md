# EventLoom AI

**Thoughtful plans. Unforgettable gatherings.** An open-source GenAI celebration planner for weddings, birthdays, and community events, built for the owner-provided Celebration & Event Planner topic in PromptWars Virtual 2026.

Next.js App Router, TypeScript, Tailwind CSS, Radix-based shadcn/ui, Lucide, Google Gemini, and Supabase Auth/PostgreSQL power the existing editorial interface.

## Features

- Responsive landing page, dashboard, event collection, and three-step creation wizard.
- Light, dark, and system appearance; keyboard tabs/dialogs and reduced motion.
- Email/password accounts, email confirmation callbacks, password recovery, and sign-out.
- Private account event storage across devices, enforced by PostgreSQL row-level security.
- Guest browser-local drafts and clearly labeled sample events; no automatic upload.
- Structured Gemini plans and refinements personalized to preferences and exclusions.
- Checked budget allocation, editable actual expenses, and over-budget feedback.
- Non-overlapping timelines, preparation tasks, vendor questions/statuses, palettes, and ideas.
- Save, edit, delete, and regenerate with explicit confirmation before clearing progress.
- Downloadable PDF reports, readable/printable reports, JSON backups and validated restoration.
- Optimistic concurrency checks prevent cloud saves from silently overwriting another session.

## Run locally

Use Node.js 24 LTS (minimum 22) and the committed lockfile.

```powershell
npm ci
if (-not (Test-Path -LiteralPath '.env.local')) { Copy-Item -LiteralPath '.env.example' -Destination '.env.local' }
npm run dev
```

Open http://127.0.0.1:3000. Preserve an existing environment file. Never publish it.

| Environment setting | Visibility and purpose |
| --- | --- |
| GEMINI_API_KEY | Server secret from Google AI Studio |
| GEMINI_MODEL | Server model identifier; default gemini-3.5-flash-lite |
| NEXT_PUBLIC_SUPABASE_URL | Public Supabase project URL |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Public publishable key; requires RLS |
| EVENTLOOM_ACCESS_TOKEN | Legacy development studio token when Supabase is absent |
| SUPABASE_DB_PASSWORD | CLI administration only, when needed; never deploy to the browser or Vercel |

The new owner-authorized Supabase project is **EventLoom-AI**, ref **tqofweotswghcjrakgqf**, in Mumbai. Its migrations are in [supabase/migrations](supabase/migrations). Other contributors should use their own project. The application uses the publishable key and the user's verified session, never a service-role key.

Get your Gemini secret in [Google AI Studio](https://aistudio.google.com/apikey). [Structured output](https://ai.google.dev/gemini-api/docs/structured-output) is checked again by our own Zod, budget, and schedule validators. Model access and availability can change; select an identifier available to your account.

## Accounts and data

Sign in at /auth/sign-in. A signed-in user's events are saved in Supabase; a signed-out guest's events stay in that browser. Signing out clears the displayed account workspace. Guest data is never silently merged into an account: export a guest JSON backup, sign in, and restore it after reviewing the replacement confirmation.

Each workspace supports up to 50 events, with storage bounded to keep backups restorable. Backup import accepts at most 4 MB. Export before replacing/clearing a workspace. Invalid imports are rejected; a failed cloud replacement rolls back the entire transaction. Cloud saves/deletions compare a database version to detect stale edits.

Renaming an event preserves its plan and progress. Other planning-detail changes invalidate the previous plan after confirmation. Regeneration/refinement replaces the plan and resets its spending, task, and vendor trackers after warning. Provider failures preserve the last saved plan.

PDF generation happens locally on demand, without sending events to another report service. Embedded Noto fonts cover Latin, Greek, Cyrillic, and Devanagari text. Unsupported characters produce an explicit error and a readable browser Print / Save as PDF alternative. The HTML report provides semantic headings; the downloaded PDF is not a certified tagged accessible PDF.

## Routes

| Route | Purpose |
| --- | --- |
| / | Landing page |
| /dashboard, /events | Overview, collection, filters and search |
| /planner | Create/edit; optional type or edit query |
| /events/[id] | Theme, budget, timeline, preparation and vendors |
| /events/[id]/report | Readable report and PDF/print controls |
| /budget, /checklist | Event management workspaces |
| /settings | Account, appearance, backup/restore and workspace reset |
| /auth/sign-in, /auth/callback | Account entry and confirmation/recovery |
| /api/plans, /api/plans/refine | Server-side Gemini generation/refinement |
| /api/events | Verified account CRUD and atomic workspace replacement |

## Security and production

Authenticated production planning reserves an atomic shared allowance in Supabase: **5 attempts per account and 20 per studio per UTC hour**. Provider failures consume reservations too. Quota storage failure disables generation. Credentials stay server-side; error messages exclude provider internals. Gemini has a 45-second timeout, client planning a 75-second timeout, and AI routes a 90-second Vercel duration.

Costs are estimates, vendor suggestions are categories rather than verified businesses, and no bookings are made. Structural validation cannot guarantee factual accuracy, suitability, or feasibility.

Before launch, rotate the previously shared Gemini key, configure Auth email/redirect settings and provider spending controls, and test the deployed origin. See [deployment checklist and owner-run Vercel commands](docs/DEPLOYMENT.md) and [SECURITY.md](SECURITY.md). No GitHub push or Vercel deployment was performed.

## Verification

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium firefox webkit
npm run test:e2e -- --workers=2
```

Run a build before browser tests; they use a production server on port 3100. Do not rebuild underneath a running test server.

See [the verification report](docs/VERIFICATION.md), [test guide](tests/README.md), [architecture](docs/ARCHITECTURE.md), [API contract](docs/API_CONTRACT.md), and [development guide](docs/DEVELOPMENT.md).

## Collaboration and competition

Read [CONTRIBUTING](CONTRIBUTING.md), [Code of Conduct](CODE_OF_CONDUCT.md), [third-party notices](THIRD_PARTY_NOTICES.md), and the [file tree](FILE_TREE.md). Publication is manual: [five commit/push batches](docs/GIT_BATCHES.md).

The owner identified [PromptWars Virtual 2026](https://hack2skill.com/event/pwvirtual1) and its [submission dashboard](https://hack2skill.com/event/pwvirtual1/dashboard/submissions). Deadlines, judging criteria, build windows, and mandatory submission fields remain unverified. [Submission draft](docs/SUBMISSION.md) and [demo guidance](docs/HACKATHON.md) make no eligibility or submission claims.

[MIT licensed](LICENSE).
