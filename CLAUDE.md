# CLAUDE.md — Project Instructions

This file keeps project-specific instructions available to Claude Code and compatible coding agents. `AGENTS.md` is the primary instruction file for Antigravity and other agents that support it.

## Working style
- Inspect the repository before editing; do not assume it is blank or replace existing architecture blindly.
- Bias toward caution over speed. Surface assumptions and material conflicts instead of silently choosing.
- Prefer minimal, focused changes. Avoid speculative features, unnecessary dependencies, and unrelated refactors.
- Follow `IMPLEMENTATION_PLAN.md` phase by phase. Complete only one phase per approval cycle, update `PROGRESS.md`, report checks and blockers, then stop and wait for explicit approval before continuing.
- Phase 0 is assessment only; make no code changes before reporting repository state and receiving approval.
- The user explicitly requests **no TDD**. Do not start with a failing test. Use existing checks and focused manual verification after implementation.

## Source of truth
When information conflicts, follow:
1. Explicit user instructions.
2. Original assessment requirements summarized in `CONTEXT.md`.
3. `ARCHITECTURE.md` for data/schema/API/matching contracts.
4. `design.md` for UI guidance.
5. `IMPLEMENTATION_PLAN.md` and `PROGRESS.md`.
6. Existing code conventions unless they conflict with the above.

Report material conflicts instead of silently resolving them.

## Product invariants
- Target React + Vite + TypeScript, shadcn/ui + Tailwind, Node + Express + TypeScript, and JSON persistence unless repository inspection reveals a material conflict.
- Login is a hardcoded frontend-only demo gate. Do not implement backend login/logout/current-user endpoints. This is not security; use fictional data only.
- Use the existing `tdc_matchmaker_dummy_data.json`; do not generate replacement dummy profiles.
- Profile readiness is `INCOMPLETE`/`ACTIVE`; `ACTIVE` means complete and approved for matching, not identity verified.
- Match status belongs to a pairing; dashboard counts derive from match records.
- Eligibility filtering happens before scoring; explicit dealbreakers cannot be offset by a high score.
- Unknown data is not a match or mismatch by default.
- `PREFERRED`, `BROADER`, `REVERSE`, and `TWO_WAY` labels can coexist; broader matching never bypasses a dealbreaker.
- Use `mvp-v1` weights and formulas from `ARCHITECTURE.md`, avoid double counting, and report score coverage.
- Score is a heuristic, not a probability of relationship success.
- Unrelated match history must not alter candidate score.
- `Send Match` is mock-only. Do not send email or infer consent.
- Keep customer notes separate from match-specific notes; notes are never score inputs.
- No external LLM processing of profile data until the deterministic MVP is reviewed and the user explicitly approves the AI phase.

## Tools and skills
Do not assume optional skills or extensions exist. Use only tools actually available in the current environment and verify important findings against source files.

## Phase completion checklist
1. Check phase acceptance criteria.
2. Run repository-supported build/type-check/lint commands.
3. Manually verify relevant flows.
4. Inspect the diff.
5. Update `PROGRESS.md` with actual results and the next phase.
6. Report changes, checks, failures, and blockers.
7. Stop and wait for explicit user approval.
