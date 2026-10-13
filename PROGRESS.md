# Progress

## Current stage
Phase 2 (Visual shell and frontend demo login) completed on branch `phase-2-visual-shell-demo-login`.

## Phase 2 Execution Summary
- **Work completed:**
  - Configured complete design tokens and Tailwind v4 `@theme` in `client/src/styles.css` matching `design.md`.
  - Added button size variants (`default`, `sm`, `lg`, `icon`) to `client/src/components/ui/button.tsx`.
  - Created frontend-only demo credentials constant in `client/src/features/auth/demo-credentials.ts` with accounts for Aarav Mehta (`demo-matchmaker-1`) and Mira Kapoor (`demo-matchmaker-2`).
  - Implemented `AuthContext`, `AuthProvider`, `useAuth`, and route guards (`RequireAuth`, `RedirectIfAuth`) with session storage. No backend authentication endpoints were created.
  - Built `LoginPage` with credential inputs, error alert on invalid inputs, and one-click demo login buttons.
  - Built responsive `AppShell` with top header, 248px desktop sidebar, mobile drawer overlay (<640px), navigation links (`/dashboard`, `/customers`), active demo account indicator, and account switcher popover.
  - Built `StatusBadge` supporting `ProfileStatus` (`ACTIVE`, `INCOMPLETE`) and all 11 pairing `MatchStatus` values with accessible text labels and icons.
  - Created reusable `LoadingState`, `EmptyState`, and `ErrorState` components.
  - Built `DashboardPage` and `CustomersPage` visual shells with operational metrics, readiness/status filters, and preview queue.
- **Files changed:**
  - `client/src/styles.css` (modified: added `@theme` design tokens)
  - `client/src/components/ui/button.tsx` (modified: added size variants)
  - `client/src/features/auth/demo-credentials.ts` (created)
  - `client/src/features/auth/AuthContext.tsx` (created)
  - `client/src/features/auth/AuthGuard.tsx` (created)
  - `client/src/features/auth/LoginPage.tsx` (created)
  - `client/src/components/common/StatusBadge.tsx` (created)
  - `client/src/components/common/FeedbackStates.tsx` (created)
  - `client/src/components/layout/AppShell.tsx` (created)
  - `client/src/features/dashboard/DashboardPage.tsx` (created)
  - `client/src/features/customers/CustomersPage.tsx` (created)
  - `client/src/App.tsx` (modified: wired routes and auth provider)
  - `PROGRESS.md` (updated)
- **Commands / checks run:**
  - `npm run typecheck` — Passed (exit code 0 for client and server).
  - `npm run build` — Passed (typecheck + vite build succeeded in 1.27s).
- **Next Phase:** Phase 3 — JSON repositories and API.

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
- [x] Frontend shell and design tokens (Phase 2).
- [ ] Express API and JSON repositories (Phase 3).
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
