import prisma from "../../lib/db.js";
import { HttpError } from "../middleware/http-error.js";

type SubjectInput = {
  name: string;
  code: string;
  description?: string | undefined;
};

type UpdateSubjectInput = {
  name?: string | undefined;
  code?: string | undefined;
  description?: string | undefined;
};

export async function listSubjects() {
  return prisma.subject.findMany({
    orderBy: [{ name: "asc" }, { code: "asc" }]
  });
}

export async function createSubject(input: SubjectInput) {
  return prisma.subject.create({
    data: {
      name: input.name,
      code: input.code,
      description: input.description || null
    }
  });
}

export async function updateSubject(subjectId: string, input: UpdateSubjectInput) {
  const existingSubject = await prisma.subject.findUnique({
    where: { id: subjectId }
  });

  if (!existingSubject) {
    throw new HttpError(404, "Subject not found");
  }

  return prisma.subject.update({
    where: { id: subjectId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.code !== undefined ? { code: input.code } : {}),
      description: input.description === undefined ? existingSubject.description : input.description || null
    }
  });
}
