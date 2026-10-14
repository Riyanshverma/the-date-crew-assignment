# The Date Crew — Matchmaker Dashboard MVP

An internal, human-first matchmaking operations dashboard built for **The Date Crew (TDC)** to manage client dossiers, evaluate structured candidate compatibility, and facilitate curated introductions.

## 🚀 Live Deployments & Repository
- **Live Frontend (Vercel):** [https://the-date-crew-assignment-livid.vercel.app/](https://the-date-crew-assignment-livid.vercel.app/)
- **Live Backend API (Render):** [https://the-date-crew-assignment-521e.onrender.com](https://the-date-crew-assignment-521e.onrender.com)
- **GitHub Repository:** [https://github.com/Riyanshverma/the-date-crew-assignment](https://github.com/Riyanshverma/the-date-crew-assignment)

---

## 🔑 Demo Credentials
All matchmakers use the shared local evaluation password `password123`. The gate is frontend-scoped for local demonstration purposes only:

| Username | Name | Role | Scope |
|---|---|---|---|
| `demo-matchmaker-1` | Aarav Mehta | Matchmaker | Manages assigned client queue |
| `demo-matchmaker-2` | Mira Kapoor | Matchmaker | Manages assigned client queue |
| `demo-matchmaker-3` | Kabir Sharma | Matchmaker | Manages assigned client queue |
| `demo-matchmaker-4` | Ananya Rao | Matchmaker | Manages assigned client queue |
| `demo-matchmaker-5` | Vihaan Sethi | Matchmaker | Manages assigned client queue |
| `demo-matchmaker-6` | Ishita Nair | Matchmaker | Manages assigned client queue |

---

## 🛠 Tech Stack & Architecture

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Lucide icons, accessible dialogs & custom design tokens adhering to `design.md`.
- **Backend:** Node.js, Express 5, TypeScript (`tsx`), CORS enabled with credentials reflection.
- **Data Persistence:** Server-side atomic JSON storage with locking (`server/data/customers.json`, `matches.json`, `matchmakers.json`).
- **Dataset:** 110 synthetically generated fictional Indian profiles (55 men, 55 women) strictly adhering to Indian legal marriage ages (men $\ge 21$, women $\ge 18$) and privacy standards (`.test` emails).

---

## 🧠 Matching Engine & Logic (`mvp-v1`)

Matching is completely deterministic, explainable, and separated from Express route handlers and UI components:
1. **Eligibility & Dealbreaker Gates:** Applied strictly **before** scoring. Legal age violations, non-matching gender, self, and explicit dealbreakers (smoking, diet, marital status, children stance, age, height, location, religion) exclude candidates immediately. Missing data (`PREFERS_NOT_TO_SAY` or `null`) is **never** scored as zero or treated as a mismatch.
2. **Two-Way Directional Scoring:** Evaluates both Customer $\rightarrow$ Candidate and Candidate $\rightarrow$ Customer fit. Dedicated gender-specific weighting heuristics (`MALE_STRATEGY` vs `FEMALE_STRATEGY`) reflect real-world matchmaking priorities while avoiding double-counting dedicated factors.
3. **Score Renormalization & Coverage:** Overall compatibility is renormalized over available data (`scoreCoverage %`), ensuring fair comparisons even with partially completed profiles.
4. **Structured Evidence:** All candidate comparisons are partitioned into **Matched Criteria**, **Differences**, and **Unknown Fields**, accompanied by the transparency notice: *"Based on structured preference alignment; not a prediction of relationship success."*
5. **Classifications:** Labels candidates as `TWO_WAY`, `PREFERRED`, `REVERSE`, or `BROADER` to provide immediate clarity to matchmakers.
6. **Mock Proposal Safeguard:** The **Send Match** action records a mock proposal (`PROPOSAL_SHARED`) for client review. It never dispatches real email or infers mutual consent.

---

## 📋 Project Checklist & Status
- [x] Login and matchmaker-scoped customer dashboard queue (Phase 1 & 2)
- [x] REST API and JSON repositories with atomic writes (Phase 3)
- [x] Customer profile, partner preferences, notes, and pairing history (Phase 4)
- [x] Deterministic matching engine with gender-specific weights (Phase 5)
- [x] Candidate UI, match actions, mock proposal, and pairing history (Phase 6)
- [x] Validation and integration of 110-profile fictional dataset (Phase 7)
- [x] Accessibility, responsive mobile drawer, and empty/error states (Phase 9)
- [x] Dual-cloud deployment: Backend on Render + Frontend on Vercel (Phase 9)
- [x] AI Semantic Relevance Assistant via OpenRouter `nvidia/nemotron-3.5-lightning:free` Top-K Re-ranking (Phase 8)

---

## 🤖 AI Semantic Relevance Assistant (`nvidia/nemotron-3.5-lightning:free`)

Per assignment requirements, an **AI Semantic Relevance Assistant** operates in a privacy-preserving, Top-K re-ranking architecture (Option B):
1. **Deterministic Gate First:** Dealbreakers, Indian legal marriage ages, and binary constraints are evaluated deterministically.
2. **Top-K Re-Ranking:** For the top candidates, an anonymized semantic request is dispatched to OpenRouter's free model `nvidia/nemotron-3.5-lightning:free`.
3. **Data Minimization:** No PII, names, ages, or genders are transmitted. Only anonymized comparisons of Education, Career, Core Values, and Hobbies are evaluated.
4. **Explainable Uplift:** Evaluates synergy for adjacent qualifications (e.g. Masters $\leftrightarrow$ Doctorate) and complementary professions (e.g. Sales $\leftrightarrow$ Business Owner), displaying a matchmaker insight badge on the candidate card.
5. **Configuration:** Set `OPENROUTER_API_KEY` in `.env` (or Render environment variables). If unset, the system gracefully falls back to deterministic scoring with zero downtime.

