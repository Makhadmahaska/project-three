import express from "express";
import request from "supertest";
import { beforeAll, beforeEach, describe, expect, jest, test } from "@jest/globals";
import type { Role } from "../generated/prisma/client.js";
import type { AuthenticatedRequest } from "../src/middleware/auth.js";

const mockCreateRemoteJWKSet = jest.fn(() => ({}));
const mockJwtVerify = jest.fn() as jest.Mock<any>;

jest.unstable_mockModule("jose", () => ({
  createRemoteJWKSet: mockCreateRemoteJWKSet,
  jwtVerify: mockJwtVerify
}));

let prisma: any;
let PrismaRole: typeof import("../generated/prisma/client.js").Role;
let requireAuth: typeof import("../src/middleware/auth.js").requireAuth;
let requireRole: typeof import("../src/middleware/auth.js").requireRole;

beforeAll(async () => {
  const prismaModule = await import("../lib/db.js");
  prisma = prismaModule.default;

  const prismaClientModule = await import("../generated/prisma/client.js");
  PrismaRole = prismaClientModule.Role;

  const authModule = await import("../src/middleware/auth.js");
  requireAuth = authModule.requireAuth;
  requireRole = authModule.requireRole;
});

function mockUserFindUnique(value: unknown) {
  jest.spyOn(prisma.user, "findUnique").mockResolvedValue(value as never);
}

function createTestApp() {
  const app = express();

  app.get("/admin", requireAuth, requireRole(PrismaRole.ADMIN), (_req, res) => {
    res.json({ ok: true });
  });

  app.get(
    "/student",
    requireAuth,
    requireRole(PrismaRole.STUDENT),
    (req: AuthenticatedRequest, res) => {
      res.json({ studentId: req.auth?.studentId ?? null });
    }
  );

  return app;
}

function mockVerifiedFirebaseUser(role: Role, studentId?: string) {
  mockJwtVerify.mockResolvedValue({
    payload: {
      sub: "firebase-user-1",
      email: "student@example.com",
      role,
      studentId: studentId ?? null
    }
  });

  mockUserFindUnique({
    id: "app-user-1",
    email: "student@example.com",
    role,
    student: studentId ? { id: studentId } : null
  });
}

describe("backend auth and authorization", () => {
  beforeEach(() => {
    process.env.FIREBASE_PROJECT_ID = "project-three-99cba";
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("rejects requests without a bearer token", async () => {
    const app = createTestApp();
    const response = await request(app).get("/admin");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Authentication required" });
  });

  test("rejects invalid firebase tokens", async () => {
    mockJwtVerify.mockRejectedValue(new Error("invalid token"));

    const app = createTestApp();
    const response = await request(app)
      .get("/admin")
      .set("Authorization", "Bearer bad-token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid or expired token" });
  });

  test("rejects firebase users without an app account", async () => {
    mockJwtVerify.mockResolvedValue({
      payload: {
        sub: "firebase-user-1",
        email: "missing@example.com"
      }
    });

    mockUserFindUnique(null);

    const app = createTestApp();
    const response = await request(app)
      .get("/admin")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "No application account found for this Firebase user"
    });
  });

  test("prevents students from accessing admin routes", async () => {
    mockVerifiedFirebaseUser(PrismaRole.STUDENT, "student-1");

    const app = createTestApp();
    const response = await request(app)
      .get("/admin")
      .set("Authorization", "Bearer valid-student-token");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "Forbidden" });
  });

  test("allows admins to access admin routes", async () => {
    mockVerifiedFirebaseUser(PrismaRole.ADMIN);

    const app = createTestApp();
    const response = await request(app)
      .get("/admin")
      .set("Authorization", "Bearer valid-admin-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });

  test("allows students to access student routes", async () => {
    mockVerifiedFirebaseUser(PrismaRole.STUDENT, "student-1");

    const app = createTestApp();
    const response = await request(app)
      .get("/student")
      .set("Authorization", "Bearer valid-student-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ studentId: "student-1" });
  });

  test("prevents admins from accessing student routes", async () => {
    mockVerifiedFirebaseUser(PrismaRole.ADMIN);

    const app = createTestApp();
    const response = await request(app)
      .get("/student")
      .set("Authorization", "Bearer valid-admin-token");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "Forbidden" });
  });
});
