# Progress

## Current stage
Phase 5 (Matching engine) completed on branch `phase-5-matching-engine`.

## Phase 5 Execution Summary
- **Work completed:**
  - Implemented dedicated scoring configuration in `server/src/engine/weights.ts` declaring `MALE_STRATEGY_WEIGHTS` and `FEMALE_STRATEGY_WEIGHTS` under `scoreVersion: "mvp-v1"` (both strategies sum to 100%).
  - Implemented `server/src/engine/eligibility.ts`:
    - Enforces legal marriage age in India (men >= 21, women >= 18).
    - Requires active profile readiness (`ACTIVE`).
    - Excludes non-matching gender, self, and existing pairings (preventing duplicate matches).
    - Applies explicit customer dealbreakers and reciprocal candidate dealbreakers BEFORE scoring (smoking, diet, marital status, children stance, age, height, location, religion).
    - Unknown or unstated data (`PREFERS_NOT_TO_SAY`) is never treated as a mismatch or dealbreaker violation.
  - Implemented `server/src/engine/comparators.ts`:
    - Detailed directional comparisons producing structured `PreferenceEvidence`.
    - Handles Age, Height, Income, and soft Male Directional Signals (younger, lower income, shorter) which respect explicit preferences.
    - Evaluates Location, Marital Status, Religion, Community, Education, Profession, Relationship Goals, Children, Relocation, Core Values overlap, Hobbies overlap, and Lifestyle habits.
    - Formats human-readable, deterministic explanation templates for matchmaker transparency.
  - Implemented `server/src/engine/matching-engine.ts`:
    - Runs two-way comparisons: Customer -> Candidate and Candidate -> Customer.
    - Avoids double-counting: dedicated factor categories are strictly excluded from general preference fit buckets for both strategies.
    - Renormalizes overall score across available weighted categories: `overallScore = sum(w_c * categoryFit(c)) / availableWeight`.
    - Computes `scoreCoverage` based on available weighted categories.
    - Derives match classification labels (`PREFERRED`, `BROADER`, `REVERSE`, `TWO_WAY`).
    - Partitions evidence into `matchedPreferences`, `differences`, and `unknowns`.
    - Sorts deterministically with 2-point margin tie-breaking: prefers `TWO_WAY`, then higher customer preference satisfaction, then stable candidate ID.
  - Added REST endpoint `GET /api/customers/:id/recommendations` in `server/src/routes/api.ts` wired through `customer-repository.ts`.
  - Added matching contracts (`PreferenceEvidence`, `RankedCandidate`, `MatchingRecommendationsResponse`) to `shared/contracts.ts` and `fetchRecommendations` client helper in `client/src/lib/api.ts`.
- **Files changed:**
  - `shared/contracts.ts` (added matching types)
  - `server/src/engine/weights.ts` (created)
  - `server/src/engine/eligibility.ts` (created)
  - `server/src/engine/comparators.ts` (created)
  - `server/src/engine/matching-engine.ts` (created)
  - `server/src/repositories/customer-repository.ts` (wired recommendations)
  - `server/src/routes/api.ts` (added GET /api/customers/:id/recommendations)
  - `client/src/lib/api.ts` (added fetchRecommendations)
  - `PROGRESS.md` (updated)
- **Commands / checks run:**
  - `npm run typecheck` — Passed with 0 errors.
  - `npm run build` — Passed in 1.23s.
  - Manual verification scenarios checked:
    - **Dealbreaker always excludes:** Confirmed candidates with dealbreaker violations are excluded before scoring.
    - **Broader never bypasses dealbreakers:** Confirmed `BROADER` candidates satisfy all dealbreakers and only miss flexible preferences.
    - **One-way and two-way labels:** Verified `PREFERRED`, `REVERSE`, and `TWO_WAY` labels generate and coexist accurately.
    - **Missing data handling:** Confirmed missing fields yield `UNKNOWN`, excluded from numerator/denominator, with score coverage reporting available data.
    - **Male directional signals:** Verified younger/lower-income/shorter soft ranking signals operate without overriding explicit preferences.
    - **Female strategy:** Verified emphasis on career (12%), values (10%), location/relocation (8%), and education (5%).
    - **Duplicate pair prevention:** Existing pairings between customer and candidate excluded from new recommendations.
    - **Deterministic ordering:** Verified deterministic tie-breaking within 2 points.
    - **Live REST API check:** Tested `GET /api/customers/person-001/recommendations` and `GET /api/customers/person-013/recommendations`.
- **Next Phase:** Phase 6 — Candidate UI and match actions.

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
- [x] Customer dashboard/detail (Phase 4).
- [x] Matching engine and candidate result UI (Phase 5 engine complete).
- [ ] Match statuses, notes, follow-ups and mock proposal (Phase 6).
- [x] Generate 140 fictional profiles, two matchmakers, and example pairings (file created).
- [ ] Integrate and validate the existing JSON dataset in the repository (Phase 7).
- [ ] AI feature (Phase 8).
- [ ] Deployment and submission write-up (Phase 9).

## Next action
Wait for explicit approval to begin Phase 6: Candidate UI and match actions per `IMPLEMENTATION_PLAN.md`.
