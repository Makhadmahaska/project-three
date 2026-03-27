import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.js";
export declare function loginController(request: Request, response: Response): Promise<Response<any, Record<string, any>>>;
export declare function getSessionController(request: AuthenticatedRequest, response: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=auth-controller.d.ts.map