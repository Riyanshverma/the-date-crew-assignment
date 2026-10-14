import { Router, type ErrorRequestHandler } from "express";
import {
  getCustomersSummary,
  getCustomerById,
  addCustomerNote,
  getCustomerRecommendations,
  analyzeCandidateWithAI
} from "../repositories/customer-repository.js";
import {
  getMatchesByCustomerId,
  getMatchById,
  createMatch,
  updateMatchStatus,
  addMatchNote,
  updateFollowUp,
  shareProposal
} from "../repositories/match-repository.js";
import type { MatchStatus } from "../../../shared/contracts.js";

export const apiRouter = Router();

// ==========================================
// Customer Endpoints
// ==========================================

// GET /api/customers - List customer summaries with filtering
apiRouter.get("/customers", async (req, res, next) => {
  try {
    const { matchmakerId, readiness, gender, search } = req.query;

    const customers = await getCustomersSummary({
      matchmakerId: typeof matchmakerId === "string" ? matchmakerId : undefined,
      readiness: typeof readiness === "string" ? readiness : undefined,
      gender: typeof gender === "string" ? gender : undefined,
      search: typeof search === "string" ? search : undefined
    });

    res.json(customers);
  } catch (err) {
    next(err);
  }
});

// GET /api/customers/:id - Full customer profile & preferences
apiRouter.get("/customers/:id", async (req, res, next) => {
  try {
    const customer = await getCustomerById(req.params.id);
    if (!customer) {
      res.status(404).json({ error: `Customer '${req.params.id}' not found` });
      return;
    }

    res.json(customer);
  } catch (err) {
    next(err);
  }
});

// POST /api/customers/:id/notes - Add customer-level note
apiRouter.post("/customers/:id/notes", async (req, res, next) => {
  try {
    const { authorMatchmakerId, body } = req.body ?? {};

    if (!authorMatchmakerId || typeof authorMatchmakerId !== "string") {
      res.status(400).json({ error: "authorMatchmakerId is required" });
      return;
    }

    if (!body || typeof body !== "string" || !body.trim()) {
      res.status(400).json({ error: "body is required and must not be empty" });
      return;
    }

    const note = await addCustomerNote(req.params.id, {
      authorMatchmakerId,
      body
    });

    if (!note) {
      res.status(404).json({ error: `Customer '${req.params.id}' not found` });
      return;
    }

    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});

// GET /api/customers/:id/matches - Pairings for customer
apiRouter.get("/customers/:id/matches", async (req, res, next) => {
  try {
    const matches = await getMatchesByCustomerId(req.params.id);
    res.json(matches);
  } catch (err) {
    next(err);
  }
});

// GET /api/customers/:id/recommendations - Generate ranked matching candidates
apiRouter.get("/customers/:id/recommendations", async (req, res, next) => {
  try {
    const recommendations = await getCustomerRecommendations(req.params.id);
    if (!recommendations) {
      res.status(404).json({ error: `Customer '${req.params.id}' not found` });
      return;
    }
    res.json(recommendations);
  } catch (err) {
    next(err);
  }
});

// POST /api/customers/:id/candidates/:candidateId/ai-analyze - On-demand matchmaker AI analysis
apiRouter.post("/customers/:id/candidates/:candidateId/ai-analyze", async (req, res, next) => {
  try {
    const candidate = await analyzeCandidateWithAI(req.params.id, req.params.candidateId);
    if (!candidate) {
      res.status(404).json({ error: "Customer or candidate not found" });
      return;
    }
    res.json(candidate);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to analyze candidate with AI" });
  }
});

// ==========================================
// Match Endpoints
// ==========================================

// POST /api/matches - Create pairing between two customers
apiRouter.post("/matches", async (req, res, next) => {
  try {
    const { customerAId, customerBId, createdByMatchmakerId, compatibilityScore } = req.body ?? {};

    if (!customerAId || !customerBId || !createdByMatchmakerId) {
      res.status(400).json({
        error: "customerAId, customerBId, and createdByMatchmakerId are required"
      });
      return;
    }

    if (customerAId === customerBId) {
      res.status(400).json({ error: "Cannot create pairing with self" });
      return;
    }

    const match = await createMatch({
      customerAId,
      customerBId,
      createdByMatchmakerId,
      compatibilityScore: typeof compatibilityScore === "number" ? compatibilityScore : undefined
    });

    res.status(201).json(match);
  } catch (err: any) {
    if (err?.message?.includes("already exists")) {
      res.status(409).json({ error: err.message });
      return;
    }
    next(err);
  }
});

// GET /api/matches/:id - Get individual pairing record
apiRouter.get("/matches/:id", async (req, res, next) => {
  try {
    const match = await getMatchById(req.params.id);
    if (!match) {
      res.status(404).json({ error: `Match '${req.params.id}' not found` });
      return;
    }

    res.json(match);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/matches/:id/status - Update pairing status with transition validation
apiRouter.patch("/matches/:id/status", async (req, res, next) => {
  try {
    const { toStatus, changedByMatchmakerId, note } = req.body ?? {};

    if (!toStatus || typeof toStatus !== "string") {
      res.status(400).json({ error: "toStatus is required" });
      return;
    }

    if (!changedByMatchmakerId || typeof changedByMatchmakerId !== "string") {
      res.status(400).json({ error: "changedByMatchmakerId is required" });
      return;
    }

    const updated = await updateMatchStatus(
      req.params.id,
      toStatus as MatchStatus,
      changedByMatchmakerId,
      note
    );

    res.json(updated);
  } catch (err: any) {
    if (err?.message?.includes("Invalid match status")) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (err?.message?.includes("not found")) {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
});

// POST /api/matches/:id/notes - Add match-specific note
apiRouter.post("/matches/:id/notes", async (req, res, next) => {
  try {
    const { authorMatchmakerId, body } = req.body ?? {};

    if (!authorMatchmakerId || !body || typeof body !== "string" || !body.trim()) {
      res.status(400).json({ error: "authorMatchmakerId and non-empty body are required" });
      return;
    }

    const note = await addMatchNote(req.params.id, {
      authorMatchmakerId,
      body
    });

    res.status(201).json(note);
  } catch (err: any) {
    if (err?.message?.includes("not found")) {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
});

// PATCH /api/matches/:id/follow-up - Update follow-up date
apiRouter.patch("/matches/:id/follow-up", async (req, res, next) => {
  try {
    const { followUpAt } = req.body ?? {};

    const updated = await updateFollowUp(req.params.id, followUpAt ?? null);
    res.json(updated);
  } catch (err: any) {
    if (err?.message?.includes("not found")) {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
});

// POST /api/matches/:id/share-proposal - Mock Send Match proposal action
apiRouter.post("/matches/:id/share-proposal", async (req, res, next) => {
  try {
    const { matchmakerId, mockMessage } = req.body ?? {};

    if (!matchmakerId || typeof matchmakerId !== "string") {
      res.status(400).json({ error: "matchmakerId is required" });
      return;
    }

    const updated = await shareProposal(req.params.id, matchmakerId, mockMessage);
    res.json(updated);
  } catch (err: any) {
    if (err?.message?.includes("not found")) {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
});

// ==========================================
// Centralized Error Handler
// ==========================================
export const apiErrorHandler: ErrorRequestHandler = (err, _request, response, _next) => {
  const status = typeof err?.status === "number" ? err.status : 500;
  const message = err instanceof Error ? err.message : "Internal server error";

  if (status >= 500) {
    console.error("[API Error]", err);
  }

  response.status(status).json({
    error: message
  });
};
