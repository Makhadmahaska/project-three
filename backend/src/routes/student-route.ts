import { Role } from "@prisma/client";
import { Router } from "express";
import {
  createStudentController,
  getOwnGradesController,
  getStudentGradesController,
  listStudentsController,
  updateStudentController
} from "../controllers/student-controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";

export const studentRouter = Router();

studentRouter.get(
  "/me/grades",
  requireAuth,
  requireRole(Role.STUDENT),
  asyncHandler(getOwnGradesController)
);

studentRouter.get("/", requireAuth, requireRole(Role.ADMIN), asyncHandler(listStudentsController));
studentRouter.post("/", requireAuth, requireRole(Role.ADMIN), asyncHandler(createStudentController));
studentRouter.put(
  "/:studentId",
  requireAuth,
  requireRole(Role.ADMIN),
  asyncHandler(updateStudentController)
);
studentRouter.get(
  "/:studentId/grades",
  requireAuth,
  requireRole(Role.ADMIN),
  asyncHandler(getStudentGradesController)
);
