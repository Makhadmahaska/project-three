import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
export declare function listStudentsController(_request: AuthenticatedRequest, response: Response): Promise<Response<any, Record<string, any>>>;
export declare function createStudentController(request: AuthenticatedRequest, response: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateStudentController(request: AuthenticatedRequest, response: Response): Promise<Response<any, Record<string, any>>>;
export declare function getOwnGradesController(request: AuthenticatedRequest, response: Response): Promise<Response<any, Record<string, any>>>;
export declare function getStudentGradesController(request: AuthenticatedRequest, response: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=student-controller.d.ts.map