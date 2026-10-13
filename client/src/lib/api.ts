import type {
  CustomerNote,
  CustomerRecord,
  CustomerSummary,
  MatchRecord,
  MatchingRecommendationsResponse
} from "../../../shared/contracts";

export async function fetchCustomers(params?: {
  matchmakerId?: string;
  readiness?: string;
  gender?: string;
  search?: string;
}): Promise<CustomerSummary[]> {
  const query = new URLSearchParams();
  if (params?.matchmakerId) query.set("matchmakerId", params.matchmakerId);
  if (params?.readiness && params.readiness !== "ALL") query.set("readiness", params.readiness);
  if (params?.gender && params.gender !== "ALL") query.set("gender", params.gender);
  if (params?.search) query.set("search", params.search);

  const res = await fetch(`/api/customers?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to load customers (status ${res.status})`);
  }
  return res.json();
}

export async function fetchCustomerById(id: string): Promise<CustomerRecord> {
  const res = await fetch(`/api/customers/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to load customer profile '${id}' (status ${res.status})`);
  }
  return res.json();
}

// ! Test this route and functionality
export async function addCustomerNote(
  customerId: string,
  data: { authorMatchmakerId: string; body: string }
): Promise<CustomerNote> {
  const res = await fetch(`/api/customers/${customerId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    throw new Error(`Failed to add customer note (status ${res.status})`);
  }
  return res.json();
}

// ! Test this route and functionality
export async function fetchCustomerMatches(customerId: string): Promise<MatchRecord[]> {
  const res = await fetch(`/api/customers/${customerId}/matches`);
  if (!res.ok) {
    throw new Error(`Failed to load pairings for customer '${customerId}' (status ${res.status})`);
  }
  return res.json();
}

export async function fetchRecommendations(
  customerId: string
): Promise<MatchingRecommendationsResponse> {
  const res = await fetch(`/api/customers/${customerId}/recommendations`);
  if (!res.ok) {
    throw new Error(
      `Failed to load matching recommendations for customer '${customerId}' (status ${res.status})`
    );
  }
  return res.json();
}

export async function createMatch(data: {
  customerAId: string;
  customerBId: string;
  createdByMatchmakerId: string;
  compatibilityScore?: number;
}): Promise<MatchRecord> {
  const res = await fetch("/api/matches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error || `Failed to create match pairing (status ${res.status})`);
  }
  return res.json();
}

export async function shareMatchProposal(
  matchId: string,
  matchmakerId: string,
  mockMessage?: string
): Promise<MatchRecord> {
  const res = await fetch(`/api/matches/${matchId}/share-proposal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matchmakerId, mockMessage })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error || `Failed to share mock proposal (status ${res.status})`);
  }
  return res.json();
}

export async function updateMatchStatus(
  matchId: string,
  data: {
    toStatus: string;
    changedByMatchmakerId: string;
    note?: string;
  }
): Promise<MatchRecord> {
  const res = await fetch(`/api/matches/${matchId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error || `Failed to update status (status ${res.status})`);
  }
  return res.json();
}

export async function addMatchNote(
  matchId: string,
  data: {
    authorMatchmakerId: string;
    body: string;
  }
): Promise<any> {
  const res = await fetch(`/api/matches/${matchId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error || `Failed to add pairing note (status ${res.status})`);
  }
  return res.json();
}

export async function updateMatchFollowUp(
  matchId: string,
  followUpAt: string | null
): Promise<MatchRecord> {
  const res = await fetch(`/api/matches/${matchId}/follow-up`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ followUpAt })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error || `Failed to update follow-up date (status ${res.status})`);
  }
  return res.json();
}
