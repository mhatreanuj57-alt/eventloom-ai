# Five manual GitHub publication batches

No Git command was executed. Use the existing repository; never initialize another repository. These commands cover the pending implementation and completion work. If some files are already committed, Git will stage only their remaining changes; skip an empty commit.

Run one batch at a time in PowerShell. Review staged paths and stop on errors. Do not stage unrelated root documents, .env.local, .audit, node_modules, .next, Supabase .temp/.branches, or test outputs.

## 1. Tooling and deployment configuration

```powershell
Set-Location -LiteralPath 'C:\Users\ADMIN\EventLoom-AI'
git status --short
git diff --cached --name-only
git add -- .gitignore .env.example .better-web-ui.md AGENTS.md package.json package-lock.json tsconfig.json next-env.d.ts next.config.ts postcss.config.mjs eslint.config.mjs vitest.config.ts playwright.config.ts components.json vercel.json
git diff --cached --stat
git diff --cached --check
git commit -m "chore: configure application tooling and Vercel build"
```

Push separately:

```powershell
git push origin main
```

## 2. Secure AI, event APIs and Supabase database

```powershell
git add -- src/config src/types src/lib src/services src/app/api supabase
git diff --cached --stat
git diff --cached --check
git commit -m "feat(api): validate AI plans and secure private event storage"
```

Push separately:

```powershell
git push origin main
```

## 3. Identity and shared responsive interface

```powershell
git add -- src/proxy.ts src/app/auth src/components/auth src/components/ui src/components/layout src/app/layout.tsx src/app/globals.css src/app/error.tsx src/app/loading.tsx src/app/not-found.tsx public
git diff --cached --stat
git diff --cached --check
git commit -m "feat(auth): add Supabase accounts and responsive studio shell"
```

Push separately:

```powershell
git push origin main
```

## 4. Planning, tracking and reports

```powershell
git add -- src/app/page.tsx src/app/planner 'src/app/(studio)' src/components/planner src/hooks
git diff --cached --stat
git diff --cached --check
git commit -m "feat(planner): complete event management and PDF reports"
```

Push separately:

```powershell
git push origin main
```

## 5. Verification and open-source handoff

```powershell
git add -- scripts tests README.md FILE_TREE.md CONTRIBUTING.md SECURITY.md THIRD_PARTY_NOTICES.md docs .github
git diff --cached --stat
git diff --cached --check
git commit -m "test: verify cloud persistence and cross-browser planning flows"
```

Push separately:

```powershell
git push origin main
git status --short
git log --oneline -5
```

Inspect all staged changes for secrets before each commit. Publishing source and deploying are separate owner actions. An already-connected Vercel Git integration can deploy on a push; review that setting first. [Vercel commands and launch checklist](DEPLOYMENT.md) are separate.
