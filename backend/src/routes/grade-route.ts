import { Role } from "@prisma/client";
import { Router } from "express";
import { listGradesController, upsertGradeController } from "../controllers/grade-controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const gradeRouter = Router();

gradeRouter.get("/", requireAuth, requireRole(Role.ADMIN), (listGradesController));
gradeRouter.post("/", requireAuth, requireRole(Role.ADMIN), (upsertGradeController));
