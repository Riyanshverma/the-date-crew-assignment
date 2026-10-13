import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { HealthResponse } from "../../shared/contracts.js";
import { apiErrorHandler, apiRouter } from "./routes/api.js";

export const app = express();

app.use(
  cors({
    origin: true, // Reflect request origin, allowing Vercel previews & production domains
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_request, response) => {
  const body: HealthResponse = { service: "tdc-matchmaker-api", status: "ok" };
  response.json(body);
});

app.use("/api", apiRouter);
app.use(apiErrorHandler);

// Serve built frontend assets in production or when client dist exists
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.resolve(currentDir, "../../dist/client");

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  // Express 5 compatible SPA fallback
  app.use((_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}
