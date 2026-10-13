/**
 * Scoring weights configuration for MVP v1 as defined in ARCHITECTURE.md Section 9.
 * 
 * Rules:
 * - Score is 0–100 ranking indicator.
 * - Score version is explicitly "mvp-v1".
 * - All weights in each strategy sum to exactly 100.
 * - General preference fit excludes dedicated categories to prevent double counting.
 */

export const SCORE_VERSION = "mvp-v1";

export interface CategoryWeightConfig {
  category: string;
  weight: number; // percentage (0 - 100)
  description: string;
}

export const MALE_STRATEGY_WEIGHTS: Record<string, number> = {
  // General fits (excluding dedicated)
  customerGeneralPreference: 25,
  candidateReverseGeneralPreference: 15,
  // Dedicated categories
  relationshipGoalsFamily: 20,
  youngerAgeAlignment: 8,
  lowerIncomeAlignment: 7,
  shorterHeightAlignment: 5,
  coreValuesPriorities: 10,
  careerEducation: 5,
  lifestyleInterests: 5
};

export const FEMALE_STRATEGY_WEIGHTS: Record<string, number> = {
  // General fits (excluding dedicated)
  customerGeneralPreference: 25,
  candidateReverseGeneralPreference: 15,
  // Dedicated categories
  relationshipGoalsFamily: 20,
  professionalCareer: 12,
  coreValuesPriorities: 10,
  locationRelocation: 8,
  lifestyleInterests: 5,
  educationAlignment: 5
};
