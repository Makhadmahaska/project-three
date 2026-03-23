import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

export type AuthenticatedRequest = Request & {
  auth?: {
    userId: string;
    role: Role;
    studentId?: string;
  };
};

type AuthTokenPayload = {
  sub: string;
  role: Role;
  studentId?: string;
};

export function requireAuth(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Authentication required" });
  }

  const token = authorizationHeader.slice("Bearer ".length);
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return response.status(500).json({ message: "JWT_SECRET is not configured" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthTokenPayload;
    request.auth = {
      userId: decoded.sub,
      role: decoded.role,
      studentId: decoded.studentId
    };

    return next();
  } catch {
    return response.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(...roles: Role[]) {
  return (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    if (!request.auth) {
      return response.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(request.auth.role)) {
      return response.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
}
