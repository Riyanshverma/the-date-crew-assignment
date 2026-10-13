# Progress

## Current stage
Phase 1 (Foundation and runtime) completed. Frontend and server runtime baselines are operational and pass TypeScript checks.

## Phase 1 Execution Summary
- **Work completed:**
  - Initialized Git repository and recorded initial baseline commit.
  - Created `server/src/routes/api.ts` implementing Express `apiRouter` and `apiErrorHandler`, resolving the missing module error in `server/src/app.ts`.
  - Renamed `dummy-data.json` to `tdc_matchmaker_dummy_data.json` to match documentation and project configuration.
  - Verified TypeScript compilation for both `tsconfig.client.json` and `tsconfig.server.json`.
  - Verified Express application starts and `GET /api/health` returns `{ "service": "tdc-matchmaker-api", "status": "ok" }`.
  - Verified `npm run build` executes cleanly.
- **Files changed:**
  - `server/src/routes/api.ts` (created)
  - `tdc_matchmaker_dummy_data.json` (renamed from `dummy-data.json`)
  - `PROGRESS.md` (updated)
- **Commands / checks run:**
  - `npm run typecheck` — Passed (exit code 0 for client and server).
  - Health check test via ephemeral server — Passed (HTTP 200, `{ service: 'tdc-matchmaker-api', status: 'ok' }`).
  - `npm run build` — Passed (typecheck + vite build succeeded in 600ms).
- **Failures / blockers:** None.
- **Next Phase:** Phase 2 — Visual shell and frontend demo login.

## Decisions made
- React + Vite + TypeScript, shadcn/ui, Node + Express + TypeScript, JSON data.
- Existing dataset created: `tdc_matchmaker_dummy_data.json` contains 140 fictional profiles (70 men, 70 women), two matchmakers, and 22 example match records. It still needs repository integration and validation against the running implementation.
- Profile readiness: `INCOMPLETE` or `ACTIVE`; active means complete and approved, not identity verified.
- Match statuses are per pairing: `SHORTLISTED`, `PROPOSAL_SHARED`, `CLIENT_INTERESTED`, `AWAITING_OTHER_PERSON`, `BOTH_INTERESTED`, `INTRODUCTION_ARRANGED`, `AWAITING_FEEDBACK`, `IN_PROGRESS`, `DECLINED`, `ON_HOLD`, `CLOSED`.
- Customer dashboard shows derived status counts, not one customer-level match stage.
- Customer-level notes and pairing-specific notes/history are separate.
- Eligibility is a gate; explicit dealbreakers cannot be offset by score.
- Preferred/Broader/Reverse/Two-way labels may coexist.
- Deterministic `mvp-v1` score with separate male/female weights is specified in `ARCHITECTURE.md`.
- Missing values are unknown, not automatic matches/mismatches.
- Match history prevents duplicate/rejected pairings but unrelated history does not affect score.
- Send Match creates a mock proposal for customer review; no real email/consent inference.
- AI/external LLM calls and behavior learning are deferred. Dummy data has already been generated; integration/validation is pending.
- Current environment is Antigravity with Gemini 3.8 Flash and Gemini 3.1 Pro. Ponytail, Superpowers, Context Mode, Code Graph, and RTK are unavailable; do not depend on them. Avoid TDD.

## Scoring v1
### Male-customer
25% general customer preference fit; 15% reverse general fit; 20% relationship/family planning; 8% younger-age alignment; 7% lower-income alignment; 5% shorter-height alignment; 10% values/priorities; 5% career/education; 5% lifestyle/interests.

### Female-customer
25% general customer preference fit; 15% reverse general fit; 20% relationship/family planning; 12% professional/career; 10% values/priorities; 8% location/relocation; 5% lifestyle/interests; 5% education.

Dedicated factors are excluded from general preference-fit buckets to avoid double counting. These are transparent initial heuristics, not scientific measures. Unknown factors are excluded/renormalized with score coverage rather than counted as mismatches.

## Not yet implemented
- [x] Inspect current repo and align docs with existing code (Phase 0).
- [x] Establish foundation and runtime (Phase 1).
- [ ] Frontend shell and design tokens (Phase 2).
- [ ] Express API and JSON repositories (Phase 3).
- [ ] Frontend-only demo login gate (Phase 2 / Phase 3; no backend auth endpoints).
- [ ] Customer dashboard/detail (Phase 4).
- [ ] Matching engine and candidate result UI (Phase 5 / Phase 6).
- [ ] Match statuses, notes, follow-ups and mock proposal (Phase 6).
- [x] Generate 140 fictional profiles, two matchmakers, and example pairings (file created).
- [ ] Integrate and validate the existing JSON dataset in the repository (Phase 7).
- [ ] AI feature (Phase 8).
- [ ] Deployment and submission write-up (Phase 9).

## Next action
Wait for explicit approval to begin Phase 2: Visual shell and frontend demo login per `IMPLEMENTATION_PLAN.md`.
