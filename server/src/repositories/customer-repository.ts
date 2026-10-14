import crypto from "node:crypto";
import {
  calculateAge,
  type CustomerNote,
  type CustomerRecord,
  type CustomerSummary,
  type MatchStatus,
  type MatchingRecommendationsResponse,
  type RankedCandidate
} from "../../../shared/contracts.js";
import { readCustomers, readMatches, writeCustomers } from "./storage.js";
import { runMatchingEngine, scoreCandidate } from "../engine/matching-engine.js";
import { enhanceSingleCandidateWithAI } from "../engine/semantic-assistant.js";

export interface CustomerFilter {
  matchmakerId?: string;
  readiness?: string;
  gender?: string;
  search?: string;
}

export async function getCustomersSummary(filter?: CustomerFilter): Promise<CustomerSummary[]> {
  const [customers, matches] = await Promise.all([readCustomers(), readMatches()]);

  // Aggregate pairing status counts for each customer
  const matchCountsByCustomerId = new Map<string, Partial<Record<MatchStatus, number>>>();

  for (const match of matches) {
    for (const cId of [match.customerAId, match.customerBId]) {
      const counts = matchCountsByCustomerId.get(cId) ?? {};
      counts[match.status] = (counts[match.status] ?? 0) + 1;
      matchCountsByCustomerId.set(cId, counts);
    }
  }

  let filtered = customers;

  if (filter?.matchmakerId) {
    filtered = filtered.filter(
      (c) => c.profile.assignedMatchmakerId === filter.matchmakerId
    );
  }

  if (filter?.readiness && filter.readiness !== "ALL") {
    filtered = filtered.filter(
      (c) => c.profile.profileStatus === filter.readiness
    );
  }

  if (filter?.gender && filter.gender !== "ALL") {
    filtered = filtered.filter((c) => c.profile.gender === filter.gender);
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase().trim();
    filtered = filtered.filter((c) => {
      const fullName = `${c.profile.firstName} ${c.profile.lastName}`.toLowerCase();
      const city = c.profile.location.city.toLowerCase();
      const profession = (c.profile.career.professionCategory || c.profile.career.designation || "").toLowerCase();
      return fullName.includes(q) || city.includes(q) || profession.includes(q);
    });
  }

  return filtered.map((c) => {
    const age = calculateAge(c.profile.dateOfBirth);
    const matchStatusCounts = matchCountsByCustomerId.get(c.profile.id) ?? {};

    return {
      id: c.profile.id,
      firstName: c.profile.firstName,
      lastName: c.profile.lastName,
      gender: c.profile.gender,
      assignedMatchmakerId: c.profile.assignedMatchmakerId,
      city: c.profile.location.city,
      maritalStatus: c.profile.maritalStatus,
      profileStatus: c.profile.profileStatus,
      profession: c.profile.career.designation || c.profile.career.professionCategory || null,
      age,
      matchStatusCounts
    };
  });
}

export async function getCustomerById(id: string): Promise<CustomerRecord | null> {
  const customers = await readCustomers();
  const customer = customers.find((c) => c.profile.id === id);
  return customer ?? null;
}

export async function addCustomerNote(
  customerId: string,
  data: { authorMatchmakerId: string; body: string }
): Promise<CustomerNote | null> {
  const customers = await readCustomers();
  const customer = customers.find((c) => c.profile.id === customerId);

  if (!customer) {
    return null;
  }

  const newNote: CustomerNote = {
    id: `cn_${crypto.randomUUID().slice(0, 8)}`,
    authorMatchmakerId: data.authorMatchmakerId,
    body: data.body.trim(),
    createdAt: new Date().toISOString()
  };

  customer.profile.notes = customer.profile.notes ?? [];
  customer.profile.notes.unshift(newNote);
  customer.profile.updatedAt = new Date().toISOString();

  await writeCustomers(customers);
  return newNote;
}

export async function getCustomerRecommendations(
  customerId: string
): Promise<MatchingRecommendationsResponse | null> {
  const [customers, matches] = await Promise.all([readCustomers(), readMatches()]);
  const customer = customers.find((c) => c.profile.id === customerId);

  if (!customer) {
    return null;
  }

  // Returns deterministic recommendations immediately (<15ms)
  return runMatchingEngine(customer, customers, matches);
}

/**
 * On-demand matchmaker analysis:
 * Evaluates semantic compatibility for a single candidate profile with nvidia/nemotron-3.5-lightning:free
 */
export async function analyzeCandidateWithAI(
  customerId: string,
  candidateId: string
): Promise<RankedCandidate | null> {
  const [customers] = await Promise.all([readCustomers()]);
  const customer = customers.find((c) => c.profile.id === customerId);
  const candidateRecord = customers.find((c) => c.profile.id === candidateId);

  if (!customer || !candidateRecord) {
    return null;
  }

  // Baseline scored candidate
  const baseScored = scoreCandidate(customer, candidateRecord);

  // Run AI semantic enhancement on this specified candidate
  return enhanceSingleCandidateWithAI(customer, baseScored);
}


