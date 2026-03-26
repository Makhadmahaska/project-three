type UpsertGradeInput = {
    studentId: string;
    subjectId: string;
    value: number;
    comment?: string | undefined;
};
export declare function listGrades(): Promise<({
    student: {
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        userId: string;
    };
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
})[]>;
export declare function upsertGrade(input: UpsertGradeInput): Promise<{
    student: {
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        userId: string;
    };
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
}>;
export {};
//# sourceMappingURL=grade-service.d.ts.map