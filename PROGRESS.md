# Progress

## Current stage
Phase 8 (AI Semantic Assistant & Introduction Pitch Generator) and Phase 9 (Polish, Dual-Cloud Deployment, Accessibility) completed on branch `master`.

---

## Phase 8 AI Semantic Assistant & Introduction Pitch Summary
- **Work completed:**
  - **Instant Initial Recommendations (<25ms):** Decoupled heavy LLM analysis from initial matching queue computation. Match recommendations load instantly with deterministic scoring so matchmakers experience zero blocking spinners.
  - **On-Demand Single Candidate AI Analysis (`POST /api/customers/:id/candidates/:candidateId/ai-analyze`):**
    - Added matchmaker-invoked `✨ AI Semantic Analysis` button on individual candidate cards.
    - Evaluates nuanced synergy across education, career, core values, and lifestyle using `nvidia/nemotron-3.5-lightning:free` via OpenRouter SDK with native HTTP fallback.
    - Re-scores and re-ranks the candidate dynamically, displaying elevated criteria badges, model tag (`nvidia/nemotron-3.5-lightning:free`), boosted compatibility percentage, and a natural language semantic summary.
  - **AI Introduction Pitch / Matchmaker Review Note Generator (`POST /api/customers/:id/candidates/:candidateId/ai-pitch`):**
    - Added matchmaker-invoked `✨ Draft AI Intro Pitch` button inside the Send Match Proposal dialog (`SendMatchDialog.tsx`).
    - Bridges client's desired partner preferences (relationship goals, valued qualities, preferred professions, hobbies) with candidate's actual profile (profession, education, city, hobbies, values, compatibility fit).
    - Prompts `nvidia/nemotron-3.5-lightning:free` to draft an empathetic, warm, 2-to-3 sentence introduction pitch/review note addressing the client directly in a sophisticated boutique matchmaker tone.
    - Fills the editable proposal note textarea so the matchmaker retains full human-in-the-loop control to review or refine before confirming.
    - Robust fallback: If `OPENROUTER_API_KEY` is not configured or fails, dynamically generates a personalized, warm template pitch without crashing.
  - **Heuristic & Scoring Enhancements:**
    - Re-calibrated baseline weights to **30% Forward Client Fit** and **10% Reverse Fit** (from 25%/15%) so valid candidate profiles with partial reverse preferences are not unduly suppressed.
    - Enhanced currency comparison display: Rendered clear range format (e.g., `₹5 L – ₹9 L/yr` instead of misleading `Min ₹5 L/yr`).
    - Cleaned strict comparator boundaries, delegating semantic proximity in career/education to the LLM assistant.
- **Commands / checks run:**
  - `npm run typecheck` — Passed with 0 errors.
  - `npm run build` — Passed cleanly (client bundle 409 kB gzip 116 kB; server build clean).

---

## Phase 9 Deployment & Verification Summary
- **Work completed:**
  - Deployed Backend API to Render Free Tier: `https://the-date-crew-assignment-521e.onrender.com`.
  - Deployed Frontend SPA to Vercel: `https://the-date-crew-assignment-livid.vercel.app/`.
  - Configured CORS middleware in `server/src/app.ts` supporting Vercel origins with credentials support.
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
  - `npm run build` — Passed cleanly.

---

## Decisions made
- React + Vite + TypeScript, shadcn/ui, Node + Express + TypeScript, JSON data.
- Dataset contains 110 fictional profiles (55 men, 55 women), six matchmakers, and 16 example match records.
- Profile readiness: `INCOMPLETE` or `ACTIVE`; active means complete and approved, not identity verified.
- Match statuses are per pairing: `SHORTLISTED`, `PROPOSAL_SHARED`, `CLIENT_INTERESTED`, `AWAITING_OTHER_PERSON`, `BOTH_INTERESTED`, `INTRODUCTION_ARRANGED`, `AWAITING_FEEDBACK`, `IN_PROGRESS`, `DECLINED`, `ON_HOLD`, `CLOSED`.
- Customer dashboard shows derived status counts, not one customer-level match stage.
- Customer-level notes and pairing-specific notes/history are separate.
- Eligibility is a gate; explicit dealbreakers cannot be offset by score.
- Preferred/Broader/Reverse/Two-way labels may coexist.
- Heuristic scoring uses transparent forward/reverse weighting with separate male/female weights specified in `ARCHITECTURE.md`.
- Missing values are treated as unknown, not automatic matches/mismatches.
- Match history prevents duplicate/rejected pairings but unrelated history does not affect score.
- Send Match creates a mock proposal for customer review; no real email/consent inference.
- AI features are matchmaker-invoked tools (on-demand semantic analysis & pitch drafting) that maintain human-in-the-loop oversight.
- No backend authentication endpoints; credentials checked directly on frontend gate.

---

## Scoring v1 (Heuristic Baseline)
### Male-customer
30% general customer preference fit; 10% reverse general fit; 20% relationship/family planning; 8% younger-age alignment; 7% lower-income alignment; 5% shorter-height alignment; 10% values/priorities; 5% career/education; 5% lifestyle/interests.

### Female-customer
30% general customer preference fit; 10% reverse general fit; 20% relationship/family planning; 12% professional/career; 10% values/priorities; 8% location/relocation; 5% lifestyle/interests; 5% education.

Dedicated factors are excluded from general preference-fit buckets to avoid double counting. Unknown factors are excluded/renormalized with score coverage rather than counted as mismatches.

---

## Implementation Checklist
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
- [x] AI Semantic Relevance Assistant (On-Demand Candidate Analysis) (Phase 8).
- [x] AI Introduction Pitch / Matchmaker Review Note Generator (Phase 8).

