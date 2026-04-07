import bcrypt from "bcrypt";
import prisma from "../../lib/db.js";
import { Role } from "../../generated/prisma/client.js";
import { HttpError } from "../middleware/http-error.js";
import { firebaseAdminAuth } from "../firebase-admin.js";

type CreateStudentInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type UpdateStudentInput = {
  firstName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
};

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

function isFirebaseEmailAlreadyExistsError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "auth/email-already-exists"
  );
}

function isFirebaseUserNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "auth/user-not-found"
  );
}

export async function createStudent(input: CreateStudentInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email }
  });

  if (existingUser) {
    throw new HttpError(409, "A user with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  let firebaseUserId: string | null = null;

  try {
    const firebaseUser = await firebaseAdminAuth.createUser({
      email: input.email,
      password: input.password
    });

    firebaseUserId = firebaseUser.uid;

    return await prisma.student.create({
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
  } catch (error) {
    if (firebaseUserId) {
      await firebaseAdminAuth.deleteUser(firebaseUserId).catch(() => undefined);
    }

    if (isFirebaseEmailAlreadyExistsError(error)) {
      throw new HttpError(409, "A Firebase account with this email already exists");
    }

    throw error;
  }
}

export async function updateStudent(studentId: string, input: UpdateStudentInput) {
  const existingStudent = await prisma.student.findUnique({
    where: { id: studentId },
    include: { user: true }
  });

  if (!existingStudent) {
    throw new HttpError(404, "Student not found");
  }

  const nextEmail = input.email ?? existingStudent.email;
  const passwordHash = input.password
    ? await bcrypt.hash(input.password, 10)
    : existingStudent.user.passwordHash;

  if (input.email && input.email !== existingStudent.email) {
    const conflictingUser = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (conflictingUser) {
      throw new HttpError(409, "A user with this email already exists");
    }
  }

  try {
    const firebaseUser = await firebaseAdminAuth.getUserByEmail(existingStudent.email);

    if (input.email || input.password) {
      await firebaseAdminAuth.updateUser(firebaseUser.uid, {
        email: nextEmail,
        ...(input.password ? { password: input.password } : {})
      });
    }
  } catch (error) {
    if (isFirebaseUserNotFoundError(error)) {
      throw new HttpError(404, "Firebase account not found for this student");
    }

    if (isFirebaseEmailAlreadyExistsError(error)) {
      throw new HttpError(409, "A Firebase account with this email already exists");
    }

    throw error;
  }

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
