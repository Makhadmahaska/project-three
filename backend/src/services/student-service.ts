import bcrypt from "bcrypt";
import prisma from "../../lib/db.js";
import { Role } from "../../generated/prisma/client.js";

type CreateStudentInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type UpdateStudentInput = Partial<CreateStudentInput>;

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

export async function createStudent(input: CreateStudentInput) {
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

export async function updateStudent(studentId: string, input: UpdateStudentInput) {
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
      firstName: input.firstName,
      lastName: input.lastName,
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

export async function getStudentGrades(studentId: string) {
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
