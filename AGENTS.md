# AGENTS.md — Project Instructions

These instructions apply to coding agents working on The Date Crew Matchmaker Dashboard MVP, including Antigravity.

## Operating environment
- Current implementation environment: Antigravity with Gemini 3.8 Flash and Gemini 3.1 Pro.
- Do not assume optional skills/extensions are installed. Ponytail, Superpowers, Context Mode, Code Graph, and RTK are currently unavailable.
- Use direct repository inspection, terminal commands available in the environment, and the project's existing tools. Never claim to have used an unavailable skill or tool.

## Before coding
1. Read `AGENTS.md`, `CLAUDE.md`, `README.md`, `CONTEXT.md`, `ARCHITECTURE.md`, `design.md`, `IMPLEMENTATION_PLAN.md`, and `PROGRESS.md`.
2. Inspect the repository tree, Git status/diff, package manifests, routes/components, TypeScript configuration, scripts, and existing tests.
3. Report the existing state and material discrepancies before making implementation changes.
4. Do not ask the user questions that can be answered from the files or repository. Ask only when a material product decision cannot be resolved from those sources.

## Mandatory phase gate
- Follow `IMPLEMENTATION_PLAN.md` in order.
- Work on exactly one phase per approval cycle.
- At the end of a phase, verify acceptance criteria, run available build/type-check/lint commands, manually inspect important flows, and review the diff.
- Update `PROGRESS.md` with the actual phase outcome, files changed, checks run, failures/blockers, and the next phase.
- Then summarize what changed and what remains, and **stop**. Do not begin the next phase until the user explicitly approves.
- Phase 0 is assessment only: make no code changes and wait for approval.

## No TDD
The user explicitly does not want test-driven development. Do not start with a failing test or add a test framework just to follow a default workflow. Prefer existing checks and focused manual verification. If the repo already has tests, run relevant existing tests as verification after implementation.

## Product and technical constraints
- Prefer the existing repository structure. Do not scaffold over working code or perform unrelated refactors.
- Target stack, unless repository inspection shows a material conflict: React + Vite + TypeScript; shadcn/ui + Tailwind; Node.js + Express + TypeScript; server-side JSON files.
- Use `tdc_matchmaker_dummy_data.json`, which has already been generated. Do not generate another set of dummy profiles.
- Frontend demo login uses hardcoded frontend-only credentials. Do not add `/api/auth/login`, `/api/auth/logout`, or `/api/auth/me`. This gate is not security; use fictional data only and never expose real customer data through this setup.
- `Send Match` is a mock proposal for customer review. Never send real email or infer consent.
- No AI/LLM, external model calls, behavior learning, or semantic matching of free-text profile data until the deterministic MVP is implemented, reviewed, and the user explicitly approves the AI phase.
- Keep matching logic deterministic and separate from Express routes and UI components.
- Preserve schema/status/weight/formula contracts in `ARCHITECTURE.md`.
- Never treat unknown data as a mismatch or score it as zero.
- Eligibility and explicit dealbreakers must be applied before scoring. Broader matching never bypasses a dealbreaker.
- Pairing statuses belong to individual match records, not to the customer globally.
- Keep customer notes separate from match-specific notes; never use notes as scoring inputs.
- Keep the male/female `mvp-v1` weights and avoid double-counting dedicated categories.
- Score is a heuristic ranking indicator, not a probability of relationship success.
- Use fictional data and `example.test` emails; do not invent real contact details.

## Verification and reporting
- Discover actual package scripts before choosing commands.
- Run only checks supported by the repository; report skipped/unavailable checks honestly.
- Inspect the diff for accidental or unrelated changes.
- Update `PROGRESS.md` after each phase. Never claim acceptance criteria passed unless actually verified.
