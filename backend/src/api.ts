import cors from "cors";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { getSessionController, loginController } from "./controllers/auth-controller.js";
import { gradeRouter } from "./routes/grade-route.js";
import { requireAuth } from "./middleware/auth.js";
import { studentRouter } from "./routes/student-route.js";
import { subjectRouter } from "./routes/subject-route.js";
import { HttpError } from "./middleware/http-error.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ ok: true });
});

app.post("/api/login", loginController);
app.get("/api/session", requireAuth, getSessionController);
app.use("/api/subjects", subjectRouter);
app.use("/api/students", studentRouter);
app.use("/api/grades", gradeRouter);

app.use((_request, response) => {
  response.status(404).json({ message: "Route not found" });
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Validation failed",
      issues: error.issues
    });
  }

  if (error instanceof HttpError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);
  return response.status(500).json({ message: "Internal server error" });
});
