import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Role } from "../generated/prisma/client.js";

/* =============================
   Mock jose module
   ============================= */
const mockCreateRemoteJWKSet = jest.fn(() => ({}));

type MockJwtPayload = {
  sub: string;
  email: string;
  role?: Role;
  studentId?: string | null;
};

const mockJwtVerify = jest.fn() as jest.MockedFunction<
  (token: string) => Promise<{ payload: MockJwtPayload }>
>;

jest.unstable_mockModule("jose", () => ({
  createRemoteJWKSet: mockCreateRemoteJWKSet,
  jwtVerify: mockJwtVerify
}));

/* =============================
   Prisma imports
   ============================= */
const prismaModule = await import("../lib/db.js");
const prisma = prismaModule.default;

const prismaClientModule = await import("../generated/prisma/client.js");
const { Role: PrismaRole } = prismaClientModule;

const { requireAuth, requireRole } = await import("../src/middleware/auth.js");

/* =============================
   Express test app
   ============================= */
function createTestApp() {
  const app = express();

  app.get("/admin", requireAuth, requireRole(PrismaRole.ADMIN), (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/student", requireAuth, requireRole(PrismaRole.STUDENT), (req, res) => {
    res.json({ studentId: req.auth?.studentId ?? null });
  });

  return app;
}

/* =============================
   Helper to mock a verified user
   ============================= */
function mockVerifiedFirebaseUser(role: Role, studentId?: string) {
  mockJwtVerify.mockResolvedValue({
    payload: {
      sub: "firebase-user-1",
      email: "student@example.com",
      role,
      studentId: studentId || null
    }
  });

  jest.spyOn(prisma.user, "findUnique").mockResolvedValue({
    id: "app-user-1",
    email: "student@example.com",
    role,
    student: studentId ? { id: studentId } : null
  });
}

/* =============================
   Tests
   ============================= */
describe("backend auth and authorization", () => {
  beforeEach(() => {
    process.env.FIREBASE_PROJECT_ID = "project-three-99cba";
    jest.resetAllMocks();
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

    jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

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