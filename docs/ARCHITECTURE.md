# Architecture blueprint

## Scope and status

This document describes a planned single Next.js application with server-side Gemini integration. Every source file is empty. No diagram or contract here represents implemented behavior.

The first useful version generates and refines plans for weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas. It does not need a separate backend service, database, authentication provider, payment system, vendor marketplace, or background worker. [Tomorrow's implementation brief](IMPLEMENTATION_BRIEF.md) records proposed first-version decisions.

## Planned request path

1. The planner form gathers a structured event brief.
2. A browser hook manages idle, submitting, success, and recoverable error states.
3. A Next.js POST route checks the request boundary and invokes input validation.
4. An AI service combines validated input with a versioned prompt design.
5. A server-only Gemini client makes a bounded provider request.
6. Output validation checks the response's shape and domain constraints.
7. The route returns a project-owned plan contract.
8. Presentation components render the budget, itinerary, checklist, and assumptions.

Refinement follows the same path with the original brief, current plan, and requested change. It must not depend on an unimplemented server-side plan store.

## Ownership by directory

| Location | Responsibility | Boundary |
| --- | --- | --- |
| `src/app/` | Pages, root layout, CSS, loading and error UI | Framework routing and composition |
| `src/app/api/` | Request parsing, response statuses, service invocation | External HTTP input |
| `src/components/` | Controls, layout, plan presentation | No SDK or credential access |
| `src/hooks/` | Planner request lifecycle | Calls local routes only |
| `src/services/ai/` | Provider access and generation/refinement behavior | Server only |
| `src/services/ai/prompts/` | Prompt responsibilities and constraints | No credentials or private examples |
| `src/lib/validation/` | Runtime input and model-output validation | Treat both as untrusted |
| `src/lib/env.ts` | Required server environment validation | No browser imports |
| `src/config/ai.ts` | Selected model and bounded generation settings | Server only |
| `src/config/site.ts`, `event-types.ts` | Public metadata and supported occasions | Safe for shared consumption |
| `src/types/` | Provider-independent event, plan, and API types | Types are not runtime checks |
| `tests/` | Synthetic cases and future executable checks | No production secrets |

Prefer Server Components for static composition. Add client boundaries only where interaction requires them. Future implementation should enforce server-only imports around environment and AI modules rather than relying solely on this document.

## Domain design

An event brief contains occasion, guest count, budget, currency, event date, local time zone, approximate location, preferences, and exclusions. Avoid collecting contact information, exact home addresses, or guest identities for the core flow.

A plan contains a theme, budget allocation, timed activities, preparation tasks, vendor-category checklists, assumptions, and warnings. Vendor guidance identifies checks and questions, never invented contacts, confirmed availability, or bookings. Use one selected currency throughout and represent money as integer minor units when contracts are implemented. Validate allocations and totals with the currency's appropriate scale; do not assume every currency has two decimal places.

A revision includes the original brief and full current plan. Preserve constraints unless the user explicitly changes them. Validate any changed budget or date as carefully as the original input.

## Prompt design

- `system.ts`: planner role, safety boundaries, inclusion, estimates, and output requirements.
- `generate-plan.ts`: transform a validated brief into a first proposal.
- `refine-plan.ts`: apply a specific revision while preserving untouched constraints.

Use provider-supported structured responses where appropriate, then validate independently. Keep model-specific transport details in the Gemini client. Schema compliance does not prove that prices, availability, or cultural suggestions are correct.

## Failure behavior

Reject invalid input before provider calls. Distinguish validation failures, quota limits, provider outages, timeouts, malformed output, and internal failures using the API contract. Preserve entered form values on failures.

Avoid indefinite retries, automatic duplicate submissions, and unbounded token budgets. Do not return provider stack traces or credentials. Log only minimal operational metadata with no raw event content by default.

## Scaling path

The initial stateless request/response design can be deployed as one application. Before public use, configure server secrets, bounded request handling, shared abuse controls, and provider spending limits.

Only add durable storage if saved plans are required. Only introduce jobs if response times require asynchronous work. Such additions would also require access control, retention/deletion decisions, failure recovery, and corresponding tests. They are not hidden dependencies of this scaffold.

## Accessibility and privacy

Use native semantics, explicit labels, keyboard access, visible focus, announced status/error messages, and responsive layouts. Do not use color alone to communicate budget warnings.

Tell users when brief data is sent to an AI provider and obtain any required consent before submission. Display estimates and assumptions, support review before action, and avoid promises of bookings or guaranteed costs.
