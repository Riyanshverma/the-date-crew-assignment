# Project Context — The Date Crew Matchmaker Dashboard

## Assignment source and requirements
The original assessment is titled **“Working Session Exercise — Build the Matchmaker Algo and Dashboard MVP.”** Its goal is an internal tool to help TDC manage customers, view profiles, and assign potential matches.

Required features:
- Basic matchmaker username/password login.
- Dashboard showing customers assigned to the logged-in matchmaker.
- Customer cards: name, age (derived from DOB), city, marital status, and status tag.
- Customer detail view with biodata and matchmaking context.
- At least 100 opposite-gender dummy profiles.
- Gender-aware matching: for male customers, consider younger, lower-income, shorter women and compatibility about children; for female customers, use thoughtful factors such as profession, values, and relocation.
- At least one AI capability in the final submission: score/rank with explanations, personalized OpenAI email intros, or LLM-based profile-fit reasoning.
- Each suggested candidate has a “Send Match” action that shows a mock email/modal/toast and basic candidate information.
- Deliverables: live hosted link, GitHub repo, sample credentials, and a 2–3 paragraph explanation of stack, matching logic, AI use, and assumptions.
- Submit to `tech@thedatecrew.com`, subject `Full Stack Developer Internship – [Your Name] – Assignment`; deadline stated in the PDF is two days from receipt.

The assessment emphasizes clean UX, realistic gender-specific matching, AI integration, readable code, and ownership. The AI requirement is deferred until the non-AI engine is reviewed, not removed from the final deliverable.

## TDC context
TDC publicly describes a premium, human-led matchmaking and relationship-advisory service for relationship-ready professionals. Its “How We Work” page describes profile review, matchmaker assignment, curated introductions, and post-introduction feedback/guidance.
- https://www.thedatecrew.com/
- https://www.thedatecrew.com/how-we-work
- https://www.thedatecrew.com/faq

**Distinction:** TDC's public site says “No AI. No App.” The assignment requires an AI feature for this exercise. Do not imply the proposed MVP is TDC's production system or that the public site confirms a proprietary numerical formula.

## Roles and terminology
- **Matchmaker:** staff user who reviews assigned customers, considers candidates, records notes, and manages each pairing.
- **Customer:** person whose profile and partner preferences are managed.
- **Candidate:** active profile being considered for a selected customer.
- **Introduction:** human-coordinated first connection after a potential match is reviewed. Candidate selection is not consent.
- **Profile readiness:** `ACTIVE` means required profile/preferences are complete and approved for matching. It does not claim identity verification.
- **Individual match:** a record for one pair of people; each pair has independent status, notes, follow-up and history.
- **Send Match:** the PDF does not specify actual email recipient/delivery. MVP interpretation: create a mock proposal for the assigned customer to review, include basic candidate info, and record the action. Do not contact the candidate or imply mutual consent.

## Stack and data
- Frontend: React + Vite + TypeScript.
- UI: shadcn/ui + Tailwind.
- Backend: Node.js + Express + TypeScript.
- Storage: JSON files on the server; no database.
- IDs: stable strings such as `cus_0001`, `mm_001`, `match_0001`.
- Dates: ISO strings; timestamps UTC where possible.
- Income: numeric INR per year, never mixed units/currencies.
- Age: calculate from `dateOfBirth`.
- Profile picture: local demo asset or placeholder; do not use real people's images without permission.
- Demo data planned: 140 fictional profiles (70 men, 70 women) and two matchmaker accounts.

## Readiness and statuses
Profile status:
- `INCOMPLETE`: required profile/preference information missing; excluded from candidate pool.
- `ACTIVE`: required fields complete and record approved for matching.

Pairing status:
`SHORTLISTED`, `PROPOSAL_SHARED`, `CLIENT_INTERESTED`, `AWAITING_OTHER_PERSON`, `BOTH_INTERESTED`, `INTRODUCTION_ARRANGED`, `AWAITING_FEEDBACK`, `IN_PROGRESS`, `DECLINED`, `ON_HOLD`, `CLOSED`.

Active counts: `SHORTLISTED`, `PROPOSAL_SHARED`, `CLIENT_INTERESTED`, `AWAITING_OTHER_PERSON`, `BOTH_INTERESTED`, `INTRODUCTION_ARRANGED`, `AWAITING_FEEDBACK`, `IN_PROGRESS`. Show `ON_HOLD` separately. `DECLINED` and `CLOSED` are not active. Dashboard counts are derived from match records. A customer can have multiple simultaneous pairings at different stages.

## Matching concepts
Inspired by publicly documented concepts, not copied proprietary systems:
- **Preferred:** candidate satisfies the selected customer's applicable preferences.
- **Broader:** candidate passes hard constraints but falls outside flexible preferences.
- **Reverse:** selected customer satisfies the candidate's preferences.
- **Two-way:** both people satisfy each other's applicable preferences.

Labels can coexist. Broader matching never bypasses a dealbreaker. Hard constraints filter; soft preferences score. Missing information is `UNKNOWN`, not automatically a match/mismatch. A field may be displayed without affecting score.

## Scope boundaries
In current rule-based MVP: login, dashboard, profile details/preferences, JSON API, eligibility/ranking, structured explanations, match statuses/history/notes/follow-ups, mock proposal, responsive design.
Deferred: AI/LLM, external LLM calls, behavioral tracking, ML, semantic matching of free text, real email, identity verification, real personal data. AI will be revisited after the deterministic MVP and privacy implications are reviewed.

## Research references
- Shaadi.com documents Preferred, Broader, Reverse and 2-way matches: https://www.shaadi.com/info/customer-relations/faq/match-making
- Hinge documents preferences, mutual preference alignment and dealbreakers: https://hinge.co/how-we-connect-daters
- Hinge automated decision-making: https://help.hinge.co/hc/en-us/articles/360010956733-Automated-Decision-Making-and-Profiling-at-Hinge
