# Security policy

## Supported scope and reporting

EventLoom is implemented and locally verified; no public deployment or security certification is claimed. There is no staffed response SLA.

Report privately through GitHub Security → Advisories → Report a vulnerability if enabled for the existing repository. If unavailable, request a private channel without publishing exploit details or credentials. No verified security mailbox or bounty promise has been established.

Use synthetic reproductions. Do not access other users' records, send unwanted email, disrupt services, or trigger unnecessary paid AI calls.

## Implemented controls

- Gemini credentials and calls stay in server-only modules; responses never contain credentials or raw provider errors.
- Supabase cookie sessions are independently checked with getUser on protected APIs. Proxy refresh is not the sole authorization boundary.
- Event ownership comes from the verified user. RLS enforces owner-only select/insert/update/delete and denies anonymous table access.
- The application uses a publishable key with user-session authorization; no service-role key is deployed.
- Account mutations require a matching browser-facing Origin, with Host/forwarded protocol supporting Next/Vercel.
- Streamed body caps apply without trusting Content-Length: 64 KiB planning, 100 KB individual event save, 4 MB restoration.
- Zod validates input/output, money, schedules, item identifiers, unique events and progress references.
- Database versions prevent stale API updates/deletions. Account restore/reset is transactional.
- PostgreSQL atomically reserves 5 AI attempts per account and 20 per studio per UTC hour. Quota tables are hidden from client writes/reads; failure closes generation.
- Quota RPC has a fixed search path, qualified tables and authenticated-only execute grants.
- Provider, database, auth, browser and font requests have timeouts; SDK retries are disabled.
- Destructive UI operations disclose consequences and require confirmation. Invalid backups and unreadable guest data are not silently discarded.
- PDF creation is local. Backups/reports contain event data, never server credentials or account passwords.

These controls cannot guarantee semantic AI accuracy. User/model strings are rendered as text; no generated HTML/code is executed and the model has no application tools.

## Credentials and privacy

Only NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY belong in the public bundle. Never use NEXT_PUBLIC_ for Gemini, database passwords, access tokens or a service-role/secret Supabase key.

.env.local and Supabase temporary metadata are ignored. The database password generated for the owner-authorized project is stored only in that local file for CLI administration. It is not needed in Vercel application settings.

The separate live verification script temporarily obtains an admin key through the CLI in memory, creates/deletes synthetic users, and does not write it to disk or send emails. It is not an application route.

Rotate the Gemini key previously exposed in chat before public use, inspect provider usage, and revoke exposed copies. Removing a value from a file does not revoke it.

Signed-in events are stored remotely in Supabase and sent to Gemini when generation/refinement is requested. Guest events remain unencrypted browser localStorage data. Backups and PDFs may contain private event details; users must protect downloaded files. No automatic guest upload occurs.

## Before launch

Configure Supabase email confirmation, SMTP, strong-password settings and exact allowed redirects. Review signup rate limits/CAPTCHA, Google quota/spending settings, deployment logs/monitoring, backup/retention processes and account-deletion support. Account deletion currently requires the operator/provider; there is no self-service deletion UI.

Use a separate database for untrusted preview code. Secure both the hosting and Supabase administration accounts. Origin checks supplement authentication; non-browser clients can forge Origin, so it never replaces verified identity or RLS.

A readable HTML report is provided for accessibility; PDF output is not certified PDF/UA. Unicode outside the embedded fonts requires the browser print alternative.

## Dependency audit — 22 October 2026

The executed production audit reports zero advisories. The full dependency audit still reports five high-severity entries in one development-only lint chain: eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces.

The [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) had no patched release at the previous review. Avoid untrusted lint glob inputs and monitor upstream. The proposed forced fix downgrades framework lint tooling incompatibly and was not applied. This is a disclosed residual tooling risk, not a clean full audit.
