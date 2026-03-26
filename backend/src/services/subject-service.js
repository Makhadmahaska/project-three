import prisma from "../../lib/db.js";
import { HttpError } from "../middleware/http-error.js";
export async function listSubjects() {
    return prisma.subject.findMany({
        orderBy: [{ name: "asc" }, { code: "asc" }]
    });
}
export async function createSubject(input) {
    return prisma.subject.create({
        data: {
            name: input.name,
            code: input.code,
            description: input.description || null
        }
    });
}
export async function updateSubject(subjectId, input) {
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
//# sourceMappingURL=subject-service.js.map