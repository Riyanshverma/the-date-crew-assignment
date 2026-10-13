import type {
  ComparisonResult,
  PreferenceEvidence,
  PreferenceImportance,
  PersonProfile,
  PartnerPreferences
} from "../../../shared/contracts.js";
import { calculateAge } from "../../../shared/contracts.js";

/**
 * Value map for scoring comparisons:
 * MATCH = 1.0, PARTIAL_MATCH = 0.5, NO_MATCH = 0.0
 * UNKNOWN and NOT_APPLICABLE are excluded from numerator and denominator.
 */
export function getComparisonScore(result: ComparisonResult): number | null {
  switch (result) {
    case "MATCH":
      return 1.0;
    case "PARTIAL_MATCH":
      return 0.5;
    case "NO_MATCH":
      return 0.0;
    case "UNKNOWN":
    case "NOT_APPLICABLE":
      return null;
  }
}

/**
 * Age comparison:
 * Checks candidate age against customer's preferredAgeRange.
 */
export function compareAge(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const age = calculateAge(person.dateOfBirth);
  const range = preferences.preferredAgeRange;
  const importance = range?.importance ?? "FLEXIBLE";

  if (age === null) {
    return {
      field: "age",
      label: "Age Range",
      result: "UNKNOWN",
      customerValue: range,
      candidateValue: null,
      direction,
      importance,
      explanation: "Candidate date of birth is unknown or invalid."
    };
  }

  const { min, max } = range || { min: null, max: null };
  if (min === null && max === null) {
    return {
      field: "age",
      label: "Age Range",
      result: "NOT_APPLICABLE",
      customerValue: "Open to any age",
      candidateValue: `${age} yrs`,
      direction,
      importance,
      explanation: "No specific age range requested."
    };
  }

  const minVal = min ?? 0;
  const maxVal = max ?? 120;

  if (age >= minVal && age <= maxVal) {
    return {
      field: "age",
      label: "Age Range",
      result: "MATCH",
      customerValue: `${minVal} - ${maxVal} yrs`,
      candidateValue: `${age} yrs`,
      direction,
      importance,
      explanation: `Age (${age} yrs) is within preferred range (${minVal}–${maxVal} yrs).`
    };
  }

  // Allow broader tolerance of +/- 2 years
  if (age >= minVal - 2 && age <= maxVal + 2) {
    return {
      field: "age",
      label: "Age Range",
      result: "PARTIAL_MATCH",
      customerValue: `${minVal} - ${maxVal} yrs`,
      candidateValue: `${age} yrs`,
      direction,
      importance,
      explanation: `Age (${age} yrs) is within 2 years of preferred range (${minVal}–${maxVal} yrs).`
    };
  }

  return {
    field: "age",
    label: "Age Range",
    result: "NO_MATCH",
    customerValue: `${minVal} - ${maxVal} yrs`,
    candidateValue: `${age} yrs`,
    direction,
    importance,
    explanation: `Age (${age} yrs) falls outside preferred range (${minVal}–${maxVal} yrs).`
  };
}

/**
 * Male Directional Age Signal:
 * Explicit stated preferences take precedence; otherwise soft signal: younger = MATCH, equal = PARTIAL, older = NO_MATCH.
 */
export function compareMaleDirectionalAge(
  maleCustomer: PersonProfile,
  femaleCandidate: PersonProfile,
  preferences: PartnerPreferences
): PreferenceEvidence {
  const maleAge = calculateAge(maleCustomer.dateOfBirth);
  const femaleAge = calculateAge(femaleCandidate.dateOfBirth);
  const range = preferences.preferredAgeRange;

  // Stated explicit preference takes precedence if specific range given with importance
  if (range && (range.min !== null || range.max !== null) && range.importance !== "FLEXIBLE") {
    return compareAge(preferences, femaleCandidate, "CUSTOMER_TO_CANDIDATE");
  }

  if (maleAge === null || femaleAge === null) {
    return {
      field: "youngerAge",
      label: "Younger-Age Alignment",
      result: "UNKNOWN",
      customerValue: maleAge,
      candidateValue: femaleAge,
      direction: "CUSTOMER_TO_CANDIDATE",
      importance: "FLEXIBLE",
      explanation: "Age information missing for directional age comparison."
    };
  }

  if (femaleAge < maleAge) {
    return {
      field: "youngerAge",
      label: "Younger-Age Alignment",
      result: "MATCH",
      customerValue: `${maleAge} yrs`,
      candidateValue: `${femaleAge} yrs`,
      direction: "CUSTOMER_TO_CANDIDATE",
      importance: "FLEXIBLE",
      explanation: `Candidate is ${maleAge - femaleAge} years younger than customer.`
    };
  }

  if (femaleAge === maleAge) {
    return {
      field: "youngerAge",
      label: "Younger-Age Alignment",
      result: "PARTIAL_MATCH",
      customerValue: `${maleAge} yrs`,
      candidateValue: `${femaleAge} yrs`,
      direction: "CUSTOMER_TO_CANDIDATE",
      importance: "FLEXIBLE",
      explanation: `Candidate is the same age (${maleAge} yrs) as customer.`
    };
  }

  return {
    field: "youngerAge",
    label: "Younger-Age Alignment",
    result: "NO_MATCH",
    customerValue: `${maleAge} yrs`,
    candidateValue: `${femaleAge} yrs`,
    direction: "CUSTOMER_TO_CANDIDATE",
    importance: "FLEXIBLE",
    explanation: `Candidate is ${femaleAge - maleAge} years older than customer.`
  };
}

/**
 * Height comparison:
 * Evaluates candidate height against preferredHeightRange.
 */
export function compareHeight(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const height = person.heightCm;
  const range = preferences.preferredHeightRange;
  const importance = range?.importance ?? "FLEXIBLE";

  if (!height) {
    return {
      field: "height",
      label: "Height Range",
      result: "UNKNOWN",
      customerValue: range,
      candidateValue: null,
      direction,
      importance,
      explanation: "Candidate height not specified."
    };
  }

  const { min, max } = range || { min: null, max: null };
  if (min === null && max === null) {
    return {
      field: "height",
      label: "Height Range",
      result: "NOT_APPLICABLE",
      customerValue: "Open to any height",
      candidateValue: `${height} cm`,
      direction,
      importance,
      explanation: "No specific height range requested."
    };
  }

  const minVal = min ?? 100;
  const maxVal = max ?? 220;

  if (height >= minVal && height <= maxVal) {
    return {
      field: "height",
      label: "Height Range",
      result: "MATCH",
      customerValue: `${minVal} - ${maxVal} cm`,
      candidateValue: `${height} cm`,
      direction,
      importance,
      explanation: `Height (${height} cm) is within preferred range (${minVal}–${maxVal} cm).`
    };
  }

  if (height >= minVal - 5 && height <= maxVal + 5) {
    return {
      field: "height",
      label: "Height Range",
      result: "PARTIAL_MATCH",
      customerValue: `${minVal} - ${maxVal} cm`,
      candidateValue: `${height} cm`,
      direction,
      importance,
      explanation: `Height (${height} cm) is within 5 cm of preferred range.`
    };
  }

  return {
    field: "height",
    label: "Height Range",
    result: "NO_MATCH",
    customerValue: `${minVal} - ${maxVal} cm`,
    candidateValue: `${height} cm`,
    direction,
    importance,
    explanation: `Height (${height} cm) falls outside preferred range (${minVal}–${maxVal} cm).`
  };
}

/**
 * Male Directional Height Signal:
 * Explicit stated preferences take precedence; otherwise soft signal: shorter = MATCH, equal = PARTIAL, taller = NO_MATCH.
 */
export function compareMaleDirectionalHeight(
  maleCustomer: PersonProfile,
  femaleCandidate: PersonProfile,
  preferences: PartnerPreferences
): PreferenceEvidence {
  const maleHeight = maleCustomer.heightCm;
  const femaleHeight = femaleCandidate.heightCm;
  const range = preferences.preferredHeightRange;

  if (range && (range.min !== null || range.max !== null) && range.importance !== "FLEXIBLE") {
    return compareHeight(preferences, femaleCandidate, "CUSTOMER_TO_CANDIDATE");
  }

  if (!maleHeight || !femaleHeight) {
    return {
      field: "shorterHeight",
      label: "Shorter-Height Alignment",
      result: "UNKNOWN",
      customerValue: maleHeight ? `${maleHeight} cm` : null,
      candidateValue: femaleHeight ? `${femaleHeight} cm` : null,
      direction: "CUSTOMER_TO_CANDIDATE",
      importance: "FLEXIBLE",
      explanation: "Height information missing for directional height comparison."
    };
  }

  if (femaleHeight < maleHeight) {
    return {
      field: "shorterHeight",
      label: "Shorter-Height Alignment",
      result: "MATCH",
      customerValue: `${maleHeight} cm`,
      candidateValue: `${femaleHeight} cm`,
      direction: "CUSTOMER_TO_CANDIDATE",
      importance: "FLEXIBLE",
      explanation: `Candidate is ${maleHeight - femaleHeight} cm shorter than customer.`
    };
  }

  if (femaleHeight === maleHeight) {
    return {
      field: "shorterHeight",
      label: "Shorter-Height Alignment",
      result: "PARTIAL_MATCH",
      customerValue: `${maleHeight} cm`,
      candidateValue: `${femaleHeight} cm`,
      direction: "CUSTOMER_TO_CANDIDATE",
      importance: "FLEXIBLE",
      explanation: `Candidate is the same height (${maleHeight} cm) as customer.`
    };
  }

  return {
    field: "shorterHeight",
    label: "Shorter-Height Alignment",
    result: "NO_MATCH",
    customerValue: `${maleHeight} cm`,
    candidateValue: `${femaleHeight} cm`,
    direction: "CUSTOMER_TO_CANDIDATE",
    importance: "FLEXIBLE",
    explanation: `Candidate is ${femaleHeight - maleHeight} cm taller than customer.`
  };
}

/**
 * Income comparison:
 * Evaluates candidate income against preferredIncomeRange.
 */
export function compareIncome(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const income = person.career?.annualIncome;
  const range = preferences.preferredIncomeRange;
  const importance = range?.importance ?? "FLEXIBLE";

  if (income === null || income === undefined) {
    return {
      field: "income",
      label: "Income Range",
      result: "UNKNOWN",
      customerValue: range,
      candidateValue: null,
      direction,
      importance,
      explanation: "Candidate annual income not specified."
    };
  }

  const { min, max } = range || { min: null, max: null };
  if (min === null && max === null) {
    return {
      field: "income",
      label: "Income Range",
      result: "NOT_APPLICABLE",
      customerValue: "No income preference specified",
      candidateValue: `₹${(income / 100000).toFixed(1)} L/yr`,
      direction,
      importance,
      explanation: "No specific income range requested."
    };
  }

  const minVal = min ?? 0;
  const maxVal = max ?? Infinity;

  if (income >= minVal && income <= maxVal) {
    return {
      field: "income",
      label: "Income Range",
      result: "MATCH",
      customerValue: `Min ₹${(minVal / 100000).toFixed(0)} L/yr`,
      candidateValue: `₹${(income / 100000).toFixed(1)} L/yr`,
      direction,
      importance,
      explanation: `Annual income (₹${(income / 100000).toFixed(1)} L) satisfies preferred criteria.`
    };
  }

  return {
    field: "income",
    label: "Income Range",
    result: "NO_MATCH",
    customerValue: `Min ₹${(minVal / 100000).toFixed(0)} L/yr`,
    candidateValue: `₹${(income / 100000).toFixed(1)} L/yr`,
    direction,
    importance,
    explanation: `Annual income (₹${(income / 100000).toFixed(1)} L) falls outside preferred range.`
  };
}

/**
 * Male Directional Income Signal:
 * Explicit stated preferences take precedence; otherwise soft signal: lower = MATCH, equal = PARTIAL, higher = NO_MATCH.
 */
export function compareMaleDirectionalIncome(
  maleCustomer: PersonProfile,
  femaleCandidate: PersonProfile,
  preferences: PartnerPreferences
): PreferenceEvidence {
  const maleIncome = maleCustomer.career?.annualIncome;
  const femaleIncome = femaleCandidate.career?.annualIncome;
  const range = preferences.preferredIncomeRange;

  if (range && (range.min !== null || range.max !== null) && range.importance !== "FLEXIBLE") {
    return compareIncome(preferences, femaleCandidate, "CUSTOMER_TO_CANDIDATE");
  }

  if (maleIncome === null || maleIncome === undefined || femaleIncome === null || femaleIncome === undefined) {
    return {
      field: "lowerIncome",
      label: "Lower-Income Alignment",
      result: "UNKNOWN",
      customerValue: maleIncome ? `₹${(maleIncome / 100000).toFixed(1)} L` : null,
      candidateValue: femaleIncome ? `₹${(femaleIncome / 100000).toFixed(1)} L` : null,
      direction: "CUSTOMER_TO_CANDIDATE",
      importance: "FLEXIBLE",
      explanation: "Income data missing for directional income comparison."
    };
  }

  if (femaleIncome < maleIncome) {
    return {
      field: "lowerIncome",
      label: "Lower-Income Alignment",
      result: "MATCH",
      customerValue: `₹${(maleIncome / 100000).toFixed(1)} L/yr`,
      candidateValue: `₹${(femaleIncome / 100000).toFixed(1)} L/yr`,
      direction: "CUSTOMER_TO_CANDIDATE",
      importance: "FLEXIBLE",
      explanation: `Candidate income is lower than customer income.`
    };
  }

  if (femaleIncome === maleIncome) {
    return {
      field: "lowerIncome",
      label: "Lower-Income Alignment",
      result: "PARTIAL_MATCH",
      customerValue: `₹${(maleIncome / 100000).toFixed(1)} L/yr`,
      candidateValue: `₹${(femaleIncome / 100000).toFixed(1)} L/yr`,
      direction: "CUSTOMER_TO_CANDIDATE",
      importance: "FLEXIBLE",
      explanation: `Candidate income matches customer income.`
    };
  }

  return {
    field: "lowerIncome",
    label: "Lower-Income Alignment",
    result: "NO_MATCH",
    customerValue: `₹${(maleIncome / 100000).toFixed(1)} L/yr`,
    candidateValue: `₹${(femaleIncome / 100000).toFixed(1)} L/yr`,
    direction: "CUSTOMER_TO_CANDIDATE",
    importance: "FLEXIBLE",
    explanation: `Candidate income is higher than customer income.`
  };
}

/**
 * Location / City comparison
 */
export function compareLocation(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const candidateCity = person.location?.city?.trim();
  const preferred = preferences.preferredLocations?.values || [];
  const importance = preferences.preferredLocations?.importance ?? "FLEXIBLE";

  if (!candidateCity) {
    return {
      field: "location",
      label: "Location / City",
      result: "UNKNOWN",
      customerValue: preferred,
      candidateValue: null,
      direction,
      importance,
      explanation: "Candidate city not specified."
    };
  }

  if (preferred.length === 0) {
    return {
      field: "location",
      label: "Location / City",
      result: "NOT_APPLICABLE",
      customerValue: "Open to any location",
      candidateValue: candidateCity,
      direction,
      importance,
      explanation: "Open to any city location."
    };
  }

  const match = preferred.some((c) => c.toLowerCase().trim() === candidateCity.toLowerCase());
  return {
    field: "location",
    label: "Location / City",
    result: match ? "MATCH" : "NO_MATCH",
    customerValue: preferred.join(", "),
    candidateValue: candidateCity,
    direction,
    importance,
    explanation: match
      ? `Candidate city (${candidateCity}) matches preferred locations.`
      : `Candidate city (${candidateCity}) is not in preferred locations list.`
  };
}

/**
 * Marital Status comparison
 */
export function compareMaritalStatus(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const candidateStatus = person.maritalStatus;
  const preferred = preferences.preferredMaritalStatuses?.values || [];
  const importance = preferences.preferredMaritalStatuses?.importance ?? "FLEXIBLE";

  if (!candidateStatus) {
    return {
      field: "maritalStatus",
      label: "Marital Status",
      result: "UNKNOWN",
      customerValue: preferred,
      candidateValue: null,
      direction,
      importance,
      explanation: "Candidate marital status not specified."
    };
  }

  if (preferred.length === 0) {
    return {
      field: "maritalStatus",
      label: "Marital Status",
      result: "NOT_APPLICABLE",
      customerValue: "Open to any marital status",
      candidateValue: candidateStatus,
      direction,
      importance,
      explanation: "No marital status preference specified."
    };
  }

  const match = preferred.includes(candidateStatus);
  return {
    field: "maritalStatus",
    label: "Marital Status",
    result: match ? "MATCH" : "NO_MATCH",
    customerValue: preferred.join(", "),
    candidateValue: candidateStatus,
    direction,
    importance,
    explanation: match
      ? `Marital status (${candidateStatus}) matches preference.`
      : `Marital status (${candidateStatus}) does not match preference.`
  };
}

/**
 * Religion comparison
 */
export function compareReligion(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const candidateReligion = person.culturalBackground?.religion?.trim();
  const preferred = preferences.preferredReligions?.values || [];
  const importance = preferences.preferredReligions?.importance ?? "FLEXIBLE";

  if (!candidateReligion) {
    return {
      field: "religion",
      label: "Religion",
      result: "UNKNOWN",
      customerValue: preferred,
      candidateValue: null,
      direction,
      importance,
      explanation: "Candidate religion not specified."
    };
  }

  if (preferred.length === 0) {
    return {
      field: "religion",
      label: "Religion",
      result: "NOT_APPLICABLE",
      customerValue: "Open to all religions",
      candidateValue: candidateReligion,
      direction,
      importance,
      explanation: "No religion preference specified."
    };
  }

  const match = preferred.some((r) => r.toLowerCase().trim() === candidateReligion.toLowerCase());
  return {
    field: "religion",
    label: "Religion",
    result: match ? "MATCH" : "NO_MATCH",
    customerValue: preferred.join(", "),
    candidateValue: candidateReligion,
    direction,
    importance,
    explanation: match
      ? `Religion (${candidateReligion}) matches preference.`
      : `Religion (${candidateReligion}) is outside preferred criteria.`
  };
}

/**
 * Community comparison
 */
export function compareCommunity(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const candidateCommunity = person.culturalBackground?.community?.trim();
  const preferred = preferences.preferredCommunities?.values || [];
  const importance = preferences.preferredCommunities?.importance ?? "FLEXIBLE";

  if (!candidateCommunity) {
    return {
      field: "community",
      label: "Community",
      result: "UNKNOWN",
      customerValue: preferred,
      candidateValue: null,
      direction,
      importance,
      explanation: "Candidate community not specified."
    };
  }

  if (preferred.length === 0) {
    return {
      field: "community",
      label: "Community",
      result: "NOT_APPLICABLE",
      customerValue: "Open to all communities",
      candidateValue: candidateCommunity,
      direction,
      importance,
      explanation: "No specific community required."
    };
  }

  const match = preferred.some((c) => c.toLowerCase().trim() === candidateCommunity.toLowerCase());
  return {
    field: "community",
    label: "Community",
    result: match ? "MATCH" : "NO_MATCH",
    customerValue: preferred.join(", "),
    candidateValue: candidateCommunity,
    direction,
    importance,
    explanation: match
      ? `Community (${candidateCommunity}) matches preference.`
      : `Community (${candidateCommunity}) is outside preferred criteria.`
  };
}

/**
 * Education comparison
 */
export function compareEducation(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const candidateEdu = person.education?.highestEducation;
  const preferred = preferences.preferredHighestEducation?.values || [];
  const importance = preferences.preferredHighestEducation?.importance ?? "FLEXIBLE";

  if (!candidateEdu) {
    return {
      field: "education",
      label: "Education",
      result: "UNKNOWN",
      customerValue: preferred,
      candidateValue: null,
      direction,
      importance,
      explanation: "Candidate education not specified."
    };
  }

  if (preferred.length === 0) {
    return {
      field: "education",
      label: "Education",
      result: "NOT_APPLICABLE",
      customerValue: "Open to any education",
      candidateValue: candidateEdu,
      direction,
      importance,
      explanation: "No specific education required."
    };
  }

  const match = preferred.includes(candidateEdu);
  return {
    field: "education",
    label: "Education",
    result: match ? "MATCH" : "NO_MATCH",
    customerValue: preferred.join(", "),
    candidateValue: candidateEdu,
    direction,
    importance,
    explanation: match
      ? `Education level (${candidateEdu}) matches preference.`
      : `Education level (${candidateEdu}) is outside preferred criteria.`
  };
}

/**
 * Profession comparison
 */
export function compareProfession(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const candidateCat = person.career?.professionCategory?.trim();
  const candidateDesig = person.career?.designation?.trim();
  const preferred = preferences.preferredProfessions?.values || [];
  const importance = preferences.preferredProfessions?.importance ?? "FLEXIBLE";

  if (!candidateCat && !candidateDesig) {
    return {
      field: "profession",
      label: "Profession",
      result: "UNKNOWN",
      customerValue: preferred,
      candidateValue: null,
      direction,
      importance,
      explanation: "Candidate profession not specified."
    };
  }

  if (preferred.length === 0) {
    return {
      field: "profession",
      label: "Profession",
      result: "NOT_APPLICABLE",
      customerValue: "Open to any profession",
      candidateValue: candidateDesig || candidateCat,
      direction,
      importance,
      explanation: "No profession preference specified."
    };
  }

  const match = preferred.some((p) => {
    const pl = p.toLowerCase().trim();
    return (
      (candidateCat && candidateCat.toLowerCase().includes(pl)) ||
      (candidateDesig && candidateDesig.toLowerCase().includes(pl))
    );
  });

  return {
    field: "profession",
    label: "Profession",
    result: match ? "MATCH" : "NO_MATCH",
    customerValue: preferred.join(", "),
    candidateValue: candidateDesig || candidateCat,
    direction,
    importance,
    explanation: match
      ? `Profession (${candidateDesig || candidateCat}) matches preference.`
      : `Profession (${candidateDesig || candidateCat}) is outside preferred list.`
  };
}

/**
 * Relationship Goals comparison
 */
export function compareRelationshipGoals(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const candidateGoal = person.relationship?.relationshipGoal;
  const preferred = preferences.relationshipGoals?.values || [];
  const importance = preferences.relationshipGoals?.importance ?? "FLEXIBLE";

  if (!candidateGoal) {
    return {
      field: "relationshipGoal",
      label: "Relationship Goal",
      result: "UNKNOWN",
      customerValue: preferred,
      candidateValue: null,
      direction,
      importance,
      explanation: "Candidate relationship goal not specified."
    };
  }

  if (preferred.length === 0) {
    return {
      field: "relationshipGoal",
      label: "Relationship Goal",
      result: "NOT_APPLICABLE",
      customerValue: "Open to discussion",
      candidateValue: candidateGoal,
      direction,
      importance,
      explanation: "No relationship goal preference specified."
    };
  }

  const match = preferred.includes(candidateGoal);
  return {
    field: "relationshipGoal",
    label: "Relationship Goal",
    result: match ? "MATCH" : "NO_MATCH",
    customerValue: preferred.join(", "),
    candidateValue: candidateGoal,
    direction,
    importance,
    explanation: match
      ? `Relationship goal (${candidateGoal}) aligns with expectations.`
      : `Relationship goal (${candidateGoal}) differs from requested goal.`
  };
}

/**
 * Children / Family Planning comparison
 */
export function compareChildrenPreference(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const candidateWants = person.familyPlanning?.wantsChildren;
  const customerWants = preferences.childrenPreference?.value;
  const importance = preferences.childrenPreference?.importance ?? "FLEXIBLE";

  if (!candidateWants) {
    return {
      field: "children",
      label: "Children Preference",
      result: "UNKNOWN",
      customerValue: customerWants,
      candidateValue: null,
      direction,
      importance,
      explanation: "Candidate children stance not specified."
    };
  }

  if (!customerWants) {
    return {
      field: "children",
      label: "Children Preference",
      result: "NOT_APPLICABLE",
      customerValue: "Open to discussion",
      candidateValue: candidateWants,
      direction,
      importance,
      explanation: "No children preference specified."
    };
  }

  if (customerWants === candidateWants) {
    return {
      field: "children",
      label: "Children Preference",
      result: "MATCH",
      customerValue: customerWants,
      candidateValue: candidateWants,
      direction,
      importance,
      explanation: `Both individuals agree on children preference (${candidateWants}).`
    };
  }

  if (
    customerWants === "OPEN_TO_DISCUSSION" ||
    candidateWants === "OPEN_TO_DISCUSSION" ||
    customerWants === "UNSURE" ||
    candidateWants === "UNSURE"
  ) {
    return {
      field: "children",
      label: "Children Preference",
      result: "PARTIAL_MATCH",
      customerValue: customerWants,
      candidateValue: candidateWants,
      direction,
      importance,
      explanation: `One or both parties are flexible/open to discussion about children.`
    };
  }

  return {
    field: "children",
    label: "Children Preference",
    result: "NO_MATCH",
    customerValue: customerWants,
    candidateValue: candidateWants,
    direction,
    importance,
    explanation: `Conflicting stances on children (${customerWants} vs ${candidateWants}).`
  };
}

/**
 * Relocation stance comparison
 */
export function compareRelocation(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const candidateReloc = person.relocation?.openToRelocate;
  const customerReloc = preferences.relocationPreference?.value;
  const importance = preferences.relocationPreference?.importance ?? "FLEXIBLE";

  if (!candidateReloc) {
    return {
      field: "relocation",
      label: "Relocation Stance",
      result: "UNKNOWN",
      customerValue: customerReloc,
      candidateValue: null,
      direction,
      importance,
      explanation: "Candidate relocation stance not specified."
    };
  }

  if (!customerReloc) {
    return {
      field: "relocation",
      label: "Relocation Stance",
      result: "NOT_APPLICABLE",
      customerValue: "Open",
      candidateValue: candidateReloc,
      direction,
      importance,
      explanation: "No relocation preference specified."
    };
  }

  if (
    (customerReloc === "WILL_RELOCATE" && candidateReloc === "YES") ||
    (customerReloc === "WILL_NOT_RELOCATE" && candidateReloc === "NO")
  ) {
    return {
      field: "relocation",
      label: "Relocation Stance",
      result: "MATCH",
      customerValue: customerReloc,
      candidateValue: candidateReloc,
      direction,
      importance,
      explanation: `Compatible relocation stance (${candidateReloc}).`
    };
  }

  if (
    customerReloc === "DEPENDS" ||
    candidateReloc === "MAYBE" ||
    customerReloc === "PREFERS_NOT_TO_SAY" ||
    candidateReloc === "YES" ||
    customerReloc === "WILL_RELOCATE"
  ) {
    return {
      field: "relocation",
      label: "Relocation Stance",
      result: "PARTIAL_MATCH",
      customerValue: customerReloc,
      candidateValue: candidateReloc,
      direction,
      importance,
      explanation: `Open to discussion regarding relocation.`
    };
  }

  return {
    field: "relocation",
    label: "Relocation Stance",
    result: "NO_MATCH",
    customerValue: customerReloc,
    candidateValue: candidateReloc,
    direction,
    importance,
    explanation: `Relocation preferences differ.`
  };
}

/**
 * Core Values comparison
 */
export function compareCoreValues(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const candidateValues = person.relationship?.coreValues || [];
  const preferredValues = preferences.coreValues?.values || [];
  const importance = preferences.coreValues?.importance ?? "FLEXIBLE";

  if (candidateValues.length === 0 || preferredValues.length === 0) {
    return {
      field: "coreValues",
      label: "Core Values",
      result: "UNKNOWN",
      customerValue: preferredValues,
      candidateValue: candidateValues,
      direction,
      importance,
      explanation: "One or both parties have not declared core values."
    };
  }

  const shared = candidateValues.filter((v) =>
    preferredValues.some((pv) => pv.toLowerCase().trim() === v.toLowerCase().trim())
  );

  if (shared.length >= 2) {
    return {
      field: "coreValues",
      label: "Core Values",
      result: "MATCH",
      customerValue: preferredValues.join(", "),
      candidateValue: candidateValues.join(", "),
      direction,
      importance,
      explanation: `Shared core values: ${shared.join(", ")}.`
    };
  }

  if (shared.length === 1) {
    return {
      field: "coreValues",
      label: "Core Values",
      result: "PARTIAL_MATCH",
      customerValue: preferredValues.join(", "),
      candidateValue: candidateValues.join(", "),
      direction,
      importance,
      explanation: `Shared core value: ${shared[0]}.`
    };
  }

  return {
    field: "coreValues",
    label: "Core Values",
    result: "NO_MATCH",
    customerValue: preferredValues.join(", "),
    candidateValue: candidateValues.join(", "),
    direction,
    importance,
    explanation: "No overlapping core values declared."
  };
}

/**
 * Hobbies and Interests comparison
 */
export function compareHobbies(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const candidateHobbies = person.lifestyle?.hobbiesInterests || [];
  const preferredHobbies = preferences.hobbiesInterests?.values || [];
  const importance = preferences.hobbiesInterests?.importance ?? "FLEXIBLE";

  if (candidateHobbies.length === 0 || preferredHobbies.length === 0) {
    return {
      field: "hobbies",
      label: "Hobbies & Interests",
      result: "UNKNOWN",
      customerValue: preferredHobbies,
      candidateValue: candidateHobbies,
      direction,
      importance,
      explanation: "One or both parties have not recorded hobbies."
    };
  }

  const shared = candidateHobbies.filter((h) =>
    preferredHobbies.some((ph) => ph.toLowerCase().trim() === h.toLowerCase().trim())
  );

  if (shared.length >= 2) {
    return {
      field: "hobbies",
      label: "Hobbies & Interests",
      result: "MATCH",
      customerValue: preferredHobbies.join(", "),
      candidateValue: candidateHobbies.join(", "),
      direction,
      importance,
      explanation: `Shared interests: ${shared.join(", ")}.`
    };
  }

  if (shared.length === 1) {
    return {
      field: "hobbies",
      label: "Hobbies & Interests",
      result: "PARTIAL_MATCH",
      customerValue: preferredHobbies.join(", "),
      candidateValue: candidateHobbies.join(", "),
      direction,
      importance,
      explanation: `Shared interest: ${shared[0]}.`
    };
  }

  return {
    field: "hobbies",
    label: "Hobbies & Interests",
    result: "NO_MATCH",
    customerValue: preferredHobbies.join(", "),
    candidateValue: candidateHobbies.join(", "),
    direction,
    importance,
    explanation: "No overlapping hobbies or leisure interests."
  };
}

/**
 * Dietary preference comparison
 */
export function compareDietary(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const candidateDiet = person.lifestyle?.dietaryPreference;
  const preferred = preferences.dietaryPreference?.values || [];
  const importance = preferences.dietaryPreference?.importance ?? "FLEXIBLE";

  if (!candidateDiet) {
    return {
      field: "dietary",
      label: "Dietary Habits",
      result: "UNKNOWN",
      customerValue: preferred,
      candidateValue: null,
      direction,
      importance,
      explanation: "Candidate diet not specified."
    };
  }

  if (preferred.length === 0) {
    return {
      field: "dietary",
      label: "Dietary Habits",
      result: "NOT_APPLICABLE",
      customerValue: "Open to all diets",
      candidateValue: candidateDiet,
      direction,
      importance,
      explanation: "No specific dietary preference requested."
    };
  }

  const match = preferred.includes(candidateDiet);
  return {
    field: "dietary",
    label: "Dietary Habits",
    result: match ? "MATCH" : "NO_MATCH",
    customerValue: preferred.join(", "),
    candidateValue: candidateDiet,
    direction,
    importance,
    explanation: match
      ? `Dietary preference (${candidateDiet}) matches expectation.`
      : `Dietary preference (${candidateDiet}) does not match requested options.`
  };
}

/**
 * Smoking preference comparison
 */
export function compareSmoking(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const candidateSmoking = person.lifestyle?.smoking;
  const preferred = preferences.smokingPreference?.values || [];
  const importance = preferences.smokingPreference?.importance ?? "FLEXIBLE";

  if (!candidateSmoking) {
    return {
      field: "smoking",
      label: "Smoking Habits",
      result: "UNKNOWN",
      customerValue: preferred,
      candidateValue: null,
      direction,
      importance,
      explanation: "Candidate smoking status not specified."
    };
  }

  if (preferred.length === 0) {
    return {
      field: "smoking",
      label: "Smoking Habits",
      result: "NOT_APPLICABLE",
      customerValue: "Open",
      candidateValue: candidateSmoking,
      direction,
      importance,
      explanation: "No smoking preference specified."
    };
  }

  const match = preferred.includes(candidateSmoking);
  return {
    field: "smoking",
    label: "Smoking Habits",
    result: match ? "MATCH" : "NO_MATCH",
    customerValue: preferred.join(", "),
    candidateValue: candidateSmoking,
    direction,
    importance,
    explanation: match
      ? `Smoking status (${candidateSmoking}) aligns with preference.`
      : `Smoking status (${candidateSmoking}) does not align with preference.`
  };
}

/**
 * Drinking preference comparison
 */
export function compareDrinking(
  preferences: PartnerPreferences,
  person: PersonProfile,
  direction: "CUSTOMER_TO_CANDIDATE" | "CANDIDATE_TO_CUSTOMER"
): PreferenceEvidence {
  const candidateDrinking = person.lifestyle?.drinking;
  const preferred = preferences.drinkingPreference?.values || [];
  const importance = preferences.drinkingPreference?.importance ?? "FLEXIBLE";

  if (!candidateDrinking) {
    return {
      field: "drinking",
      label: "Drinking Habits",
      result: "UNKNOWN",
      customerValue: preferred,
      candidateValue: null,
      direction,
      importance,
      explanation: "Candidate drinking status not specified."
    };
  }

  if (preferred.length === 0) {
    return {
      field: "drinking",
      label: "Drinking Habits",
      result: "NOT_APPLICABLE",
      customerValue: "Open",
      candidateValue: candidateDrinking,
      direction,
      importance,
      explanation: "No drinking preference specified."
    };
  }

  const match = preferred.includes(candidateDrinking);
  return {
    field: "drinking",
    label: "Drinking Habits",
    result: match ? "MATCH" : "NO_MATCH",
    customerValue: preferred.join(", "),
    candidateValue: candidateDrinking,
    direction,
    importance,
    explanation: match
      ? `Drinking status (${candidateDrinking}) aligns with preference.`
      : `Drinking status (${candidateDrinking}) does not align with preference.`
  };
}
