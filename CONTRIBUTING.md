# Contributing to EventLoom AI

Follow the [Code of Conduct](CODE_OF_CONDUCT.md). Report vulnerabilities privately using [SECURITY.md](SECURITY.md).

## Scope and setup

Implementation is now open; the former empty-scaffold restriction has ended. Read the [README](README.md), [architecture](docs/ARCHITECTURE.md), [API contract](docs/API_CONTRACT.md), and [development guide](docs/DEVELOPMENT.md).

Use Node.js 22+, npm ci, and the development scripts documented in README. Keep private values in ignored local environment files. Routine checks mock Gemini and do not require a paid provider credential.

## Useful contributions

Choose one concrete issue. Describe the user problem and acceptance criteria before broad changes. Improvements to accessibility, state recovery, provider robustness, meaningful testing, and documentation are welcome.

Keep the existing layers. Reuse shared components, validators, and errors. Supabase accounts and private storage are implemented; preserve their RLS, version checks and atomic restore behavior. Avoid additional providers, dependencies or abstractions without an agreed requirement. Follow the deployment checklist before publishing a public instance.

## Working process

1. Inspect existing behavior, related callers, contracts, fixtures, and tests.
2. Make the smallest complete change in your local branch/fork.
3. Update affected documentation, types, validation, and rendering together.
4. Run relevant checks and describe exactly what passed or was skipped.
5. Open a pull request with the supplied template and a linked issue.
6. Respond to review and preserve unrelated work.

The repository owner performs Git operations manually. [The five implementation batches](docs/GIT_BATCHES.md) are publication instructions, not an automatic workflow.

## Validation

Run lint, type checking, unit/integration checks, and a production build for shared changes. For UI/workflow changes, run the relevant Playwright coverage and inspect actual desktop/mobile rendering.

Use synthetic fixtures and mocked provider responses. Live Gemini checks must be deliberate, use a private server credential, disclose quota/cost, and never log private briefs or keys. Do not claim live-provider or physical-device coverage from mocks or viewport emulation.

Keep invalid local data recoverable. Do not silently reset storage, spending, vendor status, or checked tasks. Destructive user actions need clear consequences and confirmation.

## Code and UX conventions

- Descriptive kebab-case files, TypeScript strict mode, shared Zod boundaries.
- Server-only Gemini/env modules; browser calls to local API routes.
- Integer minor-unit money, explicit supported currency, checked totals.
- Native form controls; Radix-based dialogs/tabs for focus and keyboard behavior.
- Semantic HTML, explicit labels, visible focus, accessible errors, and reduced motion.
- Honest sample labels, estimates, limitations, and vendor status ownership.

Use conventional commit messages such as docs:, chore:, feat:, fix:, and test:. A message should describe the actual outcome rather than claim unsupported completion.

## License and review

Contributions are distributed under the [MIT License](LICENSE). Confirm permission to contribute, retain third-party notices, and document asset provenance. Read [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) before replacing borrowed components or media.

The owner assigns reviewers and release decisions. No response SLA or release schedule is promised.
