# EventLoom AI

GenAI-powered celebration and event planning for **PromptWars Virtual 2026**, organized by Hack2Skill in collaboration with Google for Developers, as identified by the project owner.

**Status: documentation and empty scaffold only.** No application, API, AI integration, executable tests, dependency installation, or deployment exists yet. Every source file, test fixture, environment template, and runtime configuration placeholder is intentionally zero bytes. Empty JSON files are not valid configuration; this project cannot be installed, built, or run in its present state.

EventLoom AI targets the owner-provided **Celebration & Event Planner** challenge: weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas. The owner supplied the [official event link](https://hack2skill.com/event/pwvirtual1) and [submission dashboard](https://hack2skill.com/event/pwvirtual1/dashboard/submissions). Deadlines, judging criteria, build-window rules, and submission requirements remain unverified. Do not borrow rules from another PromptWars edition.

## Project vision

Help people turn an event brief into a practical celebration plan. The intended experience collects an occasion, guest count, budget, currency, location, date, and preferences, then uses Google Gemini to propose a theme, estimated budget, itinerary, and preparation checklist. Users should be able to refine the proposal without losing their original constraints.

The core occasions are weddings, birthdays, and community celebrations. Generated suggestions must respect cultural preferences, dietary needs, accessibility requirements, and explicit exclusions. Vendor checklists identify relevant categories and questions to ask without inventing businesses, prices, availability, or confirmed bookings.

## Planned core experience

1. Open the landing page and enter the planner.
2. Describe the event and its constraints.
3. Submit the brief to a server-side API route.
4. Receive a validated plan with clearly labeled estimates and assumptions.
5. Review the budget, preparation timeline, event-day schedule, and vendor checklist.
6. Request a supported revision, such as a different theme; the proposed first version changes hard constraints through the structured event form.

All capabilities above are planned. There are no live vendor quotes, bookings, payments, accounts, saved plans, or guarantees about local availability. The initial design keeps the current plan in browser memory and sends it with a revision request; it does not require a database.

## Planned technology

| Area | Choice | Intended role |
| --- | --- | --- |
| Application | Next.js App Router and React | Pages, layouts, and server-side route handlers |
| Language | TypeScript | Shared request, response, and domain types |
| Styling | Tailwind CSS through PostCSS | Responsive, accessible interface |
| Generative AI | Google Gemini API via the Google Gen AI SDK, `@google/genai` | Structured event proposals and revisions |
| Unit and integration checks | Vitest | Validation, AI service behavior, and route behavior |
| Browser checks | Playwright | Main planner journey and keyboard interaction |
| License | MIT | Open-source use, modification, and redistribution |

No package versions are pinned and no dependencies are installed. Choose compatible, supported versions and an available Gemini model when implementation begins. This scaffold uses a CSS-first Tailwind direction with `postcss.config.mjs`; a separate Tailwind configuration file is not currently needed.

These choices follow the official [Next.js source-folder convention](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder), [Tailwind Next.js guide](https://tailwindcss.com/docs/installation/framework-guides/nextjs), and [Google Gen AI SDK guidance](https://github.com/googleapis/js-genai/blob/main/codegen_instructions.md). They describe the future implementation, not installed tooling.

## Repository layout

- `src/app/`: landing and planner pages, layout, styling, loading/error boundaries, and API routes.
- `src/components/`: shared controls, site layout, and event-planning presentation.
- `src/services/ai/`: server-only Gemini access, generation/refinement services, and prompt modules.
- `src/lib/`: environment handling, errors, utilities, and runtime validation.
- `src/types/`: event, plan, and API contracts.
- `src/config/`: site metadata, supported event categories, and server AI settings.
- `public/`: future public images and icons.
- `tests/`: empty unit, integration, browser, and fixture placeholders.
- `docs/`: architecture, API design, development roadmap, submission checklist, and manual Git batches.
- `.github/`: collaboration templates and an empty workflow directory marker.

See [FILE_TREE.md](FILE_TREE.md) for every file and its intended responsibility.

## Architecture and boundaries

The planned request path is browser form → Next.js route handler → input validation → AI service → Gemini → output validation → API response → plan presentation.

Gemini credentials and the AI client must stay on the server. Client components should call local API routes and must not import server services or secret-bearing configuration. Both user input and model output require runtime validation; TypeScript types alone do not validate external data.

Keep route handlers thin, prompts separate from transport concerns, and presentation independent of SDK responses. Add persistent storage or a job queue only if later requirements justify them. Deployment across multiple instances will require a shared quota mechanism before a public release.

Detailed boundaries are in [ARCHITECTURE.md](docs/ARCHITECTURE.md); proposed payloads and error behavior are in [API_CONTRACT.md](docs/API_CONTRACT.md).

Start tomorrow with [IMPLEMENTATION_BRIEF.md](docs/IMPLEMENTATION_BRIEF.md): exact event context, proposed MVP decisions, screen flow, prompt drafts, twelve evaluation cases, and implementation order. These are plans, not implemented features or verified competition rules.

## Getting started with this scaffold

Open this directory in your editor and read the architecture and development notes. Browsing and editing documentation requires no Node.js installation.

Do not run a project generator over this directory or expect package installation and development commands to work. The package manifest, compiler settings, and source files are deliberately empty. Do not populate these files during the scaffold-only phase.

When implementation is separately authorized, follow [DEVELOPMENT.md](docs/DEVELOPMENT.md): configure compatible dependencies and scripts, define validation contracts, implement the server boundary, then build the UI and tests. Record the selected runtime, package, and model versions at that time.

## Environment plan

The existing `.env.example` is empty by design. Future configuration should document these names without real credentials:

| Name | Location | Intended meaning |
| --- | --- | --- |
| `GEMINI_API_KEY` | Server only | Developer-owned Gemini credential |
| `GEMINI_MODEL` | Server only | Explicitly selected supported Gemini model identifier |

Store local values in an ignored `.env.local` file only after implementation begins. Never give a secret a `NEXT_PUBLIC_` prefix or include it in prompts, screenshots, fixtures, browser bundles, or logs. Google recommends keeping API calls behind a backend for client applications; see [Gemini API key guidance](https://ai.google.dev/gemini-api/docs/api-key).

## Quality and accessibility plan

Future checks should cover invalid inputs, malformed model output, provider timeouts and quota errors, budget arithmetic, constraint preservation during refinement, and the complete planner flow. Use synthetic fixtures and mocked AI responses in routine checks.

The interface should support keyboard navigation, visible focus, explicit labels, accessible error announcements, readable contrast, responsive layouts, and reduced motion preferences. Show progress and recoverable errors without discarding the user's brief.

No checks are executable yet. The test plan is in [tests/README.md](tests/README.md).

## Collaboration

Read [CONTRIBUTING.md](CONTRIBUTING.md), follow the [Code of Conduct](CODE_OF_CONDUCT.md), and use the issue and pull request templates. The project has no appointed maintainer or security contact yet; the repository owner must establish those channels before inviting public reports.

Security reports belong in a private channel described in [SECURITY.md](SECURITY.md), never in public issues with credentials or exploit details.

## Git and GitHub are manual

The owner manually published the five initial commits to [eventloom-ai](https://github.com/mhatreanuj57-alt/eventloom-ai). Owner-provided terminal output showed a clean working tree with `main` and `origin/main` at `8cf7254` after publication. Later documentation preparation is local until the owner chooses to commit it.

The original commands remain in **five sequential batches** in [GIT_BATCHES.md](docs/GIT_BATCHES.md) as a record of initial publication. Do not replay initialization or repository creation in the existing repository. All further Git operations remain manual.

## Hackathon preparation

Use [HACKATHON.md](docs/HACKATHON.md) to prepare a demo, evidence of prompt design, limitations, and a submission. This scaffold does not claim compliance with unverified competition rules.

## License

[MIT](LICENSE). Copyright (c) 2026 EventLoom AI contributors.
