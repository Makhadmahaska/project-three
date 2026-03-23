import { Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { createSubject, listSubjects, updateSubject } from "../services/subject-service.js";

const createSubjectSchema = z.object({
  name: z.string().trim().min(1),
  code: z.string().trim().min(2).max(20),
  description: z.string().trim().optional()
});

const updateSubjectSchema = z.object({
  name: z.string().trim().min(1).optional(),
  code: z.string().trim().min(2).max(20).optional(),
  description: z.string().trim().optional()
});

export async function listSubjectsController(_request: AuthenticatedRequest, response: Response) {
  const subjects = await listSubjects();
  return response.json(subjects);
}

export async function createSubjectController(
  request: AuthenticatedRequest,
  response: Response
) {
  const payload = createSubjectSchema.parse(request.body);
  const subject = await createSubject(payload);
  return response.status(201).json(subject);
}

export async function updateSubjectController(
  request: AuthenticatedRequest,
  response: Response
) {
  const payload = updateSubjectSchema.parse(request.body);
  const subject = await updateSubject(String(request.params.subjectId), payload);
  return response.json(subject);
}
