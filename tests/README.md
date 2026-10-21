# Planned verification

All test source and JSON fixtures are intentionally zero-byte placeholders. No runner, assertions, mocks, dependencies, or executable checks exist yet. Do not report the test suite as passing.

## Placeholder responsibilities

| Path | Intended check |
| --- | --- |
| `unit/event-input.test.ts` | Valid and invalid brief fields, dates, currencies, and limits |
| `unit/plan-output.test.ts` | Output shape, budget arithmetic, scheduling, and constraints |
| `unit/generate-plan.test.ts` | Prompt input and mocked provider success/failure |
| `unit/refine-plan.test.ts` | Constraint preservation and explicit changed-constraint handling |
| `integration/plans-route.test.ts` | Request validation, safe statuses, and mocked generation |
| `integration/refine-route.test.ts` | Full revision boundary and malformed current plans |
| `e2e/planner.spec.ts` | Form → results → refinement, keyboard use, and recovery |
| `setup.ts` | Minimal shared runner setup when needed |
| `fixtures/event-input.json` | Synthetic event brief after schema approval |
| `fixtures/plan-output.json` | Synthetic valid plan after schema approval |

## Minimum acceptance cases once implemented

- Invalid input never calls the provider.
- Empty, malformed, or schema-invalid AI responses do not reach the UI as trusted plans.
- Budget allocations add up using the selected currency scale and stay within the effective budget.
- A revision preserves original constraints unless explicitly changed; later revisions receive the effective updated brief.
- Timeouts, quota failures, and service failures return safe messages without leaking provider internals.
- Double submission and retry behavior are bounded.
- Labels, focus, keyboard submission, announced progress/errors, and responsive layouts work.
- An error preserves the event brief and allows a deliberate retry.

Use mocked Gemini responses for routine checks. Fixtures must contain synthetic data and no credentials. Keep any live-provider check opt-in and disclose usage/cost; it is not required for the scaffold.

## Scaffold review now

Check that every non-documentation placeholder is zero bytes, all documented paths exist, and local documentation links resolve. Review the five manual publication batches for complete and non-overlapping staging paths.

Build, type, lint, browser, and API checks cannot run meaningfully until configuration and implementation exist. No executable scaffold-verification script is included because source files must remain empty.
