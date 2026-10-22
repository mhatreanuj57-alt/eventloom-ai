# Owner-run Vercel deployment

No GitHub push or Vercel deployment was performed. These are manual instructions for the existing project.

## Before deployment

- Rotate the Gemini key previously shared in chat. Store the replacement only in the server environment.
- Confirm Supabase migrations are applied to the intended project. EventLoom's new project is tqofweotswghcjrakgqf in Mumbai; do not modify the unrelated existing project.
- The new Supabase project already requires email confirmation and a minimum password length of 12. Configure a production SMTP sender and provider rate limits; check email delivery/recovery with an address you control.
- Set the Supabase Auth Site URL to your final HTTPS app URL. Allow its exact /auth/callback redirect and approved localhost/preview callback origins. Avoid broad production redirect wildcards.
- Configure Google quota/spending controls. The app also reserves 5 AI attempts per account and 20 per studio per UTC hour in PostgreSQL.
- Use Node.js 24 LTS in Vercel project settings. vercel.json uses Next.js, npm ci and npm run build. AI routes declare maxDuration = 90; verify the selected Vercel plan permits it.
- Run lint, typecheck, tests, build and cross-browser checks. Review SECURITY.md and docs/VERIFICATION.md.
- Keep .env.local, .audit, Supabase temporary metadata and test outputs out of source publication.

The application does not require a Supabase service-role key or database password in Vercel. NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is intentionally public; database policies protect private rows. GEMINI_API_KEY must never use NEXT_PUBLIC_.

## Manual CLI commands

Run these yourself after reviewing the checklist. Enter values at the private CLI prompts; never put secrets directly in commands or chat.

```powershell
Set-Location -LiteralPath 'C:\Users\ADMIN\EventLoom-AI'
vercel login
vercel link
vercel env add GEMINI_API_KEY production
vercel env add GEMINI_MODEL production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production
```

For a separately reviewed preview:

```powershell
vercel env add GEMINI_API_KEY preview
vercel env add GEMINI_MODEL preview
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY preview
vercel
```

Use a separate Supabase project for untrusted preview branches. Public environment values are embedded at build time: changing them requires a new build. Review the preview, then publish manually:

```powershell
vercel --prod
```

An existing Vercel/Git integration may deploy when you later push source. Review that integration yourself before using the Git commands. No automatic Git integration was established by this work.

## Deployed smoke checklist

- [ ] Landing, navigation and assets load over HTTPS at mobile/tablet/desktop sizes.
- [ ] Sign-up confirmation, sign-in, password recovery and sign-out work on the deployed origin.
- [ ] Account A's events cannot be read or changed by account B or a signed-out visitor.
- [ ] Create a draft; reload and open it in another signed-in browser; edit and delete it.
- [ ] Generate wedding, birthday and community plans; verify sums and review personalized constraints.
- [ ] Refine/regenerate; verify warnings and that failures preserve the old plan.
- [ ] Record an expense, task and vendor status, reload and verify persistence.
- [ ] Download PDF, open the readable report, export and restore a synthetic JSON backup.
- [ ] Verify stale saves return a conflict and rate/quota errors remain understandable.
- [ ] Check logs contain no credentials, private briefs, passwords or full model responses.
- [ ] Check real devices and at least one actual Safari installation; local WebKit is not Safari certification.
- [ ] Confirm provider billing/limits, SMTP, monitoring, backup/retention practices and a rollback owner.

If launch fails, disable generation or roll back to a known deployment. Do not reset the remote database to solve an application deployment issue.

Configuration follows [Vercel's static configuration](https://vercel.com/docs/project-configuration/vercel-json), [function duration documentation](https://vercel.com/docs/functions/configuring-functions/duration), and [Supabase's server-side session guidance](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs).
