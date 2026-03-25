import { Role } from "../../generated/prisma/client.js";
import { Router } from "express";
import {
  createStudentController,
  getOwnGradesController,
  getStudentGradesController,
  listStudentsController,
  updateStudentController
} from "../controllers/student-controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";


export const studentRouter = Router();

studentRouter.get(
  "/me/grades",
  requireAuth,
  requireRole(Role.STUDENT),
  (getOwnGradesController)
);

studentRouter.get("/", requireAuth, requireRole(Role.ADMIN), (listStudentsController));
studentRouter.post("/", requireAuth, requireRole(Role.ADMIN), (createStudentController));
studentRouter.put(
  "/:studentId",
  requireAuth,
  requireRole(Role.ADMIN),
  (updateStudentController)
);
studentRouter.get(
  "/:studentId/grades",
  requireAuth,
  requireRole(Role.ADMIN),
  (getStudentGradesController)
);
