# Final verification — 22 October 2026

The existing application was completed and verified locally. The owner-authorized Supabase project was created and migrated. No Git command, GitHub publication, Vercel deployment or competition submission was performed.

## Completed behavior

| Area | Verified behavior |
| --- | --- |
| Interface | Editorial landing/dashboard/wizard; responsive navigation; light/dark/system themes |
| Events | Create drafts, edit, save, search/filter, change status and delete with confirmation |
| AI | Server-side structured Gemini generation for weddings, birthdays and community gatherings; creative refinement |
| Budget | Allocation arithmetic/currency/cap checks, editable actual expenses and over-budget display |
| Timeline | Chronological non-overlapping same-day activities and preparation due dates |
| Vendors/ideas | Vendor questions, recorded statuses, task completion, palettes and personalized suggestions |
| Regeneration | Explicit replacement warning; failed calls preserve the current plan |
| Reports | Real downloadable PDF bytes, Unicode embedding, pagination, readable/printable alternative |
| Recovery | Validated JSON backups, explicit replacement, atomic cloud restore and corrupt guest-data protection |
| Accounts | Email/password UI, confirmation/recovery handlers, verified session APIs and sign-out |
| Persistence | Owner-scoped Supabase rows, cross-session expense persistence and stale-write conflicts |
| Abuse limits | Atomic shared hourly quota, per-account allowance, bounded bodies and timeouts |
| Handoff | Vercel config/checklist, environment docs, submission draft and five manual Git batches |

## Executed checks

| Check | Observed result |
| --- | --- |
| npm test | **70 passed across 13 files** |
| npm run lint | **Passed without warnings** |
| npm run typecheck | **Passed** |
| npm run build | **Passed; all application routes and session proxy built** |
| Playwright | **52 passed: 13 workflows × Chromium desktop, Pixel 7 emulation, Firefox and WebKit** |
| axe WCAG A/AA checks | **No violations in the tested landing, wizard, settings, sign-in and report screens, in both themes** |
| Responsive checks | **No horizontal overflow in tested 320/768/1024/1440 widths and mobile workflows** |
| Keyboard checks | **Dialog dismissal/focus restoration, native controls and arrow-key planning tabs passed** |
| Production dependency audit | **0 vulnerabilities** |
| Full dependency audit | **5 high entries in the known development-only braces/lint chain; see SECURITY.md** |

Accessibility scans use reduced-motion mode to measure final colors rather than intermediate fade opacity. WebKit is an engine-level check, not certification of a physical Safari device.

## Actual service checks

Supabase project: **EventLoom-AI**, **tqofweotswghcjrakgqf**, **ap-south-1 (Mumbai)**. Four local/remote migration versions match: 20261022130000, 20261022133000, 20261022140000 and 20261022141000.

The new project's Auth configuration now requires email confirmation and 12-character passwords, allows the local confirmation/recovery callbacks, and preserves the original MFA/eight-digit email-code defaults. Unused paid vector storage remains disabled; no plan upgrade was made.

Rollback-only remote SQL checks passed for owner access, anonymous denial, cross-owner read/update/delete/insert protection, failed restore rollback, account quotas, the 50-event ceiling and the restorable workspace-size limit.

The live account script signed in two independent confirmed synthetic users through the UI, saved a plan, blocked another user's access, persisted actual spending after reload, rejected stale writes/invalid backups, and verified sign-out removed account API access. Temporary users were deleted; a final database query found **zero remaining synthetic QA accounts**. No verification emails were sent by these checks.

The final live Gemini run passed:

1. Wedding generation.
2. Birthday generation.
3. Creative refinement of the birthday plan.
4. Community generation.

All four responses passed the application's independent validators. The final provider run had no failures. Earlier diagnostics saw an unavailable response and a rejected palette format; explicit provider-schema examples resolved the reproducible formatting issue. Strict validation remains in place. These samples do not guarantee future provider availability or semantic correctness for every brief.

## Rendering/performance evidence

Reviewed synthetic-data captures cover a desktop dashboard, mobile wizard and tablet report. Local Chromium lab captures used reduced motion and a warm browser cache; measured LCP ranged from 40–92 ms and CLS from 0–0.059 on those captures, with no horizontal overflow. These fast localhost results are **not production Core Web Vitals, mobile-network results or a Lighthouse score**.

PDF libraries/fonts load on download, rather than in the initial page path. Browser performance attachments and local evidence are kept in ignored .audit/test outputs; screenshot publication guidance is in SCREENSHOTS.md.

## Resolved findings

- Corrected the external-origin check behind Next's internal localhost URL, restoring authenticated saves.
- Added database-backed ownership and shared quotas for Vercel instances.
- Preserved plans/trackers for name-only edits and rejected edits made stale by another session.
- Added explicit plan regeneration and confirmed destructive replacement.
- Added Unicode PDF support, a required shaping runtime, bounded layout and a readable fallback.
- Added validated recovery instead of leaving exported backups unusable.
- Corrected migration constraint naming and verified the applied database state.
- Kept failed writes, AI failures and invalid restores from reporting success.

## Remaining launch actions and limits

- **Rotate the Gemini key previously exposed in chat before public use.**
- Replace the local Supabase Site URL/allowlist with reviewed production HTTPS URLs and configure SMTP delivery. Verify confirmation/recovery with an address you control; actual email delivery was not tested.
- Run the deployed HTTPS smoke checklist after the owner deploys; public routing, hosting duration and production traffic remain unverified.
- Physical iOS/Android devices, actual Safari, screen-reader sessions, slow networks and load/stress testing were not performed.
- AI estimates and suggestions require review. Costs/availability are not verified vendor quotes or bookings.
- PDF output is not certified PDF/UA; unsupported glyphs use the browser print alternative.
- Self-service account deletion, realtime collaboration and offline cloud queues are outside the implemented core; operator/provider account deletion remains available.
- The known development-only dependency advisory remains; no incompatible forced downgrade was applied.
- Competition rules, deadlines, judging criteria and submission requirements remain unverified from the official dashboard.

Use [the deployment checklist](DEPLOYMENT.md), [five manual Git batches](GIT_BATCHES.md), and [security policy](../SECURITY.md) for owner review and publication.
