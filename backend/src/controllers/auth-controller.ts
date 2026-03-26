import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

import prisma from "../../lib/db.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function loginController(request: Request, response: Response) {
  const { email, password } = loginSchema.parse(request.body);

  const user = await prisma.user.findUnique({
    where: { email },
    include: { student: true }
  });

  if (!user) {
    return response.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return response.status(401).json({ message: "Invalid email or password" });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return response.status(500).json({ message: "JWT_SECRET is not configured" });
  }

  const token = jwt.sign(
    {
      role: user.role,
      studentId: user.student?.id
    },
    jwtSecret,
    {
      subject: user.id,
      expiresIn: "7d"
    }
  );

  return response.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.student ? `${user.student.firstName} ${user.student.lastName}` : "Administrator",
      studentId: user.student?.id ?? null
    }
  });
}
