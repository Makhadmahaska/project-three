import { Role } from "../../generated/prisma/client.js";
import { Router } from "express";
import { listGradesController, upsertGradeController } from "../controllers/grade-controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
export const gradeRouter = Router();
gradeRouter.get("/", requireAuth, requireRole(Role.ADMIN), (listGradesController));
gradeRouter.post("/", requireAuth, requireRole(Role.ADMIN), (upsertGradeController));
//# sourceMappingURL=grade-route.js.map