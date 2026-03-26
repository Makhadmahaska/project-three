import jwt from "jsonwebtoken";
export function requireAuth(request, response, next) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader?.startsWith("Bearer ")) {
        return response.status(401).json({ message: "Authentication required" });
    }
    const token = authorizationHeader.slice("Bearer ".length);
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return response.status(500).json({ message: "JWT_SECRET is not configured" });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        request.auth = decoded.studentId
            ? {
                userId: decoded.sub,
                role: decoded.role,
                studentId: decoded.studentId
            }
            : {
                userId: decoded.sub,
                role: decoded.role
            };
        return next();
    }
    catch {
        return response.status(401).json({ message: "Invalid or expired token" });
    }
}
export function requireRole(...roles) {
    return (request, response, next) => {
        if (!request.auth) {
            return response.status(401).json({ message: "Authentication required" });
        }
        if (!roles.includes(request.auth.role)) {
            return response.status(403).json({ message: "Forbidden" });
        }
        return next();
    };
}
//# sourceMappingURL=auth.js.map