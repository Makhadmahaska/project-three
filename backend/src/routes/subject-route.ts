import { Role } from "@prisma/client";
import { Router } from "express";
import {
  createSubjectController,
  listSubjectsController,
  updateSubjectController
} from "../controllers/subject-controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";

export const subjectRouter = Router();

subjectRouter.get("/", requireAuth, asyncHandler(listSubjectsController));
subjectRouter.post("/", requireAuth, requireRole(Role.ADMIN), asyncHandler(createSubjectController));
subjectRouter.put(
  "/:subjectId",
  requireAuth,
  requireRole(Role.ADMIN),
  asyncHandler(updateSubjectController)
);
