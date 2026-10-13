import type {
  CustomerRecord,
  MatchRecord,
  PersonProfile,
  PartnerPreferences
} from "../../../shared/contracts.js";
import { calculateAge } from "../../../shared/contracts.js";

export interface EligibilityResult {
  eligible: boolean;
  reason?: string;
}

/**
 * Minimum legal marriage age in India:
 * - Men: 21 years
 * - Women: 18 years
 */
export function isLegalAge(gender: "MAN" | "WOMAN", dateOfBirth: string | null | undefined): boolean {
  const age = calculateAge(dateOfBirth);
  if (age === null) return false;
  return gender === "MAN" ? age >= 21 : age >= 18;
}

/**
 * Checks if a candidate satisfies basic eligibility, legal age, and hard dealbreakers.
 * Hard constraints are gates, not score penalties.
 */
export function evaluateEligibility(
  customer: CustomerRecord,
  candidate: CustomerRecord,
  existingMatches: MatchRecord[]
): EligibilityResult {
  const custProf = customer.profile;
  const candProf = candidate.profile;

  // 1. Exclude self
  if (custProf.id === candProf.id) {
    return { eligible: false, reason: "Cannot match with self" };
  }

  // 2. Both profiles must be ACTIVE
  if (candProf.profileStatus !== "ACTIVE") {
    return { eligible: false, reason: "Candidate profile is not active" };
  }
  if (custProf.profileStatus !== "ACTIVE") {
    return { eligible: false, reason: "Customer profile is not active" };
  }

  // 3. Opposite gender check for binary pool
  if (custProf.gender === candProf.gender) {
    return { eligible: false, reason: "Gender must be opposite in binary pool" };
  }

  // 4. Minimum legal age
  if (!isLegalAge(custProf.gender, custProf.dateOfBirth)) {
    return { eligible: false, reason: "Customer does not meet minimum legal marriage age" };
  }
  if (!isLegalAge(candProf.gender, candProf.dateOfBirth)) {
    return { eligible: false, reason: "Candidate does not meet minimum legal marriage age" };
  }

  // 5. Duplicate pairings check: exclude if any pairing already exists between them
  const hasExistingMatch = existingMatches.some(
    (m) =>
      (m.customerAId === custProf.id && m.customerBId === candProf.id) ||
      (m.customerAId === candProf.id && m.customerBId === custProf.id)
  );
  if (hasExistingMatch) {
    return { eligible: false, reason: "Pairing already exists between customer and candidate" };
  }

  // 6. Explicit dealbreakers: Customer -> Candidate
  const custDealbreakerViolation = checkDealbreakerViolation(customer.preferences, candProf);
  if (custDealbreakerViolation) {
    return { eligible: false, reason: `Customer dealbreaker: ${custDealbreakerViolation}` };
  }

  // 7. Explicit dealbreakers: Candidate -> Customer (reciprocal hard gates)
  const candDealbreakerViolation = checkDealbreakerViolation(candidate.preferences, custProf);
  if (candDealbreakerViolation) {
    return { eligible: false, reason: `Candidate dealbreaker: ${candDealbreakerViolation}` };
  }

  return { eligible: true };
}

/**
 * Checks whether a person's profile violates explicit dealbreakers in preferences.
 * Returns violation reason string if violated, or null if passed.
 */
export function checkDealbreakerViolation(
  preferences: PartnerPreferences,
  person: PersonProfile
): string | null {
  const dealbreakers = preferences.dealbreakers || [];

  // 1. Smoking dealbreaker
  const smokingDealbreaker =
    dealbreakers.some((d) => d.toLowerCase().includes("smoke") || d.toLowerCase().includes("smoking")) ||
    preferences.smokingPreference?.importance === "DEALBREAKER";

  if (smokingDealbreaker) {
    const allowed = preferences.smokingPreference?.values || ["NON_SMOKER"];
    const smoking = person.lifestyle?.smoking;
    if (smoking && smoking !== "PREFERS_NOT_TO_SAY" && !allowed.includes(smoking)) {
      return `Smoking status '${smoking}' violates smoking dealbreaker`;
    }
  }

  // 2. Dietary dealbreaker
  const dietaryDealbreaker =
    dealbreakers.some((d) => d.toLowerCase().includes("diet") || d.toLowerCase().includes("veg")) ||
    preferences.dietaryPreference?.importance === "DEALBREAKER";

  if (dietaryDealbreaker) {
    const allowed = preferences.dietaryPreference?.values || ["VEGETARIAN", "VEGAN", "JAIN"];
    const diet = person.lifestyle?.dietaryPreference;
    if (diet && diet !== "PREFERS_NOT_TO_SAY" && !allowed.includes(diet)) {
      return `Diet '${diet}' violates dietary dealbreaker`;
    }
  }

  // 3. Marital status dealbreaker
  if (preferences.preferredMaritalStatuses?.importance === "DEALBREAKER") {
    const allowed = preferences.preferredMaritalStatuses.values;
    const marital = person.maritalStatus;
    if (allowed.length > 0 && marital && !allowed.includes(marital)) {
      return `Marital status '${marital}' violates dealbreaker`;
    }
  }

  // 4. Age range dealbreaker
  if (preferences.preferredAgeRange?.importance === "DEALBREAKER") {
    const age = calculateAge(person.dateOfBirth);
    const { min, max } = preferences.preferredAgeRange;
    if (age !== null) {
      if (min !== null && age < min) {
        return `Age ${age} is below minimum dealbreaker age ${min}`;
      }
      if (max !== null && age > max) {
        return `Age ${age} is above maximum dealbreaker age ${max}`;
      }
    }
  }

  // 5. Height range dealbreaker
  if (preferences.preferredHeightRange?.importance === "DEALBREAKER") {
    const { min, max } = preferences.preferredHeightRange;
    const height = person.heightCm;
    if (height) {
      if (min !== null && height < min) {
        return `Height ${height}cm is below minimum dealbreaker height ${min}cm`;
      }
      if (max !== null && height > max) {
        return `Height ${height}cm is above maximum dealbreaker height ${max}cm`;
      }
    }
  }

  // 6. Location dealbreaker
  if (preferences.preferredLocations?.importance === "DEALBREAKER") {
    const allowed = preferences.preferredLocations.values.map((v) => v.toLowerCase().trim());
    const city = person.location?.city?.toLowerCase().trim();
    if (allowed.length > 0 && city && !allowed.includes(city)) {
      return `City '${person.location?.city}' violates location dealbreaker`;
    }
  }

  // 7. Religion dealbreaker
  if (preferences.preferredReligions?.importance === "DEALBREAKER") {
    const allowed = preferences.preferredReligions.values.map((v) => v.toLowerCase().trim());
    const religion = person.culturalBackground?.religion?.toLowerCase().trim();
    if (allowed.length > 0 && religion && !allowed.includes(religion)) {
      return `Religion '${person.culturalBackground?.religion}' violates religion dealbreaker`;
    }
  }

  // 8. Children preference dealbreaker
  if (preferences.childrenPreference?.importance === "DEALBREAKER") {
    const pref = preferences.childrenPreference.value;
    const candidateWants = person.familyPlanning?.wantsChildren;
    if (pref && candidateWants) {
      if (
        (pref === "WANTS_CHILDREN" && candidateWants === "DOES_NOT_WANT_CHILDREN") ||
        (pref === "DOES_NOT_WANT_CHILDREN" && candidateWants === "WANTS_CHILDREN")
      ) {
        return `Children stance '${candidateWants}' violates dealbreaker`;
      }
    }
  }

  return null;
}
