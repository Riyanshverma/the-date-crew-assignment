# Architecture and Data Model

## 1. Runtime architecture

```text
React + Vite + TypeScript
  Login / Dashboard / Customer detail / Ranked candidates / Match history
                 | HTTP JSON API
Node.js + Express + TypeScript
  Auth + access middleware + routes + services + matching engine
                 | repositories
Server-side JSON: matchmakers.json, customers.json, matches.json
```

Frontend must not import private JSON data directly. All reads and mutations go through the API. Keep the matching engine in deterministic functions separate from Express handlers and UI components.

Suggested folders (adapt to existing repository; do not scaffold blindly):
```text
client/src/{app,components,features/{auth,customers,matches,dashboard},lib,types}
server/src/{routes,middleware,services/matching,repositories,schemas,types}
server/data/{matchmakers,customers,matches}.json
```

## 2. Enums and controlled options

```ts
type Gender = "MAN" | "WOMAN";
type ProfileStatus = "INCOMPLETE" | "ACTIVE";
type MaritalStatus = "NEVER_MARRIED" | "DIVORCED" | "WIDOWED" | "SEPARATED" | "OTHER";
type EmploymentStatus = "EMPLOYED" | "SELF_EMPLOYED" | "BUSINESS_OWNER" | "STUDENT" | "UNEMPLOYED" | "HOMEMAKER" | "OTHER";
type YesNoMaybe = "YES" | "NO" | "MAYBE";
type ChildrenPreference = "WANTS_CHILDREN" | "DOES_NOT_WANT_CHILDREN" | "UNSURE" | "OPEN_TO_DISCUSSION";
type ExistingChildrenPreference = "COMFORTABLE" | "NOT_COMFORTABLE" | "DEPENDS" | "NOT_APPLICABLE";
type RelocationPreference = "WILL_RELOCATE" | "WILL_NOT_RELOCATE" | "DEPENDS" | "PREFERS_NOT_TO_SAY";
type PetPreference = "COMFORTABLE" | "NOT_COMFORTABLE" | "DEPENDS" | "PREFERS_NOT_TO_SAY";
type DietaryPreference = "VEGETARIAN" | "VEGAN" | "EGGETARIAN" | "NON_VEGETARIAN" | "JAIN" | "OTHER" | "PREFERS_NOT_TO_SAY";
type SmokingPreference = "NON_SMOKER" | "OCCASIONAL" | "REGULAR" | "PREFERS_NOT_TO_SAY";
type DrinkingPreference = "NON_DRINKER" | "OCCASIONAL" | "SOCIAL" | "REGULAR" | "PREFERS_NOT_TO_SAY";
type RelationshipGoal = "MARRIAGE" | "LONG_TERM_RELATIONSHIP" | "OPEN_TO_DISCUSSION";
type FamilyStructure = "NUCLEAR" | "JOINT" | "EXTENDED" | "OTHER" | "PREFERS_NOT_TO_SAY";
type PreferenceImportance = "DEALBREAKER" | "IMPORTANT" | "FLEXIBLE";
type ComparisonResult = "MATCH" | "PARTIAL_MATCH" | "NO_MATCH" | "UNKNOWN" | "NOT_APPLICABLE";
type MatchStatus = "SHORTLISTED" | "PROPOSAL_SHARED" | "CLIENT_INTERESTED" | "AWAITING_OTHER_PERSON" | "BOTH_INTERESTED" | "INTRODUCTION_ARRANGED" | "AWAITING_FEEDBACK" | "IN_PROGRESS" | "DECLINED" | "ON_HOLD" | "CLOSED";
type MatchClassification = "PREFERRED" | "BROADER" | "REVERSE" | "TWO_WAY";
```

Use stable enum values in storage; UI labels can be friendlier. Maintain one central option catalogue for hobbies, core values, languages, lifestyle, career categories, and other controlled fields.

## 3. Selectable catalogues: core values and hobbies/interests

Keep these values in one shared catalogue module (for example `shared/catalogues.ts`) and use the same values in profile forms, partner-preference forms, seed data, and matching comparisons. Stored values should be stable strings; display labels can use the same human-readable text.

### Core values

```ts
export const CORE_VALUE_OPTIONS = [
  "Family-oriented", "Honesty", "Trust", "Respect", "Emotional availability",
  "Empathy", "Kindness", "Loyalty", "Open communication", "Personal growth",
  "Independence", "Stability", "Ambition", "Work-life balance",
  "Equality in a relationship", "Shared responsibility", "Financial responsibility",
  "Adventure", "Spirituality", "Community involvement", "Intellectual curiosity",
  "Simplicity", "Compassion", "Patience", "Commitment", "Flexibility",
  "Privacy", "Creativity"
] as const;
```

### Hobbies and interests

```ts
export const HOBBY_INTEREST_OPTIONS = {
  Food: ["Cooking", "Trying new restaurants", "Cafés", "Baking"],
  Travel: ["Domestic travel", "International travel", "Road trips", "Nature trips"],
  Outdoors: ["Hiking", "Trekking", "Camping", "Gardening"],
  Fitness: ["Gym", "Running", "Yoga", "Cycling", "Swimming", "Walking"],
  Sports: ["Cricket", "Football", "Badminton", "Tennis", "Basketball"],
  Arts: ["Photography", "Painting", "Drawing", "Music", "Dancing"],
  Entertainment: ["Movies", "TV shows", "Documentaries", "Theatre"],
  Reading: ["Fiction", "Non-fiction", "Poetry", "Biographies"],
  Learning: ["Technology", "Science", "Languages", "History", "Personal development"],
  Social: ["Meeting friends", "Hosting gatherings", "Volunteering"],
  Lifestyle: ["Pets", "Fashion", "Home décor", "Exploring new places"],
  Leisure: ["Board games", "Gaming", "Puzzles", "Podcasts"],
  Culture: ["Museums", "Cultural events", "Festivals", "Heritage"],
  Creativity: ["Writing", "Design", "Crafts", "Making things"]
} as const;
```

Profiles store selections in `relationship.coreValues` and `lifestyle.hobbiesInterests`; partner preferences store selected values in `coreValues` and `hobbiesInterests`. These are multi-select fields. Do not infer personality traits from selections; compare only declared values. Empty selections mean no recorded values, not that the person has no values or interests.

## 4. Person profile schema

```ts
interface PersonProfile {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;                 // YYYY-MM-DD; age derived
  profilePicture: string | null;       // local demo asset or null
  profileStatus: ProfileStatus;
  assignedMatchmakerId: string;
  location: { country: string; state: string; city: string };
  heightCm: number;
  maritalStatus: MaritalStatus;
  contact: { email: string; phone: string };
  languagesKnown: string[];
  education: {
    highestEducation: "HIGH_SCHOOL" | "DIPLOMA" | "BACHELORS" | "MASTERS" | "DOCTORATE" | "OTHER";
    undergraduateCollege: string | null;
    degree: string | null;
    additionalQualifications: string[];
  };
  career: {
    employmentStatus: EmploymentStatus;
    company: string | null;
    designation: string | null;
    professionCategory: string;
    industry: string | null;
    annualIncome: number | null;       // INR per year
    currency: "INR";
    careerGoals: string[];
  };
  culturalBackground: { religion: string | null; community: string | null };
  family: {
    familyStructure: FamilyStructure | null;
    siblings: number | null;
    familyResponsibilities: string[];
  };
  familyPlanning: {
    hasChildren: YesNoMaybe;
    wantsChildren: ChildrenPreference;
    opennessToPartnerWithChildren: ExistingChildrenPreference;
    preferredTimeline: string | null;
  };
  relocation: { openToRelocate: YesNoMaybe; relocationPreferences: string[] };
  lifestyle: {
    openToPets: YesNoMaybe;
    dietaryPreference: DietaryPreference;
    smoking: SmokingPreference;
    drinking: DrinkingPreference;
    hobbiesInterests: string[];
    lifestylePreferences: string[];
  };
  relationship: {
    relationshipGoal: RelationshipGoal;
    marriageTimeline: string | null;
    relationshipPriorities: string[];
    coreValues: string[];
    expectationsAboutMarriedLife: string[];
    personalGoals: string[];
  };
  notes: CustomerNote[];
  createdAt: string;
  updatedAt: string;
}
```

Age is derived from DOB. `annualIncome` is numeric INR/year; null is unknown, not zero. Religion/community are voluntary and optional. Notes are never score inputs. Active means required fields/preferences are complete and approved, not identity verified.

## 5. Partner preferences schema

```ts
interface RangePreference {
  min: number | null;
  max: number | null;
  importance: PreferenceImportance;
}
interface MultiSelectPreference<T = string> {
  values: T[];
  importance: PreferenceImportance;
  allowBroaderMatches: boolean;
}
interface ScalarPreference<T = string> {
  value: T | null;
  importance: PreferenceImportance;
}
interface PartnerPreferences {
  preferredAgeRange: RangePreference;       // years
  preferredHeightRange: RangePreference;    // cm
  preferredLocations: MultiSelectPreference<string>;
  preferredMaritalStatuses: MultiSelectPreference<MaritalStatus>;
  preferredHighestEducation: MultiSelectPreference<string>;
  preferredProfessions: MultiSelectPreference<string>;
  preferredIndustries: MultiSelectPreference<string>;
  preferredIncomeRange: RangePreference;    // INR/year
  preferredReligions: MultiSelectPreference<string>;
  preferredCommunities: MultiSelectPreference<string>;
  preferredLanguages: MultiSelectPreference<string>;
  childrenPreference: ScalarPreference<ChildrenPreference>;
  existingChildrenPreference: ScalarPreference<ExistingChildrenPreference>;
  familyPlanningTimeline: ScalarPreference<string>;
  relocationPreference: ScalarPreference<RelocationPreference>;
  preferredFamilyStructures: MultiSelectPreference<FamilyStructure>;
  petPreference: ScalarPreference<PetPreference>;
  dietaryPreference: MultiSelectPreference<DietaryPreference>;
  smokingPreference: MultiSelectPreference<SmokingPreference>;
  drinkingPreference: MultiSelectPreference<DrinkingPreference>;
  relationshipGoals: MultiSelectPreference<RelationshipGoal>;
  marriageTimeline: MultiSelectPreference<string>;
  relationshipPriorities: MultiSelectPreference<string>;
  coreValues: MultiSelectPreference<string>;
  expectationsAboutMarriedLife: MultiSelectPreference<string>;
  careerGoals: MultiSelectPreference<string>;
  hobbiesInterests: MultiSelectPreference<string>;
  lifestylePreferences: MultiSelectPreference<string>;
  dealbreakers: string[];                   // derived summary; field importance is canonical
  otherPreferences: string | null;          // display only, not scored
  updatedAt: string;
}
```

Preference meanings:
- `DEALBREAKER`: violation excludes candidate.
- `IMPORTANT`: strong score influence, not exclusion.
- `FLEXIBLE`: softer influence; may be relaxed for broader results.
- Missing data yields `UNKNOWN`, never automatic match/mismatch.
- Avoid duplicate sources of truth: use each field's `importance` as canonical and derive `dealbreakers` where practical.
- Free-text `otherPreferences` is not scored in this MVP.

## 6. Matchmaker and notes

```ts
interface Matchmaker {
  id: string;
  displayName: string;
  username: string;
  passwordHash: string;
  active: boolean;
  createdAt: string;
}
interface CustomerNote {
  id: string;
  authorMatchmakerId: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
}
```

Never store plaintext passwords or return password hashes. Seeded demo credentials may be documented after implementation.

## 7. Match history schema

```ts
interface MatchStatusEvent {
  id: string;
  fromStatus: MatchStatus | null;
  toStatus: MatchStatus;
  changedByMatchmakerId: string;
  note: string | null;
  createdAt: string;
}
interface MatchNote {
  id: string;
  authorMatchmakerId: string;
  body: string;
  createdAt: string;
}
interface MatchRecord {
  id: string;
  customerAId: string;
  customerBId: string;                // canonical pair order for duplicate detection
  createdByMatchmakerId: string;
  status: MatchStatus;
  classifications: MatchClassification[];
  compatibilityScore: number;         // 0–100 heuristic
  customerPreferenceFit: number;
  reversePreferenceFit: number;
  scoreVersion: string;               // "mvp-v1"
  proposal: {
    sharedAt: string | null;
    sharedByMatchmakerId: string | null;
    mockMessage: string | null;
  };
  introduction: {
    arrangedAt: string | null;
    feedbackFromCustomerA: string | null;
    feedbackFromCustomerB: string | null;
    outcome: string | null;
  };
  followUpAt: string | null;
  notes: MatchNote[];
  statusHistory: MatchStatusEvent[];
  createdAt: string;
  updatedAt: string;
}
interface CustomerRecord {
  profile: PersonProfile;
  preferences: PartnerPreferences;
}
```

Store each pairing as an individual record in `matches.json`; derive a customer's history by either participant ID. Status changes append history events. Customer-level notes and pairing-specific notes remain separate.

History policy:
- No duplicate active pair.
- Exclude previously declined pairings from normal recommendations.
- On-hold pairings stay paused and do not reappear as new pairings.
- Closed pairings are excluded by default.
- Previously completed introductions are not automatically repeated.
- Unrelated pair history does not change score.
- `PROPOSAL_SHARED` records a mock proposal, not the other person's agreement.
- Interest statuses are set by the matchmaker from human responses, never inferred from a score.

## 8. Eligibility and matching pipeline

1. Confirm selected customer is active.
2. Load active candidate profiles.
3. Exclude self, non-matching gender for the assignment's current binary pool, duplicate pairs, declined/on-hold/closed pairings per policy.
4. Apply minimum legal age and explicit dealbreakers.
5. Compare customer preferences against candidate profile and candidate preferences against customer profile.
6. Produce `MATCH`, `PARTIAL_MATCH`, `NO_MATCH`, `UNKNOWN`, or `NOT_APPLICABLE` evidence.
7. Derive labels, compute strategy-specific score, rank.
8. Return profile basics, score, labels, matched preferences, reverse preferences, differences, unknowns, and score coverage.
9. Matchmaker reviews and chooses the next action.

Hard constraints are gates, not score penalties. Age, height, marital status, location, religion/community, children, income, or other preferences are hard only when explicitly marked `DEALBREAKER` (plus legal-age/basic eligibility rules). Assignment's male younger/lower-income/shorter signals are default ranking signals, not global hard constraints. Explicit customer preference takes precedence.

### Match labels
- `PREFERRED`: candidate satisfies the selected customer's applicable preferences.
- `BROADER`: candidate passes hard constraints but falls outside flexible preferences.
- `REVERSE`: selected customer satisfies candidate's applicable preferences.
- `TWO_WAY`: both satisfy each other's applicable preferences.

Labels can coexist. A broader candidate must never violate a hard constraint. For a directional label, do not call a candidate preferred when relevant information is too incomplete to justify the label. Define a consistent minimum information threshold in code.

## 9. Scoring: `mvp-v1`

All weights below are explicit initial heuristics, not scientifically validated. Score is a 0–100 ranking indicator, not probability of relationship success.

For each category, compare structured options/ranges, map `MATCH=1`, `PARTIAL_MATCH=0.5`, `NO_MATCH=0`; exclude `UNKNOWN`/`NOT_APPLICABLE` from the denominator. Normalize category score to 0–100. If no usable data exists for a category, report unavailable and renormalize across available weighted categories or show coverage. Do not treat missing values as mismatches.

Avoid double counting: general preference-fit buckets exclude relationship/family, values, and strategy-specific factors that have their own weights.

### Fit and score formulas

For each structured comparison, use `MATCH = 1.0`, `PARTIAL_MATCH = 0.5`, and `NO_MATCH = 0.0`. Exclude `UNKNOWN` and `NOT_APPLICABLE` from the numerator and denominator. A dealbreaker violation is excluded during eligibility and never reaches scoring.

```text
categoryFit(c) = 100 * sum(comparisonValue_i) / count(usableComparisons_i)
availableWeight = sum(w_c for categories with a categoryFit)
overallScore = sum(w_c * categoryFit(c)) / availableWeight
scoreCoverage = 100 * availableWeight / sum(all configured weights)
```

A comparison is usable when its result is `MATCH`, `PARTIAL_MATCH`, or `NO_MATCH`. If a category has no usable comparisons, mark it unavailable rather than assigning zero. Round the displayed score to the nearest integer. If no weighted category has usable data, return `score = null` and `scoreCoverage = 0`; explain that information is insufficient instead of showing a fabricated zero. Unknown fields are not mismatches.

Return `customerPreferenceFit` and `reversePreferenceFit` as separately normalized diagnostics over their own applicable comparisons. Do not add them a second time after their weighted categories have contributed to `overallScore`.

**Directional comparison:** compare the selected customer's preferences against the candidate's profile for customer fit, and the candidate's preferences against the selected customer's profile for reverse fit. Keep profile values and partner preferences distinct.

**Male-strategy assignment signals:** when both values are known, younger candidate = `MATCH`, older candidate = `NO_MATCH`, equal age = `PARTIAL_MATCH`; lower candidate income = `MATCH`, higher income = `NO_MATCH`, equal income = `PARTIAL_MATCH`; shorter candidate = `MATCH`, taller candidate = `NO_MATCH`, equal height = `PARTIAL_MATCH`. These are soft signals only. Explicit stated preferences take precedence, and these signals must not become hard constraints.

**Avoid double counting:** general preference-fit buckets exclude relationship/family planning, values, age/income/height signals, career/education, location/relocation, and lifestyle/interests whenever the same data has a dedicated category in the chosen strategy.

**Age calculation:** derive completed years from `dateOfBirth` relative to the current date; never store stale age in JSON.

### Male-customer ranking
| Category | Weight |
|---|---:|
| Customer general preference fit, excluding dedicated categories | 25% |
| Candidate reverse general preference fit, excluding dedicated categories | 15% |
| Relationship goals and family planning | 20% |
| Younger-age alignment | 8% |
| Lower-income alignment | 7% |
| Shorter-height alignment | 5% |
| Core values and relationship priorities | 10% |
| Career and education alignment | 5% |
| Lifestyle and interests | 5% |
| **Total** | **100%** |

Age/income/height signals favor younger/lower-income/shorter candidates by default to address the assignment. They remain soft ranking signals. Explicit stated preferences take precedence; do not automatically penalize an older, higher-income, or taller candidate if the customer intentionally prefers that.

### Female-customer ranking
| Category | Weight |
|---|---:|
| Customer general preference fit, excluding dedicated categories | 25% |
| Candidate reverse general preference fit, excluding dedicated categories | 15% |
| Relationship goals and family planning | 20% |
| Professional and career compatibility | 12% |
| Core values and relationship priorities | 10% |
| Location and relocation compatibility | 8% |
| Lifestyle and interests | 5% |
| Education alignment | 5% |
| **Total** | **100%** |

Keep weights in one named configuration and store `scoreVersion: "mvp-v1"`. For both strategies, dedicated categories are excluded from general preference-fit aggregation.

Sort by score descending; when scores are within 2 points, prefer two-way alignment, then higher satisfaction of `IMPORTANT` preferences, then stable ID. Do not add an unexplained two-way bonus because reverse fit already contributes to the score.

## 10. Result contract

```ts
interface PreferenceEvidence {
  field: string;
  label: string;
  result: ComparisonResult;
  customerValue: unknown;
  candidateValue: unknown;
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER";
  importance: PreferenceImportance | null;
  explanation: string; // deterministic template, not LLM
}
interface RankedCandidate {
  candidate: PersonProfile;
  rank: number;
  score: number;
  customerPreferenceFit: number;
  reversePreferenceFit: number;
  classifications: MatchClassification[];
  matchedPreferences: PreferenceEvidence[];
  differences: PreferenceEvidence[];
  unknowns: PreferenceEvidence[];
  scoreCoverage: number;
}
```

Return only fields needed for the current view; never expose auth fields or raw filesystem data.

## 11. API sketch

The MVP login is intentionally a **frontend-only demo gate** using hardcoded demo credentials. It is not real authentication and does not protect the API. Do not add auth/session endpoints for this phase.

```text
GET    /api/health
GET    /api/customers
GET    /api/customers/:customerId
GET    /api/customers/:customerId/matches
GET    /api/customers/:customerId/recommendations
POST   /api/customers/:customerId/notes
POST   /api/matches
GET    /api/matches/:matchId
PATCH  /api/matches/:matchId/status
POST   /api/matches/:matchId/notes
PATCH  /api/matches/:matchId/follow-up
POST   /api/matches/:matchId/share-proposal
```

Frontend login behavior:
- Keep the demo username/password in a clearly named frontend-only constant.
- Compare credentials in the login form and store only a simple demo UI state.
- Do not send credentials to Express or create `/api/auth/login`, `/api/auth/logout`, or `/api/auth/me`.
- Document the demo credentials after implementation.
- This is acceptable only for a local, fictional-data MVP. Anyone who can reach the API can call it directly; frontend gating is not authorization. Do not put real personal data on a public deployment. If public hosting requires access protection, ask the user before adding server-side authentication.

Because the MVP has no authenticated server identity, `assignedMatchmakerId` is a data/UI filtering field, not a security boundary. Keep all data fictional. Validate route parameters, mutations, status transitions, and pairing consistency on the server.

## 12. JSON persistence and privacy

Files: `matchmakers.json`, `customers.json` (array of `{ profile, preferences }`), `matches.json`. Centralize reads/writes, validate data, serialize writes or use temp-file-and-rename to avoid partial files. Serverless filesystems may not persist changes; verify host persistence before deployment.

Use fictional data, minimal API payloads, server-side input/status validation, and no external LLM calls in this phase. There are no password hashes or server-side authentication in this demo-only phase. Do not infer sensitive traits or use photos as matching features.
