import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "../../lib/db.js";
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});
export async function loginController(request, response) {
    const { email, password } = loginSchema.parse(request.body);
    const user = await prisma.user.findUnique({
        where: { email },
        include: { student: true }
    });
    if (!user) {
        return response.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        return response.status(401).json({ message: "Invalid email or password" });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return response.status(500).json({ message: "JWT_SECRET is not configured" });
    }
    const token = jwt.sign({
        role: user.role,
        studentId: user.student?.id
    }, jwtSecret, {
        subject: user.id,
        expiresIn: "7d"
    });
    return response.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.student ? `${user.student.firstName} ${user.student.lastName}` : "Administrator",
            studentId: user.student?.id ?? null
        }
    });
}
export async function getSessionController(request, response) {
    if (!request.auth) {
        return response.status(401).json({ message: "Authentication required" });
    }
    const user = await prisma.user.findUnique({
        where: { id: request.auth.userId },
        include: { student: true }
    });
    if (!user) {
        return response.status(404).json({ message: "User not found" });
    }
    const authorizationHeader = request.headers.authorization ?? "";
    const token = authorizationHeader.startsWith("Bearer ")
        ? authorizationHeader.slice("Bearer ".length)
        : "";
    return response.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.student ? `${user.student.firstName} ${user.student.lastName}` : "Administrator",
            studentId: user.student?.id ?? null
        }
    });
}
//# sourceMappingURL=auth-controller.js.map