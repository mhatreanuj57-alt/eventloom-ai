# Verification

Run npm test for unit and route integration checks; run npm run build before npm run test:e2e -- --workers=2.

The browser suite uses Chromium desktop, Pixel 7 emulation, Firefox and WebKit. Installed browser engines are required:

```powershell
npx playwright install chromium firefox webkit
```

## Coverage

- Input bounds, dates, time zones and minor-unit money.
- Structured provider protocol, safe provider failures, JSON parsing and full route-to-provider validation for all three occasions.
- Budget arithmetic/currency/identifiers and chronological, non-overlapping activities.
- Account route authentication, ownership filters, version conflicts, invalid backups and atomic restore invocation.
- Shared quota outcomes, failure-closed behavior and browser-facing origin checks.
- Storage validation, duplicates, unsafe IDs, invalid progress references and write failure behavior.
- Real PDF bytes/metadata/page structure, Unicode fonts, long text, drafts and unsupported-character fallback.
- Browser drafts, editing, generation/refinement, persistence, spending, tasks, vendors, status, deletion, regeneration failures and backups.
- Keyboard modal focus/arrow tabs, responsive overflow at 320/768/1024/1440 widths, and axe WCAG A/AA checks on core screens.

Accessibility scans disable entrance animations using the application's reduced-motion mode, so transient opacity is not confused with the final text contrast. This does not replace a manual screen-reader audit. Browser engines and viewport emulation do not certify physical iOS/Android or hardware performance.

Performance attachments contain measured local navigation/resource values; they are not production Core Web Vitals or a Lighthouse score.

## Live checks

supabase/tests/private_events.sql tests owner isolation, anonymous denial, cross-owner writes, atomic restoration rollback and account quotas inside a rolled-back remote transaction.

scripts/verify-supabase.mjs tests actual account UI/API persistence using two disposable confirmed users, with no emails. It cleans them up afterward. With --gemini it deliberately consumes quota for real generation/refinement. See docs/DEVELOPMENT.md.

Detailed executed results and remaining limits are recorded in [docs/VERIFICATION.md](../docs/VERIFICATION.md). Do not claim mock responses prove live Gemini availability.
