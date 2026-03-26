type SubjectInput = {
    name: string;
    code: string;
    description?: string | undefined;
};
type UpdateSubjectInput = {
    name?: string | undefined;
    code?: string | undefined;
    description?: string | undefined;
};
export declare function listSubjects(): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    code: string;
    description: string | null;
}[]>;
export declare function createSubject(input: SubjectInput): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    code: string;
    description: string | null;
}>;
export declare function updateSubject(subjectId: string, input: UpdateSubjectInput): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    code: string;
    description: string | null;
}>;
export {};
//# sourceMappingURL=subject-service.d.ts.map