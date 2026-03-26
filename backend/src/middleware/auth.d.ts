import type { NextFunction, Request, Response } from "express";
import type { Role } from "../../generated/prisma/client.js";
export type AuthenticatedRequest = Request & {
    auth?: {
        userId: string;
        role: Role;
        studentId?: string | undefined;
    };
};
export declare function requireAuth(request: AuthenticatedRequest, response: Response, next: NextFunction): void | Response<any, Record<string, any>>;
export declare function requireRole(...roles: Role[]): (request: AuthenticatedRequest, response: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=auth.d.ts.map