import { OpenRouter } from "@openrouter/sdk";
import type {
  CustomerRecord,
  RankedCandidate,
  PreferenceEvidence
} from "../../../shared/contracts.js";
import {
  MALE_STRATEGY_WEIGHTS,
  FEMALE_STRATEGY_WEIGHTS
} from "./weights.js";
import { getComparisonScore } from "./comparators.js";
import { rankCandidates } from "./matching-engine.js";

const MODEL_NAME = "nvidia/nemotron-3.5-lightning:free";

export interface SemanticDimensionResult {
  score: number; // 0.0 to 1.0
  matchType: "MATCH" | "PARTIAL_MATCH" | "NO_MATCH";
  explanation: string;
}

export interface SemanticAnalysisOutput {
  education: SemanticDimensionResult;
  profession: SemanticDimensionResult;
  coreValues: SemanticDimensionResult;
  hobbies: SemanticDimensionResult;
  overallSemanticSummary: string;
}

/**
 * Computes category fit (0-100) from list of comparison evidences.
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
 * Evaluates core values fit with baseline credit if foundational goals align.
 */
function computeCoreValuesFit(
  coreValuesEvidence: PreferenceEvidence | undefined,
  cMap: Map<string, PreferenceEvidence>
): number | null {
  const directFit = computeCategoryFit([coreValuesEvidence].filter(Boolean) as PreferenceEvidence[]);
  if (directFit !== null && directFit > 0) {
    return directFit;
  }
  if (directFit === 0) {
    const relGoal = cMap.get("relationshipGoal")?.result;
    const children = cMap.get("children")?.result;
    const reloc = cMap.get("relocation")?.result;
    const hasGoalAlign = relGoal === "MATCH" || relGoal === "PARTIAL_MATCH";
    const hasFamilyAlign = children === "MATCH" || children === "PARTIAL_MATCH";
    const hasRelocAlign = reloc === "MATCH" || reloc === "PARTIAL_MATCH";

    if (hasGoalAlign && hasFamilyAlign && hasRelocAlign) {
      return 40;
    }
  }
  return directFit;
}

/**
 * Calls OpenRouter with nvidia/nemotron-3.5-lightning:free (non-streaming, temperature 0.1)
 * with robust fallback between @openrouter/sdk and native fetch.
 */
async function callOpenRouterSemanticAnalysis(
  prompt: string,
  apiKey: string
): Promise<SemanticAnalysisOutput | null> {
  const systemMessage =
    "You are an expert, unbiased semantic matchmaking evaluator for The Date Crew. " +
    "You evaluate mutual synergy across education, career, core values, and leisure pursuits. " +
    "You MUST respond ONLY with a raw JSON object matching the requested schema. Do not enclose in markdown blocks.";

  // 1. Try via @openrouter/sdk
  try {
    const openrouter = new OpenRouter({ apiKey });
    const response = await openrouter.chat.send({
      chatRequest: {
        model: MODEL_NAME,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ],
        stream: false,
        temperature: 0.1
      }
    });

    const content = (response as { choices?: Array<{ message?: { content?: string } }> })?.choices?.[0]?.message?.content;
    if (content) {
      const parsed = parseSemanticJson(content);
      if (parsed) return parsed;
    }
  } catch (sdkErr) {
    console.warn("OpenRouter SDK call failed, falling back to direct fetch:", sdkErr instanceof Error ? sdkErr.message : sdkErr);
  }

  // 2. Direct HTTP fetch fallback
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://thedatecrew.com",
        "X-Title": "TDC Matchmaker Dashboard"
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ],
        temperature: 0.1,
        stream: false
      })
    });

    if (!res.ok) {
      console.warn(`OpenRouter HTTP error: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      return parseSemanticJson(content);
    }
  } catch (fetchErr) {
    console.warn("Direct OpenRouter fetch failed:", fetchErr instanceof Error ? fetchErr.message : fetchErr);
  }

  return null;
}

/**
 * Extracts and parses JSON from model response text.
 */
function parseSemanticJson(raw: string): SemanticAnalysisOutput | null {
  try {
    let cleaned = raw.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    }
    const parsed = JSON.parse(cleaned) as SemanticAnalysisOutput;
    if (parsed.education && parsed.profession && parsed.coreValues && parsed.hobbies) {
      return parsed;
    }
  } catch (err) {
    console.warn("Failed to parse LLM JSON output:", err);
  }
  return null;
}

/**
 * Evaluates semantic compatibility for a single candidate against client preferences.
 */
async function analyzeCandidateSemantics(
  customer: CustomerRecord,
  candidate: RankedCandidate,
  apiKey: string
): Promise<SemanticAnalysisOutput | null> {
  const custPref = customer.preferences;
  const candProf = candidate.candidate;

  // Strict Data Minimization: Send only comparison parameters, NO PII or names
  const prompt = `Compare the following client preferences and candidate profile attributes:

1. EDUCATION:
- Client Preferred Highest Education: ${JSON.stringify(custPref.preferredHighestEducation?.values || ["Open to any"])}
- Candidate Actual Education: "${candProf.education?.highestEducation || "Not specified"}"

2. CAREER & PROFESSION:
- Client Preferred Professions: ${JSON.stringify(custPref.preferredProfessions?.values || ["Open to any"])}
- Candidate Actual Category: "${candProf.career?.professionCategory || "Not specified"}"
- Candidate Actual Designation: "${candProf.career?.designation || "Not specified"}"

3. CORE VALUES:
- Client Preferred Core Values: ${JSON.stringify(custPref.coreValues?.values || ["None specified"])}
- Candidate Actual Core Values: ${JSON.stringify(candProf.relationship?.coreValues || ["None specified"])}

4. HOBBIES & LEISURE:
- Client Preferred Hobbies: ${JSON.stringify(custPref.hobbiesInterests?.values || ["None specified"])}
- Candidate Actual Hobbies: ${JSON.stringify(candProf.lifestyle?.hobbiesInterests || ["None specified"])}

EVALUATION RUBRIC:
- 0.85 - 1.00 ("MATCH"): Direct equivalence, identical or highly complementary alignment.
- 0.65 - 0.84 ("PARTIAL_MATCH"): High synergy, adjacent discipline tier (e.g. Masters to Doctorate), related industry, or shared values philosophy.
- 0.35 - 0.64 ("PARTIAL_MATCH"): Broad tolerance; different fields with reasonable accommodation.
- 0.00 - 0.34 ("NO_MATCH"): Incompatible, conflicting, or divergent priorities.

Respond ONLY with this exact JSON format:
{
  "education": { "score": 0.0 to 1.0, "matchType": "MATCH" | "PARTIAL_MATCH" | "NO_MATCH", "explanation": "1 concise sentence" },
  "profession": { "score": 0.0 to 1.0, "matchType": "MATCH" | "PARTIAL_MATCH" | "NO_MATCH", "explanation": "1 concise sentence" },
  "coreValues": { "score": 0.0 to 1.0, "matchType": "MATCH" | "PARTIAL_MATCH" | "NO_MATCH", "explanation": "1 concise sentence" },
  "hobbies": { "score": 0.0 to 1.0, "matchType": "MATCH" | "PARTIAL_MATCH" | "NO_MATCH", "explanation": "1 concise sentence" },
  "overallSemanticSummary": "1-2 sentence matchmaker synergy takeaway"
}`;

  return callOpenRouterSemanticAnalysis(prompt, apiKey);
}

/**
 * Re-scores a candidate after applying semantic insights to soft dimensions.
 */
function applySemanticEnhancements(
  customer: CustomerRecord,
  candidate: RankedCandidate,
  aiOutput: SemanticAnalysisOutput
): RankedCandidate {
  const isMaleCustomer = customer.profile.gender === "MAN";
  const enhancedFields: string[] = [];

  // Clone evidences
  const matched = [...candidate.matchedPreferences];
  const diffs = [...candidate.differences];

  const updateEvidence = (
    field: string,
    dimResult: SemanticDimensionResult
  ) => {
    // Only upgrade if semantic analysis found high synergy (>= 0.60)
    if (dimResult.score < 0.60) return;

    // Check if currently in differences (NO_MATCH)
    const diffIndex = diffs.findIndex((e) => e.field === field);
    if (diffIndex !== -1) {
      const ev = diffs[diffIndex];
      diffs.splice(diffIndex, 1);
      ev.result = dimResult.matchType;
      ev.explanation = `${dimResult.explanation} [AI Semantic Analysis]`;
      matched.push(ev);
      enhancedFields.push(field);
    } else {
      // If already in matched, update explanation with AI insight
      const matchIndex = matched.findIndex((e) => e.field === field);
      if (matchIndex !== -1) {
        matched[matchIndex].explanation = `${dimResult.explanation} [AI Semantic Analysis]`;
      }
    }
  };

  updateEvidence("education", aiOutput.education);
  updateEvidence("profession", aiOutput.profession);
  updateEvidence("coreValues", aiOutput.coreValues);
  updateEvidence("hobbies", aiOutput.hobbies);

  // Re-aggregate evidences map
  const allEvidences = [...matched, ...diffs, ...candidate.unknowns];
  const cMap = new Map(allEvidences.map((e) => [e.field, e]));

  // Recompute category fits
  const categoryFits: { name: string; weight: number; fit: number | null }[] = [];

  if (isMaleCustomer) {
    categoryFits.push({
      name: "customerGeneralPreference",
      weight: MALE_STRATEGY_WEIGHTS.customerGeneralPreference,
      fit: computeCategoryFit([cMap.get("location")!, cMap.get("maritalStatus")!, cMap.get("religion")!, cMap.get("community")!, cMap.get("relocation")!].filter(Boolean))
    });
    categoryFits.push({
      name: "candidateReverseGeneralPreference",
      weight: MALE_STRATEGY_WEIGHTS.candidateReverseGeneralPreference,
      fit: candidate.reversePreferenceFit // Preserved
    });
    categoryFits.push({
      name: "relationshipGoalsFamily",
      weight: MALE_STRATEGY_WEIGHTS.relationshipGoalsFamily,
      fit: computeCategoryFit([cMap.get("relationshipGoal")!, cMap.get("children")!].filter(Boolean))
    });
    categoryFits.push({
      name: "youngerAgeAlignment",
      weight: MALE_STRATEGY_WEIGHTS.youngerAgeAlignment,
      fit: computeCategoryFit([cMap.get("youngerAge") || cMap.get("age")].filter(Boolean) as PreferenceEvidence[])
    });
    categoryFits.push({
      name: "lowerIncomeAlignment",
      weight: MALE_STRATEGY_WEIGHTS.lowerIncomeAlignment,
      fit: computeCategoryFit([cMap.get("lowerIncome") || cMap.get("income")].filter(Boolean) as PreferenceEvidence[])
    });
    categoryFits.push({
      name: "shorterHeightAlignment",
      weight: MALE_STRATEGY_WEIGHTS.shorterHeightAlignment,
      fit: computeCategoryFit([cMap.get("shorterHeight") || cMap.get("height")].filter(Boolean) as PreferenceEvidence[])
    });
    categoryFits.push({
      name: "coreValuesPriorities",
      weight: MALE_STRATEGY_WEIGHTS.coreValuesPriorities,
      fit: computeCoreValuesFit(cMap.get("coreValues"), cMap)
    });
    categoryFits.push({
      name: "careerEducation",
      weight: MALE_STRATEGY_WEIGHTS.careerEducation,
      fit: computeCategoryFit([cMap.get("education")!, cMap.get("profession")!].filter(Boolean))
    });
    categoryFits.push({
      name: "lifestyleInterests",
      weight: MALE_STRATEGY_WEIGHTS.lifestyleInterests,
      fit: computeCategoryFit([cMap.get("dietary")!, cMap.get("smoking")!, cMap.get("drinking")!, cMap.get("hobbies")!].filter(Boolean))
    });
  } else {
    categoryFits.push({
      name: "customerGeneralPreference",
      weight: FEMALE_STRATEGY_WEIGHTS.customerGeneralPreference,
      fit: computeCategoryFit([cMap.get("age")!, cMap.get("height")!, cMap.get("maritalStatus")!, cMap.get("religion")!, cMap.get("community")!].filter(Boolean))
    });
    categoryFits.push({
      name: "candidateReverseGeneralPreference",
      weight: FEMALE_STRATEGY_WEIGHTS.candidateReverseGeneralPreference,
      fit: candidate.reversePreferenceFit // Preserved
    });
    categoryFits.push({
      name: "relationshipGoalsFamily",
      weight: FEMALE_STRATEGY_WEIGHTS.relationshipGoalsFamily,
      fit: computeCategoryFit([cMap.get("relationshipGoal")!, cMap.get("children")!].filter(Boolean))
    });
    categoryFits.push({
      name: "professionalCareer",
      weight: FEMALE_STRATEGY_WEIGHTS.professionalCareer,
      fit: computeCategoryFit([cMap.get("profession")!, cMap.get("income")!].filter(Boolean))
    });
    categoryFits.push({
      name: "coreValuesPriorities",
      weight: FEMALE_STRATEGY_WEIGHTS.coreValuesPriorities,
      fit: computeCoreValuesFit(cMap.get("coreValues"), cMap)
    });
    categoryFits.push({
      name: "locationRelocation",
      weight: FEMALE_STRATEGY_WEIGHTS.locationRelocation,
      fit: computeCategoryFit([cMap.get("location")!, cMap.get("relocation")!].filter(Boolean))
    });
    categoryFits.push({
      name: "lifestyleInterests",
      weight: FEMALE_STRATEGY_WEIGHTS.lifestyleInterests,
      fit: computeCategoryFit([cMap.get("dietary")!, cMap.get("smoking")!, cMap.get("drinking")!, cMap.get("hobbies")!].filter(Boolean))
    });
    categoryFits.push({
      name: "educationAlignment",
      weight: FEMALE_STRATEGY_WEIGHTS.educationAlignment,
      fit: computeCategoryFit([cMap.get("education")!].filter(Boolean))
    });
  }

  // Renormalize score
  let weightedScoreSum = 0;
  let availableWeight = 0;

  for (const cat of categoryFits) {
    if (cat.fit !== null) {
      weightedScoreSum += cat.weight * cat.fit;
      availableWeight += cat.weight;
    }
  }

  const updatedScore = availableWeight > 0 ? Math.round(weightedScoreSum / availableWeight) : candidate.score;

  // Recompute customer preference fit
  let custSum = 0;
  let custCount = 0;
  for (const ev of allEvidences) {
    const v = getComparisonScore(ev.result);
    if (v !== null) {
      custSum += v;
      custCount++;
    }
  }
  const updatedCustFit = custCount > 0 ? Math.round((custSum / custCount) * 100) : candidate.customerPreferenceFit;

  return {
    ...candidate,
    score: updatedScore,
    customerPreferenceFit: updatedCustFit,
    matchedPreferences: matched,
    differences: diffs,
    aiSemanticInsight: {
      model: MODEL_NAME,
      summary: aiOutput.overallSemanticSummary,
      enhancedFields,
      rawScores: {
        education: aiOutput.education.score,
        profession: aiOutput.profession.score,
        coreValues: aiOutput.coreValues.score,
        hobbies: aiOutput.hobbies.score
      }
    }
  };
}

/**
 * Main Top-K AI Semantic Re-Ranking Engine (Option B):
 * Takes top K candidates from deterministic pass and runs parallel semantic analysis
 * using nvidia/nemotron-3.5-lightning:free via OpenRouter.
 */
export async function rerankTopCandidatesWithAI(
  customer: CustomerRecord,
  candidates: RankedCandidate[],
  topK: number = 5
): Promise<RankedCandidate[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  // If no API key configured or placeholder, return deterministic candidates untouched
  if (!apiKey || apiKey === "your_openrouter_api_key_here" || apiKey.trim() === "") {
    return candidates;
  }

  if (candidates.length === 0) return candidates;

  const topSlice = candidates.slice(0, topK);
  const remainder = candidates.slice(topK);

  // Run semantic analysis in parallel across top K
  const enhancedTop = await Promise.all(
    topSlice.map(async (candidate) => {
      try {
        const aiOutput = await analyzeCandidateSemantics(customer, candidate, apiKey);
        if (!aiOutput) return candidate;
        return applySemanticEnhancements(customer, candidate, aiOutput);
      } catch (err) {
        console.warn(`Semantic re-ranking failed for candidate ${candidate.candidate.id}:`, err);
        return candidate;
      }
    })
  );

  // Combine and re-sort
  const allUpdated = [...enhancedTop, ...remainder];
  return rankCandidates(allUpdated);
}

/**
 * On-Demand Matchmaker Analysis for a single specified candidate profile.
 * Analyzes semantic compatibility with nvidia/nemotron-3.5-lightning:free
 * and returns the enhanced candidate with boosted score, upgraded preferences, and summary.
 */
export async function enhanceSingleCandidateWithAI(
  customer: CustomerRecord,
  candidate: RankedCandidate
): Promise<RankedCandidate> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === "your_openrouter_api_key_here" || apiKey.trim() === "") {
    throw new Error("OpenRouter API key is not configured in .env. Please set OPENROUTER_API_KEY.");
  }

  const aiOutput = await analyzeCandidateSemantics(customer, candidate, apiKey);
  if (!aiOutput) {
    throw new Error("AI analysis did not return a valid semantic evaluation. Please try again.");
  }

  return applySemanticEnhancements(customer, candidate, aiOutput);
}

