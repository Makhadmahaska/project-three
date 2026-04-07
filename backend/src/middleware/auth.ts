import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import type { Role } from "../../generated/prisma/client.js";
import prisma from "../../lib/db.js";

export type AuthenticatedRequest = Request & {
  auth?: {
    userId: string;
    role: Role;
    studentId?: string | undefined;
  };
};

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID ?? "project-three-99cba";
const firebaseIssuer = `https://securetoken.google.com/${firebaseProjectId}`;
const firebaseJWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

async function verifyFirebaseToken(token: string) {
  const { payload } = await jwtVerify(token, firebaseJWKS, {
    issuer: firebaseIssuer,
    audience: firebaseProjectId
  });

  return payload;
}

async function buildFirebaseAuth(payload: JWTPayload) {
  const email = typeof payload.email === "string" ? payload.email : undefined;

  if (!payload.sub || !email) {
    throw new Error("Firebase token is missing required claims");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { student: true }
  });

  if (!user) {
    throw new Error("No application account found for this Firebase user");
  }

  return user.student
    ? {
        userId: user.id,
        role: user.role,
        studentId: user.student.id
      }
    : {
        userId: user.id,
        role: user.role
      };
}

export async function requireAuth(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Authentication required" });
  }

  const token = authorizationHeader.slice("Bearer ".length);
  let firebasePayload: JWTPayload;

  try {
    firebasePayload = await verifyFirebaseToken(token);
  } catch {
    return response.status(401).json({ message: "Invalid or expired token" });
  }

  try {
    request.auth = await buildFirebaseAuth(firebasePayload);
    return next();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "No application account found for this Firebase user"
    ) {
      return response.status(403).json({ message: error.message });
    }

    return next(error);
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
