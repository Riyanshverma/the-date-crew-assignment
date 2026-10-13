export const PROFILE_STATUSES = ["INCOMPLETE", "ACTIVE"] as const;
export type ProfileStatus = (typeof PROFILE_STATUSES)[number];

export const MATCH_STATUSES = [
  "SHORTLISTED",
  "PROPOSAL_SHARED",
  "CLIENT_INTERESTED",
  "AWAITING_OTHER_PERSON",
  "BOTH_INTERESTED",
  "INTRODUCTION_ARRANGED",
  "AWAITING_FEEDBACK",
  "IN_PROGRESS",
  "DECLINED",
  "ON_HOLD",
  "CLOSED"
] as const;
export type MatchStatus = (typeof MATCH_STATUSES)[number];

export const CORE_VALUE_OPTIONS = [
  "Family-oriented",
  "Honesty",
  "Trust",
  "Respect",
  "Emotional availability",
  "Empathy",
  "Kindness",
  "Loyalty",
  "Open communication",
  "Personal growth",
  "Independence",
  "Stability",
  "Ambition",
  "Work-life balance",
  "Equality in a relationship",
  "Shared responsibility",
  "Financial responsibility",
  "Adventure",
  "Spirituality",
  "Community involvement",
  "Intellectual curiosity",
  "Simplicity",
  "Compassion",
  "Patience",
  "Commitment",
  "Flexibility",
  "Privacy",
  "Creativity"
] as const;
export type CoreValue = (typeof CORE_VALUE_OPTIONS)[number];

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

export const ALL_HOBBY_INTEREST_OPTIONS = Object.values(HOBBY_INTEREST_OPTIONS).flat();
export type HobbyInterest = (typeof ALL_HOBBY_INTEREST_OPTIONS)[number];

export type Gender = "MAN" | "WOMAN";
export type MaritalStatus = "NEVER_MARRIED" | "DIVORCED" | "WIDOWED" | "SEPARATED" | "OTHER";
export type EmploymentStatus =
  | "EMPLOYED"
  | "SELF_EMPLOYED"
  | "BUSINESS_OWNER"
  | "STUDENT"
  | "UNEMPLOYED"
  | "HOMEMAKER"
  | "OTHER";
export type YesNoMaybe = "YES" | "NO" | "MAYBE";
export type ChildrenPreference =
  | "WANTS_CHILDREN"
  | "DOES_NOT_WANT_CHILDREN"
  | "UNSURE"
  | "OPEN_TO_DISCUSSION";
export type ExistingChildrenPreference = "COMFORTABLE" | "NOT_COMFORTABLE" | "DEPENDS" | "NOT_APPLICABLE";
export type RelocationPreference = "WILL_RELOCATE" | "WILL_NOT_RELOCATE" | "DEPENDS" | "PREFERS_NOT_TO_SAY";
export type PetPreference = "COMFORTABLE" | "NOT_COMFORTABLE" | "DEPENDS" | "PREFERS_NOT_TO_SAY";
export type DietaryPreference =
  | "VEGETARIAN"
  | "VEGAN"
  | "EGGETARIAN"
  | "NON_VEGETARIAN"
  | "JAIN"
  | "OTHER"
  | "PREFERS_NOT_TO_SAY";
export type SmokingPreference = "NON_SMOKER" | "OCCASIONAL" | "REGULAR" | "PREFERS_NOT_TO_SAY";
export type DrinkingPreference = "NON_DRINKER" | "OCCASIONAL" | "SOCIAL" | "REGULAR" | "PREFERS_NOT_TO_SAY";
export type RelationshipGoal = "MARRIAGE" | "LONG_TERM_RELATIONSHIP" | "OPEN_TO_DISCUSSION";
export type FamilyStructure = "NUCLEAR" | "JOINT" | "EXTENDED" | "OTHER" | "PREFERS_NOT_TO_SAY";
export type PreferenceImportance = "DEALBREAKER" | "IMPORTANT" | "FLEXIBLE";
export type ComparisonResult = "MATCH" | "PARTIAL_MATCH" | "NO_MATCH" | "UNKNOWN" | "NOT_APPLICABLE";
export type MatchClassification = "PREFERRED" | "BROADER" | "REVERSE" | "TWO_WAY";

export interface CustomerNote {
  id: string;
  authorMatchmakerId: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MatchNote {
  id: string;
  authorMatchmakerId: string;
  body: string;
  createdAt: string;
}

export interface MatchStatusEvent {
  id: string;
  fromStatus: MatchStatus | null;
  toStatus: MatchStatus;
  changedByMatchmakerId: string;
  note: string | null;
  createdAt: string;
}

export interface PersonProfile {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  profilePicture: string | null;
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
    annualIncome: number | null;
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
    hobbiesInterests: (HobbyInterest | string)[];
    lifestylePreferences: string[];
  };
  relationship: {
    relationshipGoal: RelationshipGoal;
    marriageTimeline: string | null;
    relationshipPriorities: string[];
    coreValues: (CoreValue | string)[];
    expectationsAboutMarriedLife: string[];
    personalGoals: string[];
  };
  notes: CustomerNote[];
  createdAt: string;
  updatedAt: string;
}

export interface RangePreference {
  min: number | null;
  max: number | null;
  importance: PreferenceImportance;
}

export interface MultiSelectPreference<T = string> {
  values: T[];
  importance: PreferenceImportance;
  allowBroaderMatches: boolean;
}

export interface ScalarPreference<T = string> {
  value: T | null;
  importance: PreferenceImportance;
}

export interface PartnerPreferences {
  preferredAgeRange: RangePreference;
  preferredHeightRange: RangePreference;
  preferredLocations: MultiSelectPreference<string>;
  preferredMaritalStatuses: MultiSelectPreference<MaritalStatus>;
  preferredHighestEducation: MultiSelectPreference<string>;
  preferredProfessions: MultiSelectPreference<string>;
  preferredIndustries: MultiSelectPreference<string>;
  preferredIncomeRange: RangePreference;
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
  coreValues: MultiSelectPreference<CoreValue | string>;
  expectationsAboutMarriedLife: MultiSelectPreference<string>;
  careerGoals: MultiSelectPreference<string>;
  hobbiesInterests: MultiSelectPreference<HobbyInterest | string>;
  lifestylePreferences: MultiSelectPreference<string>;
  dealbreakers: string[];
  otherPreferences: string | null;
  updatedAt: string;
}

export interface CustomerRecord {
  profile: PersonProfile;
  preferences: PartnerPreferences;
}

export interface MatchmakerRecord {
  id: string;
  displayName: string;
  username: string;
  active: boolean;
  createdAt: string;
}

export interface MatchRecord {
  id: string;
  customerAId: string;
  customerBId: string;
  createdByMatchmakerId: string;
  status: MatchStatus;
  classifications: MatchClassification[];
  compatibilityScore: number;
  customerPreferenceFit: number;
  reversePreferenceFit: number;
  scoreVersion: string;
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

export interface CustomerSummary {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  assignedMatchmakerId: string;
  city: string;
  maritalStatus: MaritalStatus;
  profileStatus: ProfileStatus;
  profession: string | null;
  age: number | null;
  matchStatusCounts: Partial<Record<MatchStatus, number>>;
}

export interface HealthResponse {
  service: "tdc-matchmaker-api";
  status: "ok";
}

/**
 * Calculates completed age from date of birth (YYYY-MM-DD).
 */
export function calculateAge(dateOfBirth: string | null | undefined): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}
