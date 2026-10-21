# Development roadmap

## This phase: scaffold only

The project deliberately has no implementation. All runtime/configuration files, environment templates, source, tests, and JSON fixtures are zero bytes. The only populated files are documentation, the MIT license, and repository ignore rules.

Do not run an installer, formatter, framework generator, or code-generation tool over these placeholders during this phase. Such tools can populate files and violate the requested boundary. Empty JSON files are not valid documents, and empty test files do not constitute tests.

## Read before implementation

1. Start with [tomorrow's implementation brief](IMPLEMENTATION_BRIEF.md), then review the [architecture](ARCHITECTURE.md), [proposed API contract](API_CONTRACT.md), and [security policy](../SECURITY.md). Verify the rules for PromptWars Virtual 2026 in the actual event dashboard.
2. Confirm that the owner has authorized implementation.
3. Agree on concrete limits, supported currencies/event types, model choice, and the current plan's lifecycle.
4. Select and record compatible runtime and dependency versions.
5. Implement one vertical path before expanding scope.

## Planned tooling responsibilities

| Placeholder | Future responsibility |
| --- | --- |
| `package.json` | Package name `eventloom-ai`, dependencies, scripts, runtime requirements |
| `tsconfig.json` | Strict TypeScript settings and the `@/*` → `src/*` alias |
| `next-env.d.ts` | Framework-generated type declarations after tooling setup |
| `next.config.ts` | Only required Next.js settings |
| `postcss.config.mjs` | Tailwind PostCSS integration |
| `eslint.config.mjs` | Compatible lint rules for the chosen framework/toolchain |
| `vitest.config.ts`, `tests/setup.ts` | Unit/integration environment and shared test setup |
| `playwright.config.ts` | Browser-test environment and application startup |
| `.env.example` | Documented names with safe placeholder values after implementation begins |
| `.github/workflows/.gitkeep` | Directory marker only; no executable CI configuration |

Follow [Next.js installation guidance](https://nextjs.org/docs/app/getting-started/installation) for the selected supported release, and verify its runtime requirements at implementation time. Choose a compatible set of Next.js, React, TypeScript, Tailwind, PostCSS, ESLint, Google Gen AI SDK, Vitest, and Playwright versions rather than assuming an empty manifest already specifies them.

The future owner should define development, production build/start, lint, type-check, unit/integration, and browser-test commands in the package manifest. No package scripts exist now, so this document does not present them as runnable setup instructions.

## Suggested implementation order

### 1. Tooling and domain contracts

Populate the manifest and minimal configuration only after authorization. Install selected dependencies and generate a genuine lockfile. Define event, plan, API, and runtime validation contracts together. Document actual field limits and the chosen currency representation.

### 2. Server boundary

Validate required environment settings. Implement the server-only Gemini client, bounded generation, prompt modules, and independent output validation. Add generation and refinement routes with stable, safe errors. Include request-size limits, abuse controls, and provider spending limits before opening public access.

### 3. Planner experience

Implement landing and planner pages, form controls, status messages, and result sections for weddings, birthdays, and community events. Include budgets, preparation timelines, an event-day itinerary, vendor checklists, and personalized ideas. Preserve input on failure. Support revisions using the current brief and plan in memory. Keep generated content readable and label estimates and assumptions.

### 4. Meaningful checks

Populate synthetic fixtures and implement the cases described in [tests/README.md](../tests/README.md). Keep routine checks independent of paid live API calls. Verify keyboard access, responsive layout, and failure recovery.

### 5. Release preparation

Create actual CI workflow files only after local checks exist. Configure private reporting channels, review provider data handling, document deployed versions and limitations, and complete the hackathon checklist. Publish or deploy only when the owner authorizes that action.

## Deliberate exclusions

No database, authentication, booking/payment flow, vector store, agent framework, provider abstraction, monorepo, Docker setup, or infrastructure configuration is included. Add one only in response to an agreed requirement. The initial design needs a single application and one AI provider.

Git and GitHub publication are handled manually through [GIT_BATCHES.md](GIT_BATCHES.md); this roadmap does not execute those steps.
