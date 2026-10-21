# PromptWars Virtual 2026 preparation

## Submission status

The owner identified **PromptWars Virtual 2026**, organized by Hack2Skill in collaboration with Google for Developers, and supplied the [official event page](https://hack2skill.com/event/pwvirtual1) and [submission dashboard](https://hack2skill.com/event/pwvirtual1/dashboard/submissions).

The owner-provided challenge is **Celebration & Event Planner**: build a GenAI application for weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas. The owner reports receiving the announcement on 20 October 2026 from admin@no-reply.hack2skill.com; the email itself was not independently inspected.

On 21 October 2026, the official public page exposed no readable requirements through the browsing tool and the submission dashboard could not be read. Deadlines, judging criteria, permitted build windows, treatment of pre-existing scaffolds, and submission requirements remain unverified. Check the actual dashboard; do not apply rules from another PromptWars edition.

The owner manually published the initial scaffold to [eventloom-ai](https://github.com/mhatreanuj57-alt/eventloom-ai). Owner-provided terminal output showed main and origin/main at 8cf7254 with a clean working tree at that time. Later documentation preparation remains local until the owner chooses to commit it.

There is no hosted demo, working application, executable test suite, or verified submission yet. Do not present the folder structure as a completed GenAI product. Start the next session with [IMPLEMENTATION_BRIEF.md](IMPLEMENTATION_BRIEF.md) for the proposed MVP, screen flow, prompt drafts, twelve evaluation cases, and implementation order.

## Proposed problem and value

People organizing celebrations often have a brief and a budget but no coherent plan. The proposed product covers weddings, birthdays, and community events with personalized ideas, an estimated budget, preparation tasks, an event-day itinerary, and vendor checklists, then supports revisions that preserve constraints.

The demo should show useful constraint handling and transparent assumptions, with culturally respectful and accessible suggestions.

## Planned demo narrative

1. Enter a synthetic celebration brief with an explicit guest count, currency, budget, and exclusions.
2. Generate a complete plan and review its assumptions.
3. Show how the budget total relates to the original constraint.
4. Ask for a lower-cost or accessibility-focused revision.
5. Demonstrate preserved constraints and a recoverable failure state.

Use synthetic names and locations. Never show credentials, personal guest information, or an exposed environment file on screen.

## Evidence to prepare after implementation

- Short problem statement and target users.
- Architecture explanation showing where Gemini is called.
- Actual prompt design and output-validation approach.
- Before/after examples from a generation and refinement.
- A few documented evaluation cases with observed results.
- Recorded runtime, dependency, and Gemini model versions.
- Screenshots and a short demo recording.
- Test results with clear disclosure of mocks and live checks.
- Limitations, privacy notes, and realistic cost/availability caveats.
- Third-party assets, licenses, and any required AI-use disclosures.

The empty `docs/screenshots/` folder is reserved for reviewed demonstration assets; no sample screenshots are included.

## Owner checklist before submission

- Verify current official rules and complete any registration requirements.
- Implement and test the actual application.
- Review all public files and assets for secrets and personal data.
- Establish private security and conduct reporting channels.
- Preserve the completed initial publication history; review and publish later documentation changes manually when ready.
- Confirm repository visibility and license are appropriate for submission.
- Check that any deployed demo is reachable and has bounded API spending.
- Complete required forms and supply accurate repository/demo links.
- Avoid claims about bookings, prices, compliance, or testing that are not supported.

This checklist is project planning guidance, not an organizer-approved submission checklist.
