# Development

Use Node.js 24 LTS and npm ci. Copy .env.example only when .env.local does not exist. Never print credentials in a test report.

## Commands

```powershell
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium firefox webkit
npm run test:e2e -- --workers=2
```

Development uses 127.0.0.1:3000; Playwright uses the production build on 127.0.0.1:3100. Stop a running production server before rebuilding. Do not run a build concurrently with dev/browser tests.

## Supabase

The owner-authorized remote project is tqofweotswghcjrakgqf. It was created separately; other existing projects were not modified. Migrations are already applied there. Other contributors should create a separate development project and use its public URL/publishable key.

```powershell
supabase login
supabase link --project-ref tqofweotswghcjrakgqf
supabase migration list
supabase db push --dry-run
supabase db query --linked --file supabase/tests/private_events.sql
```

Review migrations before manually running supabase db push. Never run a remote database reset. CLI migration application can warn about unavailable Docker while its optional catalog cache fails; confirm migration history and SQL state instead of assuming the migration failed.

The rollback-only SQL test creates synthetic users inside a transaction, tests RLS, quota and restore behavior, and rolls everything back.

## Live account check

Build and start the application in one terminal:

```powershell
npm run build
npm run start -- --port 3100
```

In another:

```powershell
node scripts/verify-supabase.mjs tqofweotswghcjrakgqf
```

The check obtains an admin credential through the logged-in CLI only in process memory, creates two confirmed disposable accounts without sending email, tests UI sign-in/account isolation/cloud persistence/conflicts/sign-out, and deletes those test users in finally. Admin credentials are never part of app configuration or saved output.

Add --gemini deliberately to perform three real generations and one refinement. This consumes provider quota and may cost money. The ordinary unit/browser suite mocks Gemini and sends no private briefs.

## Recovery and scope

The pre-completion source snapshot is C:\Users\ADMIN\eventloom-backups\20261022-completion; it excludes credentials. Restore selected files manually only after checking current work.

Do not overwrite unreadable browser data. Export it first. Backup restore and reset replace the selected local/account workspace only after confirmation. Concurrent cloud edits return a conflict; reload and review before saving.

Use existing types, schemas and UI primitives. Keep server/private and client/public environment boundaries intact. Follow root AGENTS.md and the version-matched Next.js documentation under node_modules/next/dist/docs.
