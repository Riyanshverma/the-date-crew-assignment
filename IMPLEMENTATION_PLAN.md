# Implementation Plan

## Execution rules
- Inspect the existing repository before editing. Do not replace existing architecture blindly.
- The user explicitly requests **no test-driven development (TDD)**. Do not start with failing tests or introduce a test framework just to follow a default workflow.
- Work in the existing Antigravity environment. The available models are Gemini 3.8 Flash and Gemini 3.1 Pro.
- Do not assume optional skills/extensions are installed. Ponytail, Superpowers, Context Mode, Code Graph, and RTK are not currently available; proceed using repository files, built-in editor/terminal capabilities, and direct source inspection.
- **Implement only one phase at a time.** At the end of each phase: run relevant checks, manually verify acceptance criteria, inspect the diff, update `PROGRESS.md`, summarize the outcome and any blockers, then stop and wait for the user's explicit approval before starting the next phase.
- Do not generate a new dataset. Use the already-created `tdc_matchmaker_dummy_data.json`; inspect and validate it before integration.
- AI/LLM work remains deferred until the deterministic MVP is implemented and reviewed. No external LLM calls or profile-data processing without explicit approval.
- Frontend demo login is hardcoded in the frontend only. Do not add `/api/auth/login`, `/api/auth/logout`, or `/api/auth/me`. It is not security; use fictional data only.
- `Send Match` is mock-only and must not send an actual email or imply consent.

## Phase 0 — Repository understanding (assessment only)
1. Read `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`, `ARCHITECTURE.md`, `design.md`, this file, `PROGRESS.md`, and `README.md`.
2. Inspect repository tree, package manifests, routes/components, TypeScript configs, scripts, existing tests, and Git status/diff.
3. Identify existing code, incomplete work, dependencies, build/type-check/lint commands, and conflicts between code and docs.
4. Report the repository state, material conflicts, proposed first implementation milestone, and its acceptance criteria.
5. Make no code changes in this phase.
**Acceptance criteria:** a concise, source-grounded repo assessment; no code changes; clear proposal for Phase 1.
**Stop gate:** report findings and wait for approval before Phase 1.

## Phase 1 — Foundation and runtime
- Align with the existing repository rather than scaffolding blindly.
- Confirm or implement the React + Vite + TypeScript frontend and Express + TypeScript API arrangement, shared types/configuration, and health endpoint as needed.
- Ensure existing scripts work and document actual commands.
**Acceptance criteria:** frontend and API start using the repository's documented commands; health endpoint works if the API is present; existing type-check/build/lint commands pass where configured.
**Stop gate:** update `PROGRESS.md`, summarize changes/checks, and wait for approval.

## Phase 2 — Visual shell and frontend demo login
- Apply `design.md` tokens and existing shadcn/ui/Tailwind conventions.
- Build or align shell/navigation, frontend-only demo login, dashboard shell, status chips, dialogs, and loading/empty/error states.
- Keep credentials in a clearly named frontend-only constant; do not send them to the API.
**Acceptance criteria:** login gate works for the configured demo credentials; invalid credentials show a useful error; no auth endpoints are added; responsive layout and visible keyboard focus; no fake controls.
**Stop gate:** update `PROGRESS.md`, summarize changes/checks, and wait for approval.

## Phase 3 — JSON repositories and API
- Integrate validated JSON reads/writes for matchmakers, customers, and matches.
- Use server-side validation for input shape, route IDs, status transitions, and pair consistency.
- Implement customer list/detail, notes, match records, status transitions, follow-ups, recommendations route, and mock proposal route as needed by existing code.
- Filter assigned demo customers in the UI/data layer, but do not describe this as security or server-side authentication.
**Acceptance criteria:** APIs return schema-consistent data; valid mutations persist locally; invalid status transitions and malformed requests are rejected; no `/api/auth/login`, `/api/auth/logout`, or `/api/auth/me` routes; no real email is sent.
**Stop gate:** update `PROGRESS.md`, summarize changes/checks, and wait for approval.

## Phase 4 — Dashboard and customer detail
- Dashboard cards show name, age derived from DOB, city, marital status, profile readiness, and match counts derived from individual pairing records.
- Customer detail separates profile, preferences, customer notes, and pairing history.
- Unknown values remain visibly unknown rather than becoming zero or false.
**Acceptance criteria:** multiple match statuses can coexist for one customer; counts match the data; age is derived; profile readiness remains separate from match status.
**Stop gate:** update `PROGRESS.md`, summarize changes/checks, and wait for approval.

## Phase 5 — Matching engine
- Implement candidate pool and exclusions.
- Apply legal-age/basic eligibility and explicit dealbreakers before scoring.
- Compare preferences in both directions.
- Derive `PREFERRED`, `BROADER`, `REVERSE`, and `TWO_WAY` classifications.
- Implement the `mvp-v1` male/female weights and exact formulas from `ARCHITECTURE.md`.
- Return structured evidence, differences, unknowns, score coverage, and deterministic ordering.
**Manual verification scenarios:** dealbreaker always excludes; broader never bypasses dealbreakers; one-way and two-way labels work; missing data is not a mismatch; male directional age/income/height signals are soft and respect explicit preferences; female strategy emphasizes career/values/relocation; unrelated history does not affect score; duplicate pairs are excluded; ties are deterministic.
**Acceptance criteria:** all scenarios are manually checked and recorded; score calculation avoids double counting and reports coverage.
**Stop gate:** update `PROGRESS.md`, summarize checks and outcomes, and wait for approval.

## Phase 6 — Candidate UI and match actions
- Show rank, profile basics, score, score coverage, classifications, and structured comparison evidence.
- Add View Profile, Shortlist, and Send Match actions.
- Send Match opens a mock proposal for the assigned customer to review and records the relevant status/history; it never sends real email.
**Acceptance criteria:** actions persist; dashboard counts refresh; duplicate pairings are prevented; proposal includes candidate basics and is clearly mock-only.
**Stop gate:** update `PROGRESS.md`, summarize changes/checks, and wait for approval.

## Phase 7 — Integrate and validate existing fictional demo data
The dataset has already been generated at `tdc_matchmaker_dummy_data.json`. Do not generate another dataset.
- Locate the file in the repository/workspace; if it is not present, ask the user to copy it into the project rather than silently creating a replacement.
- Validate JSON syntax, IDs, references, enums, profile statuses, catalogue values, and match statuses against `ARCHITECTURE.md`.
- Check active-profile readiness against the agreed meaning of `ACTIVE`. Report and correct any invalid seed records only if necessary, preserving the dataset's intended test coverage.
- Place the validated file(s) into the repository's expected `server/data/` layout and split into `matchmakers.json`, `customers.json`, and `matches.json` only if the implementation expects separate files. Preserve a copy of the original seed JSON if useful.
- Ensure both genders have sufficient opposite-gender active candidates for matching tests; report any discrepancy instead of claiming it passes.
**Acceptance criteria:** the application loads the existing dataset; all schema/reference checks pass; the match engine can retrieve opposite-gender candidates; no new profile generation occurs.
**Stop gate:** update `PROGRESS.md`, summarize validation/integration, and wait for approval.

## Phase 8 — AI feature (deferred; requires separate approval)
The assessment requires an AI feature. After the deterministic MVP is implemented and reviewed:
- Propose the smallest useful feature.
- Explain data minimization, privacy, consent, and provider handling.
- Wait for explicit approval before implementing any LLM or external model calls.
**Acceptance criteria:** no AI implementation or external LLM call occurs before approval.

## Phase 9 — Polish and submission
- Check accessibility, responsive behavior, empty/error states, and critical manual flows.
- Run existing build/type-check/lint commands and inspect the final diff.
- Verify hosting persistence before deployment; local JSON writes may not persist on serverless filesystems.
- Document demo credentials, live URL, repository URL, and the required 2–3 paragraph write-up.
- Prepare the assignment submission email, but do not send it unless the user asks.
**Acceptance criteria:** app builds/runs; deployment persistence is understood; submission checklist is complete.

## Definition of done
Assignment features are implemented; eligibility is separate from score; explanations reflect actual comparisons; frontend login is accurately described as demo-only; statuses and counts derive from match records; Send Match is non-contacting; dataset is validated and integrated; the app builds/runs; and deployment/submission requirements are documented.
