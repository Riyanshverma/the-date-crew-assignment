# Progress

## Current stage
Phase 3 (JSON repositories and API) completed on branch `phase-3-json-api`.

## Phase 3 Execution Summary
- **Work completed:**
  - Expanded `shared/contracts.ts` with complete domain interfaces (`PersonProfile`, `PartnerPreferences`, `CustomerRecord`, `MatchRecord`, `CustomerSummary`) and dynamic `calculateAge` helper.
  - Implemented safe atomic file operations in `server/src/repositories/storage.ts` with temp-file-and-rename pattern to prevent data corruption.
  - Implemented `customer-repository.ts` with query filtering, dynamic age derivation, and pairing status count aggregation.
  - Implemented `match-repository.ts` with duplicate pair prevention, match status updates with event history logging, match notes, follow-up dates, and mock proposal actions.
  - Implemented REST API routes in `server/src/routes/api.ts`:
    - `GET /api/customers` (filtered summary list)
    - `GET /api/customers/:id` (full profile & partner preferences)
    - `POST /api/customers/:id/notes` (persisted customer notes)
    - `GET /api/customers/:id/matches` (pairing records for customer)
    - `POST /api/matches` (create pairing with duplicate check)
    - `GET /api/matches/:id` (individual match details)
    - `PATCH /api/matches/:id/status` (status updates with legal transition validation)
    - `POST /api/matches/:id/notes` (persisted pairing notes)
    - `PATCH /api/matches/:id/follow-up` (schedule follow-up date)
    - `POST /api/matches/:id/share-proposal` (mock proposal recording)
  - Initialized `server/data/` (`customers.json`, `matches.json`, `matchmakers.json`) from `tdc_matchmaker_dummy_data.json` (110 customers, 6 matchmakers, 16 matches).
- **Files changed:**
  - `shared/contracts.ts` (expanded schemas and contracts)
  - `server/src/repositories/storage.ts` (created)
  - `server/src/repositories/customer-repository.ts` (created)
  - `server/src/repositories/match-repository.ts` (created)
  - `server/src/routes/api.ts` (implemented API routes)
  - `server/data/` (data directory initialized)
  - `PROGRESS.md` (updated)
- **Commands / checks run:**
  - `npm run typecheck` — Passed (exit code 0 for client and server).
  - API endpoint integration test suite — Passed (all 10 endpoints verified).
  - Status transition validation — Passed (illegal transitions rejected with HTTP 400).
  - `npm run build` — Passed (typecheck + vite build succeeded in 1.32s).
- **Next Phase:** Phase 4 — Dashboard and customer detail.

## Decisions made
- React + Vite + TypeScript, shadcn/ui, Node + Express + TypeScript, JSON data.
- Dataset contains 110 fictional profiles (55 men, 55 women), six matchmakers, and 16 example match records.
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
- AI/external LLM calls and behavior learning are deferred.
- No backend authentication endpoints; credentials checked directly on frontend gate.

## Scoring v1
### Male-customer
25% general customer preference fit; 15% reverse general fit; 20% relationship/family planning; 8% younger-age alignment; 7% lower-income alignment; 5% shorter-height alignment; 10% values/priorities; 5% career/education; 5% lifestyle/interests.

### Female-customer
25% general customer preference fit; 15% reverse general fit; 20% relationship/family planning; 12% professional/career; 10% values/priorities; 8% location/relocation; 5% lifestyle/interests; 5% education.

Dedicated factors are excluded from general preference-fit buckets to avoid double counting. These are transparent initial heuristics, not scientific measures. Unknown factors are excluded/renormalized with score coverage rather than counted as mismatches.

## Not yet implemented
- [x] Inspect current repo and align docs with existing code (Phase 0).
- [x] Establish foundation and runtime (Phase 1).
- [x] Frontend shell and design tokens (Phase 2).
- [x] Express API and JSON repositories (Phase 3).
- [x] Frontend-only demo login gate (Phase 2; no backend auth endpoints).
- [ ] Customer dashboard/detail (Phase 4).
- [ ] Matching engine and candidate result UI (Phase 5 / Phase 6).
- [ ] Match statuses, notes, follow-ups and mock proposal (Phase 6).
- [x] Generate 140 fictional profiles, two matchmakers, and example pairings (file created).
- [ ] Integrate and validate the existing JSON dataset in the repository (Phase 7).
- [ ] AI feature (Phase 8).
- [ ] Deployment and submission write-up (Phase 9).

## Next action
Wait for explicit approval to begin Phase 2: Visual shell and frontend demo login per `IMPLEMENTATION_PLAN.md`.
