# Submission copy draft

Verify the actual PromptWars Virtual 2026 dashboard fields and rules before using this draft. No submission has been made.

**Project:** EventLoom AI

**Challenge:** Celebration & Event Planner, as supplied by the owner.

**Problem:** People planning celebrations need to turn a personal idea, guest count and budget into a coherent plan without losing the small details.

**Solution:** A responsive planning studio for weddings, birthdays and community events. Gemini proposes themes, budgets, timelines, preparation tasks and vendor questions from the user's preferences and exclusions. Users track actual expenses and progress, revise plans, save private events across devices, and download reports.

**GenAI role:** Server-side Gemini generates schema-constrained JSON and creative revisions. Independent validation rejects incorrect monetary totals, changed budget/currency, duplicate item IDs and overlapping activities. Output remains an estimate requiring human review.

**Architecture:** Next.js/TypeScript/Tailwind with Radix-based shadcn/ui and Lucide. Supabase Auth handles accounts; PostgreSQL RLS restricts event rows to owners and an atomic function limits AI usage. PDF generation runs locally on demand. Guest drafts stay local until deliberately imported.

**Responsible behavior:** No invented confirmed businesses, vendor contacts, bookings or verified prices. No secret is placed in the client or prompt. Failure preserves prior data; sample content is labeled. Costs, feasibility and recommendations remain subject to review.

**Open source:** MIT, with separate notices for adapted components, dependencies, fonts and illustrative photos.

**Repository:** https://github.com/mhatreanuj57-alt/eventloom-ai — publication of the latest work remains an owner action.

**Deployment/demo:** Not published by this implementation. Insert an actual tested URL only after owner deployment.

**Evidence:** Link docs/VERIFICATION.md and actual reviewed screenshots/recording. Clearly disclose mocked tests, live checks, unresolved provider issues and physical-device coverage limits.

Do not add unverified deadlines, judging criteria, awards, organizer endorsement, eligibility claims or submission confirmation.
