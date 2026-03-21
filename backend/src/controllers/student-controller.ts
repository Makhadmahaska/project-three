import { Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../middleware/auth";
import {
  createStudent,
  getStudentGrades,
  listStudents,
  updateStudent
} from "../services/student-service";

const createStudentSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().email(),
  password: z.string().min(8)
});

const updateStudentSchema = z.object({
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional()
});

export async function listStudentsController(_request: AuthenticatedRequest, response: Response) {
  const students = await listStudents();
  return response.json(students);
}

export async function createStudentController(
  request: AuthenticatedRequest,
  response: Response
) {
  const payload = createStudentSchema.parse(request.body);
  const student = await createStudent(payload);
  return response.status(201).json(student);
}

export async function updateStudentController(
  request: AuthenticatedRequest,
  response: Response
) {
  const payload = updateStudentSchema.parse(request.body);
  const student = await updateStudent(String(request.params.studentId), payload);
  return response.json(student);
}

export async function getOwnGradesController(
  request: AuthenticatedRequest,
  response: Response
) {
  if (!request.auth?.studentId) {
    return response.status(403).json({ message: "Student profile not linked" });
  }

  const student = await getStudentGrades(request.auth.studentId);
  return response.json(student);
}

export async function getStudentGradesController(
  request: AuthenticatedRequest,
  response: Response
) {
  const student = await getStudentGrades(String(request.params.studentId));
  return response.json(student);
}
