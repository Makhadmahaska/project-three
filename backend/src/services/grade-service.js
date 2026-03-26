import prisma from "../../lib/db.js";
export async function listGrades() {
    return prisma.grade.findMany({
        include: {
            student: true,
            subject: true
        },
        orderBy: {
            updatedAt: "desc"
        }
    });
}
export async function upsertGrade(input) {
    return prisma.grade.upsert({
        where: {
            studentId_subjectId: {
                studentId: input.studentId,
                subjectId: input.subjectId
            }
        },
        create: {
            studentId: input.studentId,
            subjectId: input.subjectId,
            value: input.value,
            comment: input.comment || null
        },
        update: {
            value: input.value,
            comment: input.comment || null
        },
        include: {
            student: true,
            subject: true
        }
    });
}
//# sourceMappingURL=grade-service.js.map