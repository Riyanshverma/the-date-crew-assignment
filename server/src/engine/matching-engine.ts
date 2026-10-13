import type {
  ComparisonResult,
  CustomerRecord,
  MatchClassification,
  MatchRecord,
  PreferenceEvidence,
  RankedCandidate,
  MatchingRecommendationsResponse
} from "../../../shared/contracts.js";
import {
  MALE_STRATEGY_WEIGHTS,
  FEMALE_STRATEGY_WEIGHTS
} from "./weights.js";
import { evaluateEligibility } from "./eligibility.js";
import {
  getComparisonScore,
  compareAge,
  compareMaleDirectionalAge,
  compareHeight,
  compareMaleDirectionalHeight,
  compareIncome,
  compareMaleDirectionalIncome,
  compareLocation,
  compareMaritalStatus,
  compareReligion,
  compareCommunity,
  compareEducation,
  compareProfession,
  compareRelationshipGoals,
  compareChildrenPreference,
  compareRelocation,
  compareCoreValues,
  compareHobbies,
  compareDietary,
  compareSmoking,
  compareDrinking
} from "./comparators.js";

/**
 * Computes category fit (0-100) from list of comparison evidences.
 * Returns null if no usable comparisons exist in this category.
 */
function computeCategoryFit(evidences: PreferenceEvidence[]): number | null {
  let scoreSum = 0;
  let usableCount = 0;

  for (const ev of evidences) {
    const val = getComparisonScore(ev.result);
    if (val !== null) {
      scoreSum += val;
      usableCount++;
    }
  }

  if (usableCount === 0) return null;
  return (scoreSum / usableCount) * 100;
}

/**
 * Calculates score percentage for an arbitrary list of evidences.
 */
function computeAverageFit(evidences: PreferenceEvidence[]): number {
  let scoreSum = 0;
  let usableCount = 0;

  for (const ev of evidences) {
    const val = getComparisonScore(ev.result);
    if (val !== null) {
      scoreSum += val;
      usableCount++;
    }
  }

  if (usableCount === 0) return 0;
  return Math.round((scoreSum / usableCount) * 100);
}

/**
 * Evaluates candidate against customer using mvp-v1 deterministic formulas.
 */
export function scoreCandidate(
  customer: CustomerRecord,
  candidate: CustomerRecord
): RankedCandidate {
  const custProf = customer.profile;
  const candProf = candidate.profile;
  const isMaleCustomer = custProf.gender === "MAN";

  // 1. Run Customer -> Candidate comparisons
  const customerToCandidateEvidences: PreferenceEvidence[] = [
    compareAge(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE"),
    compareHeight(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE"),
    compareIncome(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE"),
    compareLocation(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE"),
    compareMaritalStatus(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE"),
    compareReligion(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE"),
    compareCommunity(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE"),
    compareEducation(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE"),
    compareProfession(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE"),
    compareRelationshipGoals(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE"),
    compareChildrenPreference(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE"),
    compareRelocation(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE"),
    compareCoreValues(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE"),
    compareHobbies(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE"),
    compareDietary(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE"),
    compareSmoking(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE"),
    compareDrinking(customer.preferences, candProf, "CUSTOMER_TO_CANDIDATE")
  ];

  // 2. Run Candidate -> Customer reverse comparisons
  const candidateToCustomerEvidences: PreferenceEvidence[] = [
    compareAge(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER"),
    compareHeight(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER"),
    compareIncome(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER"),
    compareLocation(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER"),
    compareMaritalStatus(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER"),
    compareReligion(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER"),
    compareCommunity(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER"),
    compareEducation(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER"),
    compareProfession(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER"),
    compareRelationshipGoals(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER"),
    compareChildrenPreference(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER"),
    compareRelocation(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER"),
    compareCoreValues(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER"),
    compareHobbies(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER"),
    compareDietary(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER"),
    compareSmoking(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER"),
    compareDrinking(candidate.preferences, custProf, "CANDIDATE_TO_CUSTOMER")
  ];

  // Map evidences by field for categorized aggregation
  const cMap = new Map(customerToCandidateEvidences.map((e) => [e.field, e]));

  // Category buckets based on strategy
  const categoryFits: { name: string; weight: number; fit: number | null }[] = [];

  if (isMaleCustomer) {
    // === MALE STRATEGY (ARCHITECTURE.md Section 9) ===
    const directionalAge = compareMaleDirectionalAge(custProf, candProf, customer.preferences);
    const directionalIncome = compareMaleDirectionalIncome(custProf, candProf, customer.preferences);
    const directionalHeight = compareMaleDirectionalHeight(custProf, candProf, customer.preferences);

    // 1. Customer general preference fit (25%) - excludes dedicated categories
    const genEvidences = [
      cMap.get("location")!,
      cMap.get("maritalStatus")!,
      cMap.get("religion")!,
      cMap.get("community")!,
      cMap.get("relocation")!
    ].filter(Boolean);
    categoryFits.push({
      name: "customerGeneralPreference",
      weight: MALE_STRATEGY_WEIGHTS.customerGeneralPreference,
      fit: computeCategoryFit(genEvidences)
    });

    // 2. Candidate reverse general fit (15%)
    categoryFits.push({
      name: "candidateReverseGeneralPreference",
      weight: MALE_STRATEGY_WEIGHTS.candidateReverseGeneralPreference,
      fit: computeCategoryFit(candidateToCustomerEvidences)
    });

    // 3. Relationship goals and family planning (20%)
    categoryFits.push({
      name: "relationshipGoalsFamily",
      weight: MALE_STRATEGY_WEIGHTS.relationshipGoalsFamily,
      fit: computeCategoryFit([cMap.get("relationshipGoal")!, cMap.get("children")!].filter(Boolean))
    });

    // 4. Younger-age alignment (8%)
    categoryFits.push({
      name: "youngerAgeAlignment",
      weight: MALE_STRATEGY_WEIGHTS.youngerAgeAlignment,
      fit: computeCategoryFit([directionalAge])
    });

    // 5. Lower-income alignment (7%)
    categoryFits.push({
      name: "lowerIncomeAlignment",
      weight: MALE_STRATEGY_WEIGHTS.lowerIncomeAlignment,
      fit: computeCategoryFit([directionalIncome])
    });

    // 6. Shorter-height alignment (5%)
    categoryFits.push({
      name: "shorterHeightAlignment",
      weight: MALE_STRATEGY_WEIGHTS.shorterHeightAlignment,
      fit: computeCategoryFit([directionalHeight])
    });

    // 7. Core values and priorities (10%)
    categoryFits.push({
      name: "coreValuesPriorities",
      weight: MALE_STRATEGY_WEIGHTS.coreValuesPriorities,
      fit: computeCategoryFit([cMap.get("coreValues")!].filter(Boolean))
    });

    // 8. Career and education (5%)
    categoryFits.push({
      name: "careerEducation",
      weight: MALE_STRATEGY_WEIGHTS.careerEducation,
      fit: computeCategoryFit([cMap.get("education")!, cMap.get("profession")!].filter(Boolean))
    });

    // 9. Lifestyle and interests (5%)
    categoryFits.push({
      name: "lifestyleInterests",
      weight: MALE_STRATEGY_WEIGHTS.lifestyleInterests,
      fit: computeCategoryFit(
        [
          cMap.get("dietary")!,
          cMap.get("smoking")!,
          cMap.get("drinking")!,
          cMap.get("hobbies")!
        ].filter(Boolean)
      )
    });
  } else {
    // === FEMALE STRATEGY (ARCHITECTURE.md Section 9) ===
    // 1. Customer general preference fit (25%) - excludes dedicated categories
    const genEvidences = [
      cMap.get("age")!,
      cMap.get("height")!,
      cMap.get("maritalStatus")!,
      cMap.get("religion")!,
      cMap.get("community")!
    ].filter(Boolean);
    categoryFits.push({
      name: "customerGeneralPreference",
      weight: FEMALE_STRATEGY_WEIGHTS.customerGeneralPreference,
      fit: computeCategoryFit(genEvidences)
    });

    // 2. Candidate reverse general fit (15%)
    categoryFits.push({
      name: "candidateReverseGeneralPreference",
      weight: FEMALE_STRATEGY_WEIGHTS.candidateReverseGeneralPreference,
      fit: computeCategoryFit(candidateToCustomerEvidences)
    });

    // 3. Relationship goals and family planning (20%)
    categoryFits.push({
      name: "relationshipGoalsFamily",
      weight: FEMALE_STRATEGY_WEIGHTS.relationshipGoalsFamily,
      fit: computeCategoryFit([cMap.get("relationshipGoal")!, cMap.get("children")!].filter(Boolean))
    });

    // 4. Professional and career compatibility (12%)
    categoryFits.push({
      name: "professionalCareer",
      weight: FEMALE_STRATEGY_WEIGHTS.professionalCareer,
      fit: computeCategoryFit([cMap.get("profession")!, cMap.get("income")!].filter(Boolean))
    });

    // 5. Core values and priorities (10%)
    categoryFits.push({
      name: "coreValuesPriorities",
      weight: FEMALE_STRATEGY_WEIGHTS.coreValuesPriorities,
      fit: computeCategoryFit([cMap.get("coreValues")!].filter(Boolean))
    });

    // 6. Location and relocation compatibility (8%)
    categoryFits.push({
      name: "locationRelocation",
      weight: FEMALE_STRATEGY_WEIGHTS.locationRelocation,
      fit: computeCategoryFit([cMap.get("location")!, cMap.get("relocation")!].filter(Boolean))
    });

    // 7. Lifestyle and interests (5%)
    categoryFits.push({
      name: "lifestyleInterests",
      weight: FEMALE_STRATEGY_WEIGHTS.lifestyleInterests,
      fit: computeCategoryFit(
        [
          cMap.get("dietary")!,
          cMap.get("smoking")!,
          cMap.get("drinking")!,
          cMap.get("hobbies")!
        ].filter(Boolean)
      )
    });

    // 8. Education alignment (5%)
    categoryFits.push({
      name: "educationAlignment",
      weight: FEMALE_STRATEGY_WEIGHTS.educationAlignment,
      fit: computeCategoryFit([cMap.get("education")!].filter(Boolean))
    });
  }

  // Compute overall score with weight renormalization
  let weightedScoreSum = 0;
  let availableWeight = 0;

  for (const cat of categoryFits) {
    if (cat.fit !== null) {
      weightedScoreSum += cat.weight * cat.fit;
      availableWeight += cat.weight;
    }
  }

  const overallScore =
    availableWeight > 0 ? Math.round(weightedScoreSum / availableWeight) : 0;
  const scoreCoverage = Math.round(availableWeight); // Total weight configured is 100

  // Diagnostic fits
  const customerPreferenceFit = computeAverageFit(customerToCandidateEvidences);
  const reversePreferenceFit = computeAverageFit(candidateToCustomerEvidences);

  // Derive Match Classifications
  const classifications: MatchClassification[] = [];
  const isPreferred = customerPreferenceFit >= 70;
  const isReverse = reversePreferenceFit >= 70;

  if (isPreferred && isReverse) {
    classifications.push("TWO_WAY");
    classifications.push("PREFERRED");
    classifications.push("REVERSE");
  } else if (isPreferred) {
    classifications.push("PREFERRED");
  } else if (isReverse) {
    classifications.push("REVERSE");
  } else {
    // Passes dealbreakers but falls into broader preference matches
    classifications.push("BROADER");
  }

  // Partition evidences for rich structured review
  const allEvidences = [...customerToCandidateEvidences];
  const matchedPreferences = allEvidences.filter(
    (e) => e.result === "MATCH" || e.result === "PARTIAL_MATCH"
  );
  const differences = allEvidences.filter((e) => e.result === "NO_MATCH");
  const unknowns = allEvidences.filter((e) => e.result === "UNKNOWN");

  return {
    candidate: candProf,
    rank: 0, // Assigned after sorting
    score: overallScore,
    customerPreferenceFit,
    reversePreferenceFit,
    classifications,
    matchedPreferences,
    differences,
    unknowns,
    scoreCoverage
  };
}

/**
 * Deterministic candidate sorting with 2-point tie breaking:
 * 1. Score descending
 * 2. If within 2 points:
 *    a. Prefer TWO_WAY classification
 *    b. Prefer higher customerPreferenceFit
 *    c. Deterministic candidate ID ascending
 */
export function rankCandidates(candidates: RankedCandidate[]): RankedCandidate[] {
  const sorted = [...candidates].sort((a, b) => {
    const scoreDiff = b.score - a.score;
    if (Math.abs(scoreDiff) > 2) {
      return scoreDiff;
    }

    // Within 2 points tie breaking:
    // a. Prefer TWO_WAY alignment
    const aTwoWay = a.classifications.includes("TWO_WAY") ? 1 : 0;
    const bTwoWay = b.classifications.includes("TWO_WAY") ? 1 : 0;
    if (aTwoWay !== bTwoWay) {
      return bTwoWay - aTwoWay;
    }

    // b. Prefer higher customerPreferenceFit
    if (a.customerPreferenceFit !== b.customerPreferenceFit) {
      return b.customerPreferenceFit - a.customerPreferenceFit;
    }

    // c. Deterministic candidate ID ascending
    return a.candidate.id.localeCompare(b.candidate.id);
  });

  // Assign 1-indexed ranks
  return sorted.map((c, idx) => ({
    ...c,
    rank: idx + 1
  }));
}

/**
 * Main Recommendation Engine function:
 * Loads pool, applies exclusions & dealbreakers, scores candidates, and ranks them.
 */
export function runMatchingEngine(
  customer: CustomerRecord,
  allCustomers: CustomerRecord[],
  existingMatches: MatchRecord[]
): MatchingRecommendationsResponse {
  const strategy = customer.profile.gender === "MAN" ? "MALE_STRATEGY" : "FEMALE_STRATEGY";

  let totalEvaluated = 0;
  const eligibleCandidates: CustomerRecord[] = [];

  for (const candidate of allCustomers) {
    if (candidate.profile.id === customer.profile.id) continue;
    totalEvaluated++;

    const eligibility = evaluateEligibility(customer, candidate, existingMatches);
    if (eligibility.eligible) {
      eligibleCandidates.push(candidate);
    }
  }

  // Score all eligible candidates
  const scored = eligibleCandidates.map((cand) => scoreCandidate(customer, cand));

  // Rank deterministically
  const ranked = rankCandidates(scored);

  return {
    customerId: customer.profile.id,
    customerName: `${customer.profile.firstName} ${customer.profile.lastName}`,
    strategy,
    totalEvaluated,
    totalEligible: eligibleCandidates.length,
    candidates: ranked
  };
}
