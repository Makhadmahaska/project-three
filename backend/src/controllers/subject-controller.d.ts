import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
export declare function listSubjectsController(_request: AuthenticatedRequest, response: Response): Promise<Response<any, Record<string, any>>>;
export declare function createSubjectController(request: AuthenticatedRequest, response: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateSubjectController(request: AuthenticatedRequest, response: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=subject-controller.d.ts.map