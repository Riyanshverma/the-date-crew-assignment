# Progress

## Current stage
Phase 6 (Candidate UI and match actions) completed on branch `phase-6-candidate-ui-actions`.

## Phase 6 Execution Summary
- **Work completed:**
  - Implemented rich, accessible candidate recommendation UI and matching actions in `client/src/features/matching/`:
    - `CandidateCard.tsx`:
      - Displays rank badge (`#1`, `#2`), candidate initials avatar, derived age from DOB, city, marital status, designation/profession category, and annual income.
      - Displays compatibility score widget (`0-100%`), score coverage (`%`), customer fit %, and reverse fit %.
      - Renders match classification badges (`TWO_WAY`, `PREFERRED`, `REVERSE`, `BROADER`) using `MatchClassificationBadge`.
      - Shows stage badge if an existing pairing already exists.
      - Structured comparison evidence partitioned into `Matched Criteria`, `Differences`, and `Unknown Fields` with semantic tokens (`positive-soft`, `warning-soft`, `surface-soft`).
      - Displays required helper disclaimer copy: *"Based on structured preference alignment; not a prediction of relationship success."*
      - Provides action buttons: **View Profile**, **Shortlist Candidate**, and **Send Match**.
    - `SendMatchDialog.tsx`:
      - Accessible modal showing candidate overview, age, city, profession, and compatibility score.
      - Includes clear MVP constraint notice: *"Mock Proposal Notice (MVP Constraint): This action records status PROPOSAL_SHARED and stores a mock message for customer review. No real email is dispatched and mutual consent is not inferred."*
      - Text input for custom matchmaker pitch/message.
      - Automatically creates pairing if not yet shortlisted, records `PROPOSAL_SHARED` status, and appends to status history via `POST /api/matches/:id/share-proposal`.
    - `CandidateProfileModal.tsx`:
      - Accessible full candidate dossier modal displaying Personal Details, Education & Career, Family & Cultural Background, Relationship & Family Goals, and Lifestyle & Values without losing recommendation page context.
    - `PairingHistoryView.tsx`:
      - Interactive pairing manager displaying all pairings for customer.
      - Displays pairing partner ID, status badge, compatibility score, follow-up date, and mock proposal details.
      - Inline form for stage status transitions with optional matchmaker note (`PATCH /api/matches/:id/status`).
      - Inline follow-up date picker (`PATCH /api/matches/:id/follow-up`).
      - Inline pairing consultation note form (`POST /api/matches/:id/notes`).
      - Timeline rendering of all pipeline transition events with timestamps and author matchmaker IDs.
    - `MatchingRecommendationsView.tsx`:
      - Orchestrates recommendation fetching (`GET /api/customers/:id/recommendations`), classification filtering (`ALL`, `TWO_WAY`, `PREFERRED`, `REVERSE`, `BROADER`), and minimum compatibility score filtering.
      - Recalculate action and pool overview banner.
      - Wires modal states and handles candidate shortlisting with duplicate prevention.
  - Integrated into `client/src/features/customers/CustomerDetailPage.tsx`:
    - Added `"matches"` tab for Candidate Matches with `Sparkles` icon.
    - Connected header "Find Candidate Matches" button to switch directly to `tab=matches`.
    - Replaced static matches view in `tab=history` with interactive `<PairingHistoryView />`.
  - Added API helpers in `client/src/lib/api.ts`:
    - `createMatch`, `shareMatchProposal`, `updateMatchStatus`, `addMatchNote`, `updateMatchFollowUp`.
  - Added `MatchClassificationBadge` in `client/src/components/common/StatusBadge.tsx`.
- **Files changed:**
  - `client/src/components/common/StatusBadge.tsx` (added `MatchClassificationBadge`)
  - `client/src/lib/api.ts` (added match mutation API helpers)
  - `client/src/features/matching/CandidateCard.tsx` (created)
  - `client/src/features/matching/SendMatchDialog.tsx` (created)
  - `client/src/features/matching/CandidateProfileModal.tsx` (created)
  - `client/src/features/matching/PairingHistoryView.tsx` (created)
  - `client/src/features/matching/MatchingRecommendationsView.tsx` (created)
  - `client/src/features/customers/CustomerDetailPage.tsx` (wired tabs and views)
  - `PROGRESS.md` (updated)
- **Commands / checks run:**
  - `npm run typecheck` — Passed with 0 errors (`tsconfig.client.json` and `tsconfig.server.json`).
  - `npm run build` — Passed cleanly (built in 1.30s).
  - API and Integration Verification:
    - **Candidate Recommendations:** Tested `GET /api/customers/person-001/recommendations` and `GET /api/customers/person-002/recommendations`. Verified rank, scores, classifications, and structured evidence.
    - **Shortlist Candidate:** Tested `POST /api/matches` creating pairing record with status `SHORTLISTED`.
    - **Duplicate Prevention:** Verified `POST /api/matches` returns HTTP 409 Conflict for both A->B and B->A duplicate attempts.
    - **Send Match (Mock Proposal):** Tested `POST /api/matches/:id/share-proposal` updating status to `PROPOSAL_SHARED`, recording message and status history event.
    - **Pairing Notes:** Tested `POST /api/matches/:id/notes` recording pairing note separate from customer note.
    - **Follow-up Date:** Tested `PATCH /api/matches/:id/follow-up` setting follow-up date.
    - **Stage Status Transition:** Tested `PATCH /api/matches/:id/status` transitioning status to `CLIENT_INTERESTED` with transition event.
    - **Real-time Dashboard Refresh:** Verified `GET /api/customers?matchmakerId=mm-001` immediately reflects updated pairing stage counts in customer summary queue.
- **Next Phase:** Phase 7 — Integrate and validate existing fictional demo data.

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
- [x] Matching engine (Phase 5).
- [x] Candidate UI, match actions, mock proposal, and pairing history (Phase 6).
- [x] Generate 140 fictional profiles, two matchmakers, and example pairings (file created).
- [ ] Integrate and validate the existing JSON dataset in the repository (Phase 7).
- [ ] AI feature (Phase 8).
- [ ] Deployment and submission write-up (Phase 9).

## Next action
Wait for explicit approval to begin Phase 7: Integrate and validate existing fictional demo data per `IMPLEMENTATION_PLAN.md`.
