import { prisma } from "../lib/prisma";
import { HttpError } from "../utils/http-error";

type SubjectInput = {
  name: string;
  code: string;
  description?: string;
};

type UpdateSubjectInput = Partial<SubjectInput>;

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
      name: input.name,
      code: input.code,
      description: input.description === undefined ? existingSubject.description : input.description || null
    }
  });
}
