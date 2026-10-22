# Project file tree

149 project deliverables are listed below. Dependencies, build/test output, local audit artifacts, Supabase temporary metadata, private environment values and unrelated personal documents are excluded. Empty .gitkeep files retain intentional asset/template directories.

```text
EventLoom-AI/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── workflows/
│   │   └── .gitkeep
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   ├── screenshots/
│   │   └── .gitkeep
│   ├── API_CONTRACT.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   ├── GIT_BATCHES.md
│   ├── HACKATHON.md
│   ├── IMPLEMENTATION_BRIEF.md
│   ├── SCREENSHOTS.md
│   ├── SUBMISSION.md
│   └── VERIFICATION.md
├── public/
│   ├── fonts/
│   │   ├── NotoSans-Regular.ttf
│   │   └── NotoSansDevanagari-Regular.ttf
│   ├── icons/
│   │   └── .gitkeep
│   ├── images/
│   │   ├── .gitkeep
│   │   ├── birthday.jpg
│   │   ├── community.jpg
│   │   └── wedding.jpg
│   ├── licenses/
│   │   ├── DM-Sans-OFL.txt
│   │   ├── Instrument-Serif-OFL.txt
│   │   └── Noto-OFL.txt
│   └── icon.svg
├── scripts/
│   └── verify-supabase.mjs
├── src/
│   ├── app/
│   │   ├── (studio)/
│   │   │   ├── budget/
│   │   │   │   └── page.tsx
│   │   │   ├── checklist/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── events/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── report/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── events/
│   │   │   │   └── route.ts
│   │   │   └── plans/
│   │   │       ├── refine/
│   │   │       │   └── route.ts
│   │   │       └── route.ts
│   │   ├── auth/
│   │   │   ├── callback/
│   │   │   │   └── route.ts
│   │   │   └── sign-in/
│   │   │       └── page.tsx
│   │   ├── planner/
│   │   │   └── page.tsx
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   ├── account-provider.tsx
│   │   │   └── auth-form.tsx
│   │   ├── layout/
│   │   │   ├── app-shell.tsx
│   │   │   ├── brand.tsx
│   │   │   ├── providers.tsx
│   │   │   ├── site-footer.tsx
│   │   │   ├── site-header.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── planner/
│   │   │   ├── budget-breakdown.tsx
│   │   │   ├── checklist.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── event-card.tsx
│   │   │   ├── event-form.tsx
│   │   │   ├── event-report.tsx
│   │   │   ├── itinerary.tsx
│   │   │   ├── management-view.tsx
│   │   │   ├── plan-results.tsx
│   │   │   ├── refine-form.tsx
│   │   │   └── settings.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── status-message.tsx
│   │       ├── tabs.tsx
│   │       └── textarea.tsx
│   ├── config/
│   │   ├── ai.ts
│   │   ├── event-types.ts
│   │   └── site.ts
│   ├── hooks/
│   │   ├── use-event-planner.ts
│   │   └── use-events.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── validation/
│   │   │   ├── event-input.ts
│   │   │   └── plan-output.ts
│   │   ├── env.ts
│   │   ├── errors.ts
│   │   ├── event-report.ts
│   │   ├── event-storage.ts
│   │   ├── pdf-report.ts
│   │   ├── plan-route.ts
│   │   ├── rate-limit.ts
│   │   ├── request-origin.ts
│   │   ├── sample-events.ts
│   │   └── utils.ts
│   ├── services/
│   │   └── ai/
│   │       ├── prompts/
│   │       │   ├── generate-plan.ts
│   │       │   ├── refine-plan.ts
│   │       │   └── system.ts
│   │       ├── gemini-client.ts
│   │       ├── generate-plan.ts
│   │       └── refine-plan.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── event.ts
│   │   └── plan.ts
│   └── proxy.ts
├── supabase/
│   ├── migrations/
│   │   ├── 20261022130000_private_events.sql
│   │   ├── 20261022133000_require_payload_id.sql
│   │   ├── 20261022140000_shared_ai_quota.sql
│   │   └── 20261022141000_workspace_size.sql
│   ├── tests/
│   │   └── private_events.sql
│   ├── .gitignore
│   └── config.toml
├── tests/
│   ├── e2e/
│   │   └── planner.spec.ts
│   ├── fixtures/
│   │   ├── event-input.json
│   │   └── plan-output.json
│   ├── integration/
│   │   ├── events-route.test.ts
│   │   ├── planning-boundary.test.ts
│   │   ├── plans-route.test.ts
│   │   └── refine-route.test.ts
│   ├── unit/
│   │   ├── event-input.test.ts
│   │   ├── event-report.test.ts
│   │   ├── event-storage.test.ts
│   │   ├── gemini-client.test.ts
│   │   ├── generate-plan.test.ts
│   │   ├── plan-output.test.ts
│   │   ├── rate-limit.test.ts
│   │   ├── refine-plan.test.ts
│   │   └── request-origin.test.ts
│   ├── README.md
│   └── setup.ts
├── .better-web-ui.md
├── .env.example
├── .gitignore
├── AGENTS.md
├── CODE_OF_CONDUCT.md
├── components.json
├── CONTRIBUTING.md
├── eslint.config.mjs
├── FILE_TREE.md
├── LICENSE
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── playwright.config.ts
├── postcss.config.mjs
├── README.md
├── SECURITY.md
├── THIRD_PARTY_NOTICES.md
├── tsconfig.json
├── vercel.json
└── vitest.config.ts
```

Source, route, validation and test files are implemented. The historical empty scaffold restriction ended when the owner authorized implementation. See [architecture](docs/ARCHITECTURE.md), [verification](docs/VERIFICATION.md), and [manual publication batches](docs/GIT_BATCHES.md).
