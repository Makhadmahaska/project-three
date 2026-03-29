import type { Response } from "express";

import prisma from "../../lib/db.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";

export async function getSessionController(
  request: AuthenticatedRequest,
  response: Response
) {
  if (!request.auth) {
    return response.status(401).json({ message: "Authentication required" });
  }

  const user = await prisma.user.findUnique({
    where: { id: request.auth.userId },
    include: { student: true }
  });

  if (!user) {
    return response.status(404).json({ message: "User not found" });
  }

  const authorizationHeader = request.headers.authorization ?? "";
  const token = authorizationHeader.startsWith("Bearer ")
    ? authorizationHeader.slice("Bearer ".length)
    : "";

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
