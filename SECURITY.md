# Security Policy

## Current status and supported scope

EventLoom AI currently contains documentation and empty placeholders only. There is no running application, configured Gemini integration, published release, or executable security control. No version is claimed to receive security updates yet.

This policy covers future project-owned application code, API routes, configuration, prompts, and documentation. Vulnerabilities in Google, GitHub, Next.js, or other third-party services should also be reported through their own disclosure channels.

## Report a vulnerability privately

Do not open a public issue containing exploit instructions, secrets, personal data, or private event details.

After the owner creates a GitHub repository, use **Security → Advisories → Report a vulnerability** if private vulnerability reporting is enabled. It is not enabled by this scaffold. The owner must enable it or publish a verified private security contact before a public application launch.

If neither private route is available, ask the owner to establish one without sharing sensitive details publicly. There is currently no verified project security email address.

Useful report details include:

- The affected version, file, route, or documentation section.
- The expected security boundary and how it can be crossed.
- Minimal reproduction steps using synthetic data.
- The impact and any prerequisites.
- Suggested mitigation, if known.
- A safe reply channel and disclosure preferences.

Remove real credentials and personal information from evidence. Avoid accessing other people's data, disrupting services, or making unnecessary paid API requests.

## Response and disclosure

Maintainers should acknowledge a private report, assess impact, agree on a disclosure plan, and provide a fix or mitigation when possible. There is no staffed response team or guaranteed service level at this stage.

A future advisory should identify affected releases, available mitigations, and fixed versions. Credit reporters only with their permission. No bounty or legal safe-harbor commitment is offered by this policy.

## Secret handling requirements for implementation

- Keep `GEMINI_API_KEY` on the server; never expose it through `NEXT_PUBLIC_`, client imports, source maps, logs, or error responses.
- Store local credentials only in ignored local environment files. Keep `.env.example` free of real values.
- Restrict provider credentials and access according to the provider's supported controls.
- If a key is exposed, revoke or rotate it promptly, inspect usage, and remove it from all affected surfaces, including repository history where necessary. Deleting the current file alone does not revoke the key.
- Use synthetic events in fixtures, demonstrations, issues, and screenshots.

The included `.gitignore` reduces accidental staging of common local files. It cannot detect a secret pasted into an otherwise tracked file and is not a substitute for review.

## Application controls to implement

Validate input types, lengths, dates, guest counts, budgets, currency, and revision payloads before calling Gemini. Validate model responses independently before returning them. Bound request sizes, token usage, timeouts, retries, and per-user or per-client quotas.

Treat prompts and model output as untrusted data. Keep user instructions separate from system policy; do not execute generated code, render unchecked HTML, follow arbitrary generated URLs on the server, or give the model tool access by default.

Review origin handling and abuse protection for public routes. A multi-instance release needs shared rate limits and spending controls. Client-only limits and a process-local counter are insufficient as public abuse defenses.

Do not log full event briefs or provider responses by default. Explain what data is sent to Google and review applicable provider data terms before launch. If persistence is later added, define retention, authorization, deletion, backups, and recovery before storing user information.

None of these controls is implemented in the current scaffold.
