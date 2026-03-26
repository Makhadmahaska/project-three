import bcrypt from "bcrypt";
import prisma from "../../lib/db.js";
import { Role } from "../../generated/prisma/client.js";
import { HttpError } from "../middleware/http-error.js";
export async function listStudents() {
    return prisma.student.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            },
            grades: {
                include: {
                    subject: true
                }
            }
        },
        orderBy: [{ firstName: "asc" }, { lastName: "asc" }]
    });
}
export async function createStudent(input) {
    const passwordHash = await bcrypt.hash(input.password, 10);
    return prisma.student.create({
        data: {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            user: {
                create: {
                    email: input.email,
                    passwordHash,
                    role: Role.STUDENT
                }
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            }
        }
    });
}
export async function updateStudent(studentId, input) {
    const existingStudent = await prisma.student.findUnique({
        where: { id: studentId },
        include: { user: true }
    });
    if (!existingStudent) {
        throw new HttpError(404, "Student not found");
    }
    const passwordHash = input.password
        ? await bcrypt.hash(input.password, 10)
        : existingStudent.user.passwordHash;
    const nextEmail = input.email ?? existingStudent.email;
    return prisma.student.update({
        where: { id: studentId },
        data: {
            firstName: input.firstName ?? existingStudent.firstName,
            lastName: input.lastName ?? existingStudent.lastName,
            email: nextEmail,
            user: {
                update: {
                    email: nextEmail,
                    passwordHash
                }
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            }
        }
    });
}
export async function getStudentGrades(studentId) {
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            grades: {
                include: {
                    subject: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    });
    if (!student) {
        throw new HttpError(404, "Student not found");
    }
    return student;
}
//# sourceMappingURL=student-service.js.map