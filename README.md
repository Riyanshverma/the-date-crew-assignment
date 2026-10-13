# The Date Crew — Matchmaker Dashboard MVP

This documentation pack transfers the assignment, product decisions, schemas, matching logic, design system, implementation sequence, and agent instructions into the project root. `AGENTS.md` is the primary instruction file for Antigravity; `CLAUDE.md` retains compatible project guidance.

## Read order
1. `AGENTS.md` — primary instructions and phase-by-phase approval gates.\n2. `CLAUDE.md` — compatible project instructions.
3. `CONTEXT.md` — assignment and agreed scope.
4. `ARCHITECTURE.md` — schemas, API, matching algorithm and weights.
5. `design.md` — visual tokens and UI requirements.
6. `IMPLEMENTATION_PLAN.md` — milestones and verification.
7. `PROGRESS.md` — current state and next action.

## Stack
- React + Vite + TypeScript
- shadcn/ui + Tailwind CSS
- Node.js + Express + TypeScript
- Server-side JSON files; no database in the MVP

## Current decisions
- 140 fictional profiles: 70 men, 70 women; two matchmaker accounts.
- Profile readiness: `INCOMPLETE` or `ACTIVE`; active means complete and approved for matching, not identity verified.
- Match status belongs to each pairing. Dashboard cards show counts by match status rather than one misleading customer-level status.
- Matching is deterministic, explainable, preference-based, with hard eligibility constraints before scoring.
- Preferred/Broader/Reverse/Two-way labels can coexist.
- Male and female ranking strategies share a pipeline but use distinct weights, documented in `ARCHITECTURE.md`.
- `Send Match` creates a mock proposal for the assigned customer to review; it does not send email or imply consent.
- The fictional JSON dataset has already been generated; integrating and validating it is still pending. Do not regenerate it.\n- AI/LLM and behavioral learning remain deferred until the user approves that phase.

## MVP checklist
- [ ] Login and matchmaker-scoped customer dashboard
- [ ] Customer profile, partner preferences, notes and match history
- [ ] Candidate eligibility and ranking with evidence
- [ ] Match status transitions, follow-up dates and mock proposal
- [x] Generate 140 fictional profiles and two matchmakers (dataset created)\n- [ ] Integrate and validate the existing dataset
- [ ] Responsive UI, deployment, GitHub repository and submission write-up
- [ ] AI feature added in a later approved phase because the assessment requires one

## Research references
- TDC: https://www.thedatecrew.com/
- TDC process: https://www.thedatecrew.com/how-we-work
- Hinge matching: https://hinge.co/how-we-connect-daters
- Shaadi.com matching categories: https://www.shaadi.com/info/customer-relations/faq/match-making

The numerical score is a transparent MVP heuristic, not a scientific compatibility measure or probability of relationship success. TDC's public site describes its service as human-led and “No AI. No App.” The internship assessment nevertheless requires an AI feature; this prototype should not be described as TDC's production algorithm.
