# EventLoom AI file tree

This inventory describes project deliverables, including documentation preparation added after the owner manually published the initial scaffold. Version-control metadata is excluded. All source, test, fixture, environment, runtime configuration, and marker files are **zero bytes**.

Only Markdown documents/templates, the MIT LICENSE, and .gitignore contain text. Descriptions beside source files explain future responsibilities; they are not implemented behavior.

## Complete inventory

```text
EventLoom-AI/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md  # safe bug-report template
│   │   └── feature_request.md  # focused feature-request template
│   ├── workflows/
│   │   └── .gitkeep  # empty marker; no CI workflow is configured
│   └── PULL_REQUEST_TEMPLATE.md  # pull request review prompts
├── docs/
│   ├── screenshots/
│   │   └── .gitkeep  # empty marker for future reviewed demo captures
│   ├── API_CONTRACT.md  # proposed endpoints, fields, and error semantics
│   ├── ARCHITECTURE.md  # planned boundaries, request flow, and scaling
│   ├── DEVELOPMENT.md  # future implementation order and tooling responsibilities
│   ├── GIT_BATCHES.md  # five manual commit/push batches
│   ├── HACKATHON.md  # exact event context and submission preparation
│   └── IMPLEMENTATION_BRIEF.md  # tomorrow's MVP, UX, prompts, evaluation, and task order
├── public/
│   ├── icons/
│   │   └── .gitkeep  # empty marker for future public icons
│   └── images/
│       └── .gitkeep  # empty marker for future public images
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── plans/
│   │   │       ├── refine/
│   │   │       │   └── route.ts  # future POST /api/plans/refine handler
│   │   │       └── route.ts  # future POST /api/plans handler
│   │   ├── planner/
│   │   │   └── page.tsx  # interactive planner page at /planner
│   │   ├── error.tsx  # recoverable route error boundary
│   │   ├── globals.css  # global styling and future Tailwind entry
│   │   ├── layout.tsx  # root page layout
│   │   ├── loading.tsx  # route loading state
│   │   ├── not-found.tsx  # not-found page
│   │   └── page.tsx  # landing page at /
│   ├── components/
│   │   ├── layout/
│   │   │   ├── site-footer.tsx  # site footer and collaboration links
│   │   │   └── site-header.tsx  # site identity and primary navigation
│   │   ├── planner/
│   │   │   ├── budget-breakdown.tsx  # estimated cost categories and totals
│   │   │   ├── checklist.tsx  # preparation tasks
│   │   │   ├── event-form.tsx  # event brief entry and validation feedback
│   │   │   ├── itinerary.tsx  # event schedule presentation
│   │   │   ├── plan-results.tsx  # generated plan presentation
│   │   │   └── refine-form.tsx  # revision request entry
│   │   └── ui/
│   │       ├── button.tsx  # shared action control
│   │       ├── input.tsx  # shared single-line input
│   │       ├── select.tsx  # shared choice control
│   │       ├── status-message.tsx  # accessible progress and error messages
│   │       └── textarea.tsx  # shared multi-line input
│   ├── config/
│   │   ├── ai.ts  # server-only model and generation settings
│   │   ├── event-types.ts  # supported celebration categories
│   │   └── site.ts  # public project metadata
│   ├── hooks/
│   │   └── use-event-planner.ts  # browser request lifecycle and current plan state
│   ├── lib/
│   │   ├── validation/
│   │   │   ├── event-input.ts  # brief and revision input validation
│   │   │   └── plan-output.ts  # model output and domain invariant validation
│   │   ├── env.ts  # server environment validation
│   │   ├── errors.ts  # shared safe error handling
│   │   └── utils.ts  # small shared helpers when needed
│   ├── services/
│   │   └── ai/
│   │       ├── prompts/
│   │       │   ├── generate-plan.ts  # initial proposal prompt
│   │       │   ├── refine-plan.ts  # revision prompt
│   │       │   └── system.ts  # planner role and shared constraints
│   │       ├── gemini-client.ts  # server-only provider client boundary
│   │       ├── generate-plan.ts  # initial generation behavior
│   │       └── refine-plan.ts  # revision behavior
│   └── types/
│       ├── api.ts  # request, response, and error types
│       ├── event.ts  # event brief types
│       └── plan.ts  # provider-independent plan types
├── tests/
│   ├── e2e/
│   │   └── planner.spec.ts  # complete planner journey checks
│   ├── fixtures/
│   │   ├── event-input.json  # empty synthetic input fixture placeholder
│   │   └── plan-output.json  # empty synthetic plan fixture placeholder
│   ├── integration/
│   │   ├── plans-route.test.ts  # generation API boundary checks
│   │   └── refine-route.test.ts  # refinement API boundary checks
│   ├── unit/
│   │   ├── event-input.test.ts  # input-validation checks
│   │   ├── generate-plan.test.ts  # generation with a mocked provider
│   │   ├── plan-output.test.ts  # plan-validation checks
│   │   └── refine-plan.test.ts  # refinement and constraint-preservation checks
│   ├── README.md  # future checks and current verification limits
│   └── setup.ts  # minimal future test setup
├── .env.example  # empty future environment-variable template
├── .gitignore  # populated repository hygiene rules; no application code
├── CODE_OF_CONDUCT.md  # community behavior, reporting, and moderation
├── CONTRIBUTING.md  # contribution scope, workflow, and review expectations
├── eslint.config.mjs  # empty lint configuration
├── FILE_TREE.md  # complete scaffold inventory and ownership
├── LICENSE  # MIT license
├── next-env.d.ts  # empty framework type-declaration placeholder
├── next.config.ts  # empty Next.js configuration
├── package.json  # empty dependency and package-script manifest
├── playwright.config.ts  # empty browser-test configuration
├── postcss.config.mjs  # empty Tailwind/PostCSS configuration
├── README.md  # project overview, status, stack, and navigation
├── SECURITY.md  # private disclosure process and future security requirements
├── tsconfig.json  # empty compiler and import-alias settings
└── vitest.config.ts  # empty unit/integration test configuration
```

## Ownership and conventions

- `src/app/` follows Next.js App Router conventions. Only `page.tsx` and `route.ts` files represent planned public routes; ordinary module names do not add endpoints.
- `src/components/layout/`, `ui/`, and `planner/` separate site structure, reusable controls, and event-specific presentation.
- `src/services/ai/` and `src/config/ai.ts` are planned server-only modules. Browser components must not import credentials or provider code.
- `src/lib/validation/` owns runtime trust-boundary checks; `src/types/` describes shared compile-time contracts.
- `public/` holds assets that will be publicly accessible. Never place private event data or credentials there.
- `tests/` separates focused unit checks, HTTP-boundary integration checks, a browser journey, and synthetic fixtures.
- The workflow and asset folders contain empty `.gitkeep` files so a later manual Git commit can preserve those directories.

## Intentionally absent

No lockfile, installed dependencies, generated build output, real environment file, executable workflow, database schema, deployment configuration, or application implementation is included. Empty JSON files are placeholders rather than valid JSON data. The owner has since initialized and published the repository; `.git/` metadata is outside this inventory.

There is no `tailwind.config.ts` because the planned setup uses Tailwind through PostCSS and CSS-first configuration. There are no barrel exports because there are no implementations to export.

## Keeping this inventory current

When a later authorized change adds or removes a file, update this inventory and the affected architecture, test plan, and publication instructions. Do not populate empty source files just to make the tree appear functional.

The five original publication batches are recorded in [GIT_BATCHES.md](docs/GIT_BATCHES.md). Subsequent documentation preparation is a local follow-up change and needs a separate owner-managed commit if it is to be published.
