import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
export declare function listGradesController(_request: AuthenticatedRequest, response: Response): Promise<Response<any, Record<string, any>>>;
export declare function upsertGradeController(request: AuthenticatedRequest, response: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=grade-controller.d.ts.map