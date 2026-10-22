# Screenshots and demo assets

Use only synthetic events or the visibly labeled sample workspace. Never capture environment files, API tokens, passwords, email inbox contents, real guest details or a Supabase API-key screen.

Capture current screens at 1440×1000 desktop, 768×1024 tablet, and 390×844 mobile. Include both light and dark themes, the wizard, a generated/sample plan, budget tracking and the readable report. Preserve sample labels and estimate disclaimers.

Put reviewed public screenshots in docs/screenshots and use descriptive names such as dashboard-desktop-light.png. .audit contains local QA artifacts and is ignored; do not stage that directory wholesale.

For a running local production server:

```powershell
npx playwright screenshot --viewport-size="1440,1000" --wait-for-timeout=1500 http://127.0.0.1:3100/dashboard docs/screenshots/dashboard-desktop-light.png
npx playwright screenshot --viewport-size="390,844" --wait-for-timeout=1500 http://127.0.0.1:3100/planner docs/screenshots/planner-mobile-light.png
```

Inspect crops, text contrast, readable font sizes, overflow, focus, errors and loading states. Label evidence with the date, browser engine and viewport. A screenshot of a sample is not proof of live Gemini generation; use the verification report to distinguish live and mocked checks.
