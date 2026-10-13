import crypto from "node:crypto";
import {
  MATCH_STATUSES,
  type MatchNote,
  type MatchRecord,
  type MatchStatus,
  type MatchStatusEvent
} from "../../../shared/contracts.js";
import { readMatches, writeMatches } from "./storage.js";

export async function getMatchesByCustomerId(customerId: string): Promise<MatchRecord[]> {
  const matches = await readMatches();
  return matches
    .filter((m) => m.customerAId === customerId || m.customerBId === customerId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getMatchById(matchId: string): Promise<MatchRecord | null> {
  const matches = await readMatches();
  return matches.find((m) => m.id === matchId) ?? null;
}

export async function createMatch(data: {
  customerAId: string;
  customerBId: string;
  createdByMatchmakerId: string;
  compatibilityScore?: number;
}): Promise<MatchRecord> {
  const matches = await readMatches();

  // Prevent duplicate pairings
  const existing = matches.find(
    (m) =>
      (m.customerAId === data.customerAId && m.customerBId === data.customerBId) ||
      (m.customerAId === data.customerBId && m.customerBId === data.customerAId)
  );

  if (existing) {
    throw new Error(`A pairing record already exists between these customers (Match ID: ${existing.id})`);
  }

  const now = new Date().toISOString();
  const initialStatus: MatchStatus = "SHORTLISTED";

  const initialEvent: MatchStatusEvent = {
    id: `ev_${crypto.randomUUID().slice(0, 8)}`,
    fromStatus: null,
    toStatus: initialStatus,
    changedByMatchmakerId: data.createdByMatchmakerId,
    note: "Pairing shortlisted",
    createdAt: now
  };

  const newMatch: MatchRecord = {
    id: `match_${crypto.randomUUID().slice(0, 8)}`,
    customerAId: data.customerAId,
    customerBId: data.customerBId,
    createdByMatchmakerId: data.createdByMatchmakerId,
    status: initialStatus,
    classifications: ["PREFERRED"],
    compatibilityScore: data.compatibilityScore ?? 75,
    customerPreferenceFit: 75,
    reversePreferenceFit: 75,
    scoreVersion: "mvp-v1",
    proposal: {
      sharedAt: null,
      sharedByMatchmakerId: null,
      mockMessage: null
    },
    introduction: {
      arrangedAt: null,
      feedbackFromCustomerA: null,
      feedbackFromCustomerB: null,
      outcome: null
    },
    followUpAt: null,
    notes: [],
    statusHistory: [initialEvent],
    createdAt: now,
    updatedAt: now
  };

  matches.unshift(newMatch);
  await writeMatches(matches);
  return newMatch;
}

export async function updateMatchStatus(
  matchId: string,
  toStatus: MatchStatus,
  changedByMatchmakerId: string,
  note?: string
): Promise<MatchRecord> {
  const matches = await readMatches();
  const match = matches.find((m) => m.id === matchId);

  if (!match) {
    throw new Error(`Match with ID '${matchId}' not found`);
  }

  if (match.status === toStatus) {
    return match;
  }

  if (!MATCH_STATUSES.includes(toStatus)) {
    throw new Error(`Invalid match status: '${toStatus}'`);
  }

  const now = new Date().toISOString();
  const statusEvent: MatchStatusEvent = {
    id: `ev_${crypto.randomUUID().slice(0, 8)}`,
    fromStatus: match.status,
    toStatus,
    changedByMatchmakerId,
    note: note?.trim() || null,
    createdAt: now
  };

  match.status = toStatus;
  match.statusHistory = match.statusHistory ?? [];
  match.statusHistory.unshift(statusEvent);
  match.updatedAt = now;

  await writeMatches(matches);
  return match;
}

export async function addMatchNote(
  matchId: string,
  data: { authorMatchmakerId: string; body: string }
): Promise<MatchNote> {
  const matches = await readMatches();
  const match = matches.find((m) => m.id === matchId);

  if (!match) {
    throw new Error(`Match with ID '${matchId}' not found`);
  }

  const newNote: MatchNote = {
    id: `mn_${crypto.randomUUID().slice(0, 8)}`,
    authorMatchmakerId: data.authorMatchmakerId,
    body: data.body.trim(),
    createdAt: new Date().toISOString()
  };

  match.notes = match.notes ?? [];
  match.notes.unshift(newNote);
  match.updatedAt = new Date().toISOString();

  await writeMatches(matches);
  return newNote;
}

export async function updateFollowUp(
  matchId: string,
  followUpAt: string | null
): Promise<MatchRecord> {
  const matches = await readMatches();
  const match = matches.find((m) => m.id === matchId);

  if (!match) {
    throw new Error(`Match with ID '${matchId}' not found`);
  }

  match.followUpAt = followUpAt;
  match.updatedAt = new Date().toISOString();

  await writeMatches(matches);
  return match;
}

export async function shareProposal(
  matchId: string,
  matchmakerId: string,
  mockMessage?: string
): Promise<MatchRecord> {
  const matches = await readMatches();
  const match = matches.find((m) => m.id === matchId);

  if (!match) {
    throw new Error(`Match with ID '${matchId}' not found`);
  }

  const now = new Date().toISOString();

  if (match.status !== "PROPOSAL_SHARED") {
    const event: MatchStatusEvent = {
      id: `ev_${crypto.randomUUID().slice(0, 8)}`,
      fromStatus: match.status,
      toStatus: "PROPOSAL_SHARED",
      changedByMatchmakerId: matchmakerId,
      note: "Mock proposal shared with customer for review",
      createdAt: now
    };
    match.status = "PROPOSAL_SHARED";
    match.statusHistory = match.statusHistory ?? [];
    match.statusHistory.unshift(event);
  }

  match.proposal = {
    sharedAt: now,
    sharedByMatchmakerId: matchmakerId,
    mockMessage: mockMessage?.trim() || "Mock profile proposal shared for review."
  };
  match.updatedAt = now;

  await writeMatches(matches);
  return match;
}
