# Progress

## Current stage
Phase 9 (Polish, dual-cloud deployment, and submission documentation) completed on branch `master` (Phase 8 AI held per instruction).

## Phase 9 Deployment & Verification Summary
- **Work completed:**
  - Deployed Backend API to Render Free Tier: `https://the-date-crew-assignment-521e.onrender.com`.
  - Deployed Frontend SPA to Vercel: `https://the-date-crew-assignment-livid.vercel.app/`.
  - Configured CORS middleware in `server/src/app.ts` reflecting Vercel origins with credentials support.
  - Configured `VITE_API_BASE_URL` in `client/src/lib/api.ts` and `client/src/vite-env.d.ts` for clean environment-based switching between local proxy and live backend.
  - Created `vercel.json` with SPA routing rewrites preventing 404s on deep links.
  - Enhanced accessibility: ARIA modal attributes, `Escape` key event listeners, explicit input label bindings, and live error announcements.
  - Enhanced mobile responsiveness: Adaptive mobile drawer menu with touch backdrop in `AppShell.tsx`.
  - Verified empty, error, and loading states across Dashboard, Customers, Details, and Matching views.
  - Verified live cross-cloud communication: Vercel frontend dispatches and renders operational queues and recommendations directly from Render backend.
  - Updated `README.md` with live URLs, demo credentials, architectural summary, and matching documentation.
- **Commands / checks run:**
  - Live Render Health: `GET https://the-date-crew-assignment-521e.onrender.com/api/health` returned 200 OK.
  - Live CORS Preflight: `OPTIONS /api/matches` returned 204 No Content with `access-control-allow-origin: *` and credentials.
  - Live Vercel Bundle: Verified `VITE_API_BASE_URL` baked into production bundle.
  - `npm run typecheck` — Passed with 0 errors.
  - `npm run build` — Passed cleanly in 1.29s.
- **Next Phase:** Phase 8 AI feature (when user is ready) or final submission submission email dispatch.

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
- AI/external LLM calls held per user instruction.
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
- [x] Generate fictional profiles, matchmakers, and example pairings (file created).
- [x] Integrate and validate the existing JSON dataset in the repository (Phase 7).
- [x] Deployment, responsiveness, accessibility, and documentation (Phase 9).
- [x] AI Semantic Relevance Assistant & Top-K Re-ranking (Phase 8).

## Phase 8 AI Semantic Relevance Assistant Summary
- **Work completed:**
  - Implemented Option B Top-K Re-ranking in `server/src/engine/semantic-assistant.ts`.
  - Integrated OpenRouter SDK (`@openrouter/sdk`) and native HTTP fallback targeting `nvidia/nemotron-3.5-lightning:free`.
  - Non-streaming, zero-reasoning, low temperature (0.1) execution for fast, deterministic semantic scoring.
  - Strict Data Minimization: Sends only anonymized comparison parameters (Education, Career, Core Values, Hobbies); zero PII, names, ages, or genders are transmitted.
  - Re-ranks the Top 5 candidates, upgrading soft criteria synergy and recomputing compatibility scores with full transparency.
  - Added frontend AI Semantic Insight cards (`CandidateCard.tsx`) with dynamic badge, model badge, elevated criteria tags, and natural language summary.
  - Resilient graceful fallback: If `OPENROUTER_API_KEY` is unset or fails, system seamlessly operates on deterministic matching without errors.
- **Commands / checks run:**
  - `npm run typecheck` — Passed with 0 errors.
  - `npm run build` — Built production client and server bundles cleanly.

## Next action
User to supply OpenRouter API key in `.env` to test live LLM semantic re-ranking, or finalize assignment submission write-up.

