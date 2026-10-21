# Manual Git and GitHub publication: five sequential batches

These commands record the **five initial publication batches**, which the owner subsequently completed manually. Owner-provided terminal output showed `main` and `origin/main` at `8cf7254` with a clean working tree at that time. Do not rerun initialization or repository creation in the existing repository. Later documentation changes are local follow-up work until the owner commits them.

For a fresh unpublished copy only, the original instructions below run from PowerShell in order, line by line, stopping if a command fails. Each batch has a conventional commit and separate push instructions. The five commits publish structure and documentation only; they do not create working features. All Git operations remain the owner's responsibility.

## Before you start

Install Git and GitHub CLI separately if needed. Use an account that may create a **public** repository. Replace `YOUR_NAME` and `YOUR_EMAIL` with your preferred commit identity before running batch 1. Use a GitHub-provided private commit email if desired.

The commands assume the project remains at `C:\Users\ADMIN\EventLoom-AI`, that it has no project-level `.git` yet, and that the authenticated account has no repository named `eventloom-ai`. If the directory moves, adjust the path. If a local or remote project repository already exists, reconcile its state before using this first-publication guide.

The parent home directory may already have its own repository. Enter this project and initialize it **before** staging files. Verify the reported root is this project, never the parent. No command below stages all files implicitly.

All current source/configuration/test placeholders are empty. Git tracks empty files but does not track empty directories; the included zero-byte `.gitkeep` markers preserve asset and workflow folders. Do not use a repository generator or ask GitHub to add another README, license, or ignore template.

## Batch 1 of 5 — Project identity, governance, and design documentation

### Prepare locally and commit

Sign in only if the status check shows you need to. The login command is interactive.

```powershell
Set-Location -LiteralPath 'C:\Users\ADMIN\EventLoom-AI'
git --version
gh --version
gh auth status
```

If authentication is needed, run this batch-1 setup command and complete its prompts:

```powershell
gh auth login
```

Then initialize and review the project repository. The top-level path must be `C:/Users/ADMIN/EventLoom-AI` or its equivalent Windows path. Replace the two identity placeholders first.

```powershell
git init -b main
git rev-parse --show-toplevel
git config --local user.name "YOUR_NAME"
git config --local user.email "YOUR_EMAIL"
git add -- README.md FILE_TREE.md CONTRIBUTING.md CODE_OF_CONDUCT.md SECURITY.md LICENSE .gitignore docs .github
git diff --cached --stat
git diff --cached
git diff --cached --check
git commit -m "docs: establish EventLoom AI identity and collaboration guidelines"
```

### Create the GitHub repository manually

This command creates a **public repository** under the authenticated account and sets `origin`. It intentionally omits automatic push. Check that publication is appropriate before you run it. If the name is taken, select another name consistently before proceeding.

```powershell
gh repo create eventloom-ai --public --source . --remote origin --description "EventLoom AI: GenAI-powered celebration and event planner scaffold"
git remote -v
```

The command shape follows the official [GitHub CLI repository-creation manual](https://cli.github.com/manual/gh_repo_create). No remote README, ignore template, or license is generated because those files already exist locally.

### Push batch 1 separately

```powershell
git push -u origin main
```

Expected scope: all root governance documents, design/publication docs, screenshot marker, ignore rules, and GitHub collaboration templates/workflow marker. Other placeholders remain untracked for subsequent batches.

## Batch 2 of 5 — Framework, environment, and application configuration placeholders

### Stage, review, and commit

```powershell
git add -- package.json tsconfig.json next-env.d.ts next.config.ts postcss.config.mjs eslint.config.mjs .env.example src/config
git diff --cached --stat
git diff --cached
git diff --cached --check
git commit -m "chore(config): add empty framework and environment placeholders"
```

### Push batch 2 separately

```powershell
git push origin main
```

Expected scope: empty package/compiler/framework/styling/lint settings, environment example, and site/event/AI configuration placeholders. Do not install packages or populate these files during this scaffold-only publication.

## Batch 3 of 5 — Frontend routes, components, hook, and public asset folders

### Stage, review, and commit

The frontend paths are explicit so the API routes remain for batch 4.

```powershell
git add -- src/app/layout.tsx src/app/page.tsx src/app/globals.css src/app/loading.tsx src/app/error.tsx src/app/not-found.tsx src/app/planner
git add -- src/components src/hooks public
git diff --cached --stat
git diff --cached
git diff --cached --check
git commit -m "chore(ui): scaffold empty planner pages and reusable components"
```

### Push batch 3 separately

```powershell
git push origin main
```

Expected scope: empty landing/planner routes, root layout and states, styling placeholder, presentation controls, planning components, request hook, and public asset markers.

## Batch 4 of 5 — API routes, Gemini services, prompts, validation, and shared types

### Stage, review, and commit

```powershell
git add -- src/app/api src/services src/lib src/types
git diff --cached --stat
git diff --cached
git diff --cached --check
git commit -m "chore(ai): scaffold empty Gemini services and planning API routes"
```

### Push batch 4 separately

```powershell
git push origin main
```

Expected scope: empty generation/refinement routes, Gemini client, AI service and prompt modules, environment/error/utility helpers, validation, and domain/API types. The commit does not enable an API or make a provider call.

## Batch 5 of 5 — Test structure, fixtures, and verification documentation

### Stage, review, and commit

```powershell
git add -- tests vitest.config.ts playwright.config.ts
git diff --cached --stat
git diff --cached
git diff --cached --check
git commit -m "chore(test): add empty test structure and verification plan"
```

### Push batch 5 separately and inspect the result

```powershell
git push origin main
git status --short
git log --oneline -5
git ls-files
```

Expected scope: empty test tooling, setup, unit/integration/browser tests, JSON fixtures, and the test-plan README. A clean short status is expected after all five batches if no other edits were made. Review tracked files against FILE_TREE.md.

## Notes for all five batches

- A successful push publishes only what has already been committed. Review each batch before its push.
- If a push fails, resolve authentication or remote state, then retry that same push. Do not make a duplicate commit just to retry.
- Stop and inspect any unexpected remote history; this guide does not use force-push, reset, deletion, or automatic conflict resolution.
- Empty source files are intentional. No build, lint, or runtime test result can be inferred from these commits.
- After publication, manually verify repository visibility and configure private vulnerability reporting and community contacts before inviting reports.
