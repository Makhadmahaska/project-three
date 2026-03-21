import { Role } from "@prisma/client";
import { Router } from "express";
import { listGradesController, upsertGradeController } from "../controllers/grade-controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";

export const gradeRouter = Router();

gradeRouter.get("/", requireAuth, requireRole(Role.ADMIN), asyncHandler(listGradesController));
gradeRouter.post("/", requireAuth, requireRole(Role.ADMIN), asyncHandler(upsertGradeController));
