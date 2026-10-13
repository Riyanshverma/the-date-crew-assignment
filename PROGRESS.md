# Progress

## Current stage
Phase 4 (Dashboard and customer detail) completed on branch `phase-4-dashboard-customer-detail`.

## Phase 4 Execution Summary
- **Work completed:**
  - Implemented centralized frontend API client `client/src/lib/api.ts` connecting the UI to Express endpoints (`GET /api/customers`, `GET /api/customers/:id`, `POST /api/customers/:id/notes`, `GET /api/customers/:id/matches`).
  - Created formatting utilities in `client/src/lib/formatters.ts` for clean enum rendering, Indian numbering format for annual income, and localized dates. Unknown and missing values consistently render as `"Not specified"` rather than becoming zero, false, or hidden.
  - Refactored `DashboardPage.tsx` from static placeholders to live operational queue:
    - Metrics derived from live client data (Assigned clients, Active ready, Incomplete profiles, Active pairings in pipeline).
    - Client queue list displaying derived age, city, marital status, profile readiness badge, and individual pairing status badges.
    - Multiple match statuses can coexist for a single client (e.g., `person-076` coexists with `ON_HOLD` and `DECLINED`).
    - Search by client name, city, and profession, plus readiness filtering.
  - Refactored `CustomersPage.tsx` with live customer directory:
    - Directory grid with profile readiness badges, contact basics, profession, and pairing activity badges.
    - Scope toggle between "All Directory" (110 clients) and "Assigned to Me" (current matchmaker).
    - Gender filter ("All", "Men", "Women"), readiness filter ("All", "Active", "Incomplete"), and keyword search.
  - Built comprehensive `CustomerDetailPage.tsx` (`/customers/:id`) with 4 distinct tabs:
    - **Personal & Biodata Tab:** Personal details, height, contact, education, career, family structure, religion/community, relationship timeline, lifestyle habits, declared core values, and hobbies.
    - **Partner Preferences Tab:** Target age, height, and income ranges with client importance levels, preferred locations, preferred marital statuses, desired partner core values, and explicit dealbreakers.
    - **Pairing History Tab:** Candidate pairing cards showing candidate ID, compatibility score, current pairing status, next follow-up dates, mock proposal status, and full pipeline event history.
    - **Consultation Notes Tab:** Displays matchmaker consultation notes with author and timestamp, plus an active form to submit and immediately persist new consultation notes via `POST /api/customers/:id/notes`.
  - Wired `/customers/:id` route into `client/src/App.tsx`.
- **Files changed:**
  - `client/src/lib/api.ts` (created)
  - `client/src/lib/formatters.ts` (created)
  - `client/src/features/dashboard/DashboardPage.tsx` (updated)
  - `client/src/features/customers/CustomersPage.tsx` (updated)
  - `client/src/features/customers/CustomerDetailPage.tsx` (created)
  - `client/src/App.tsx` (updated with detail route)
  - `PROGRESS.md` (updated)
- **Commands / checks run:**
  - `npm run typecheck` — Passed with exit code 0 (both client and server TypeScript compile cleanly).
  - `npm run build` — Passed in 1.25s (Vite production bundle built cleanly).
  - Live API integration verification:
    - `GET /api/customers?matchmakerId=mm-001` (retrieves assigned queue with age derived from DOB).
    - `GET /api/customers/person-001` (retrieves full biodata dossier and partner preferences).
    - `POST /api/customers/person-001/notes` (persists new consultation note safely into JSON).
    - `GET /api/customers/person-006/matches` (retrieves candidate pairings and pipeline history).
    - Multiple match statuses verified coexisting on individual customers (`person-076`, `person-090`, `person-097`, `person-118`, `person-125`, `person-139`).
    - Profile readiness (`ACTIVE` vs `INCOMPLETE`) verified separate from pairing status.
- **Next Phase:** Phase 5 — Matching engine.

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
- [ ] Matching engine and candidate result UI (Phase 5 / Phase 6).
- [ ] Match statuses, notes, follow-ups and mock proposal (Phase 6).
- [x] Generate 140 fictional profiles, two matchmakers, and example pairings (file created).
- [ ] Integrate and validate the existing JSON dataset in the repository (Phase 7).
- [ ] AI feature (Phase 8).
- [ ] Deployment and submission write-up (Phase 9).

## Next action
Wait for explicit approval to begin Phase 5: Matching engine per `IMPLEMENTATION_PLAN.md`.
