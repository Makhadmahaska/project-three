import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
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

type AuthTokenPayload = {
  sub: string;
  role: Role;
  studentId?: string | undefined;
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
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return response.status(500).json({ message: "JWT_SECRET is not configured" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthTokenPayload;
    request.auth = decoded.studentId
      ? {
          userId: decoded.sub,
          role: decoded.role,
          studentId: decoded.studentId
        }
      : {
          userId: decoded.sub,
          role: decoded.role
        };

    return next();
  } catch {
    try {
      const firebasePayload = await verifyFirebaseToken(token);
      request.auth = await buildFirebaseAuth(firebasePayload);
      return next();
    } catch (firebaseError) {
      const message =
        firebaseError instanceof Error &&
        firebaseError.message === "No application account found for this Firebase user"
          ? firebaseError.message
          : "Invalid or expired token";

      return response.status(message === "Invalid or expired token" ? 401 : 403).json({ message });
    }
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
