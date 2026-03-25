import type { Response } from "express";
import { z } from "zod";
import type{ AuthenticatedRequest } from "../middleware/auth.js";
import { listGrades, upsertGrade } from "../services/grade-service.js";

const upsertGradeSchema = z.object({
  studentId: z.string().cuid(),
  subjectId: z.string().cuid(),
  value: z.number().int().min(0).max(100),
  comment: z.string().trim().max(250).optional()
});

export async function listGradesController(_request: AuthenticatedRequest, response: Response) {
  const grades = await listGrades();
  return response.json(grades);
}

export async function upsertGradeController(
  request: AuthenticatedRequest,
  response: Response
) {
  const payload = upsertGradeSchema.parse(request.body);
  const grade = await upsertGrade(payload);
  return response.status(201).json(grade);
}
