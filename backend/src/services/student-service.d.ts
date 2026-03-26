import { Role } from "../../generated/prisma/client.js";
type CreateStudentInput = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};
type UpdateStudentInput = {
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
};
export declare function listStudents(): Promise<({
    user: {
        email: string;
        id: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    };
    grades: ({
        subject: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
            description: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        value: number;
        comment: string | null;
        subjectId: string;
    })[];
} & {
    email: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    firstName: string;
    lastName: string;
    userId: string;
})[]>;
export declare function createStudent(input: CreateStudentInput): Promise<{
    user: {
        email: string;
        id: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    email: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    firstName: string;
    lastName: string;
    userId: string;
}>;
export declare function updateStudent(studentId: string, input: UpdateStudentInput): Promise<{
    user: {
        email: string;
        id: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    email: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    firstName: string;
    lastName: string;
    userId: string;
}>;
export declare function getStudentGrades(studentId: string): Promise<{
    grades: ({
        subject: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
            description: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        value: number;
        comment: string | null;
        subjectId: string;
    })[];
} & {
    email: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    firstName: string;
    lastName: string;
    userId: string;
}>;
export {};
//# sourceMappingURL=student-service.d.ts.map