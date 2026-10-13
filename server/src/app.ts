import express from "express";

import type { HealthResponse } from "../../shared/contracts.js";
import { apiErrorHandler, apiRouter } from "./routes/api.js";

export const app = express();

app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_request, response) => {
  const body: HealthResponse = { service: "tdc-matchmaker-api", status: "ok" };
  response.json(body);
});

app.use("/api", apiRouter);
app.use(apiErrorHandler);
