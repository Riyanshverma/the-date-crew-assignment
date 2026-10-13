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

export const MATCH_STATUS_TRANSITIONS: Record<MatchStatus, readonly MatchStatus[]> = {
  SHORTLISTED: ["PROPOSAL_SHARED", "DECLINED", "ON_HOLD", "CLOSED"],
  PROPOSAL_SHARED: ["CLIENT_INTERESTED", "DECLINED", "ON_HOLD", "CLOSED"],
  CLIENT_INTERESTED: ["AWAITING_OTHER_PERSON", "DECLINED", "ON_HOLD", "CLOSED"],
  AWAITING_OTHER_PERSON: ["BOTH_INTERESTED", "DECLINED", "ON_HOLD", "CLOSED"],
  BOTH_INTERESTED: ["INTRODUCTION_ARRANGED", "DECLINED", "ON_HOLD", "CLOSED"],
  INTRODUCTION_ARRANGED: ["AWAITING_FEEDBACK", "IN_PROGRESS", "ON_HOLD", "CLOSED"],
  AWAITING_FEEDBACK: ["IN_PROGRESS", "DECLINED", "ON_HOLD", "CLOSED"],
  IN_PROGRESS: ["DECLINED", "ON_HOLD", "CLOSED"],
  DECLINED: [],
  ON_HOLD: ["SHORTLISTED", "PROPOSAL_SHARED", "CLIENT_INTERESTED", "AWAITING_OTHER_PERSON", "BOTH_INTERESTED", "INTRODUCTION_ARRANGED", "AWAITING_FEEDBACK", "IN_PROGRESS", "DECLINED", "CLOSED"],
  CLOSED: []
};

export interface CustomerSummary {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  maritalStatus: string;
  profileStatus: ProfileStatus;
  age: number | null;
  matchStatusCounts: Partial<Record<MatchStatus, number>>;
}

export interface HealthResponse {
  service: "tdc-matchmaker-api";
  status: "ok";
}
