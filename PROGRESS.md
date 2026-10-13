# Progress

## Current stage
Product and architecture planning is documented. Implementation has not yet started from this pack.

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
- [ ] Inspect current repo and align docs with existing code.
- [ ] Frontend shell and design tokens.
- [ ] Express API and JSON repositories.
- [ ] Frontend-only demo login gate (not security; no backend auth endpoints).
- [ ] Customer dashboard/detail.
- [ ] Matching engine and candidate result UI.
- [ ] Match statuses, notes, follow-ups and mock proposal.
- [x] Generate 140 fictional profiles, two matchmakers, and example pairings (file created).\n- [ ] Integrate and validate the existing JSON dataset in the repository.
- [ ] AI feature.
- [ ] Deployment and submission write-up.

## Next action
Follow Phase 0 in `IMPLEMENTATION_PLAN.md`: inspect the repository, read the docs, report existing state/conflicts, and wait for approval before Phase 1. Do not regenerate dummy data or implement AI during initial assessment.
