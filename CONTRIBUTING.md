# Contributing to EventLoom AI

Thank you for helping make event planning more practical, inclusive, and accessible. Participation is governed by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Current scope

This is a documentation-first, scaffold-only project. All source, runtime configuration, and test placeholders must remain completely empty until the project owner explicitly opens an implementation phase. Documentation improvements, architecture feedback, and issue triage fit the current phase.

Do not silently add starter components, package contents, generated declarations, sample JSON, dependencies, or executable workflows. An empty placeholder is intentional, not an incomplete contribution that needs filling.

## Find a useful contribution

Read the [README](README.md), [file tree](FILE_TREE.md), [architecture](docs/ARCHITECTURE.md), and [development roadmap](docs/DEVELOPMENT.md). Review existing issues once a repository exists.

Use the feature-request template for a proposed change. Describe the user problem, expected outcome, affected paths, and a small acceptance checklist. Discuss changes to the stack, data contracts, or privacy boundaries before implementation. Report security concerns privately using [SECURITY.md](SECURITY.md).

Maintainers may later label issues as documentation, accessibility, AI, testing, bug, or good first issue. These labels have not been created.

## Working process

1. Agree on one narrowly scoped issue and clarify whether it is documentation work or authorized implementation.
2. Create a branch in your own local clone or fork using your normal Git workflow.
3. Inspect the affected callers, contracts, documentation, and test locations before editing.
4. Make the smallest complete change and update relevant docs.
5. Check for credentials, private event information, generated files, and unrelated edits.
6. Open a pull request using the supplied template and link the issue.
7. Respond to review and keep the description aligned with the final change.

The initial owner publication commands are grouped in [five manual batches](docs/GIT_BATCHES.md). No Git actions are performed by this scaffold. The guide is for initial publication; do not reinitialize an existing contributor clone.

## Naming and organization

- Use descriptive kebab-case file names, PascalCase React component names, and descriptive TypeScript identifiers when coding is authorized.
- Keep pages and route handlers in `src/app/`, reusable UI in `src/components/`, and Gemini code in `src/services/ai/`.
- Keep server secrets and model settings out of browser imports.
- Use shared domain types and runtime validators at external boundaries.
- Avoid barrel files, duplicate wrappers, speculative services, or new dependencies without a concrete need.
- Preserve accessibility, validation, and error handling during refactors.

## Commit conventions

Use conventional messages: `docs:` for documentation, `chore:` for scaffold/tooling work, `feat:` for a working feature, `fix:` for a behavior correction, and `test:` for test changes. Add a scope when useful, such as `docs(ai): clarify refinement constraints`.

Do not describe empty placeholders as working features or passing tests. The publication guide uses `chore:` for empty source and test structure.

## Validation expectations

For the current phase, confirm every source, fixture, environment template, and runtime configuration placeholder is zero bytes. Verify relative documentation links, file-tree accuracy, and the absence of a project-level `.git` directory until the owner performs manual initialization. No build or runtime check can pass against empty configuration.

During implementation, run the checks relevant to the change, covering failure paths and accessibility as well as the happy path. Unit/integration checks should mock Gemini. Any live API check must be opt-in, use synthetic data and a private server credential, and disclose quota/cost implications.

Record exactly what was checked in the pull request. Do not report a check as passing if it was skipped or could not run.

## Review checklist

- The change addresses one agreed problem and includes all affected contracts and callers.
- Documentation and API descriptions match actual behavior.
- Credentials and personal information are absent.
- Validation and errors are handled at trust boundaries.
- AI suggestions are clearly distinguished from verified facts and prices.
- Keyboard and screen-reader behavior is considered for UI changes.
- Required checks are recorded with limitations.

## Licensing and maintainers

By contributing, you agree that your contribution may be distributed under the project's [MIT License](LICENSE), and confirm that you have permission to contribute it. Keep third-party copyright notices and disclose the source and license of contributed assets or substantial borrowed material.

The repository owner is responsible for assigning reviewers, publishing reporting contacts, and making final scope decisions. No specific response time or release schedule is promised at this stage.
