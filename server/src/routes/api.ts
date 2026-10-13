import { Router, type ErrorRequestHandler } from "express";

export const apiRouter = Router();

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
