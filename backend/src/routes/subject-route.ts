import { Role } from "../../generated/prisma/client.js";
import { Router } from "express";
import {
  createSubjectController,
  listSubjectsController,
  updateSubjectController
} from "../controllers/subject-controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";


export const subjectRouter = Router();

subjectRouter.get("/", requireAuth, (listSubjectsController));
subjectRouter.post("/", requireAuth, requireRole(Role.ADMIN), (createSubjectController));
subjectRouter.put(
  "/:subjectId",
  requireAuth,
  requireRole(Role.ADMIN),
  (updateSubjectController)
);
