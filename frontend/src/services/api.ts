export const API = "http://localhost:3001/api";

export type UserRole = "ADMIN" | "STUDENT";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  studentId: string | null;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type StudentGradeResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grades: Array<{
    id: string;
    value: number;
    comment: string | null;
    createdAt?: string;
    subject: {
      id: string;
      name: string;
      code: string;
    };
  }>;
};

export type SubjectOption = {
  id: string;
  name: string;
  code: string;
};

const authHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
});

export const getSession = async (token: string): Promise<AuthResponse> => {
  const res = await fetch(`${API}/session`, {
    headers: authHeaders(token)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Failed to load session" }));
    throw new Error(errorData.message ?? "Failed to load session");
  }

  return res.json();
};

export const getGrades = async (token: string) => {
  const res = await fetch(`${API}/grades`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Failed to load grades" }));
    throw new Error(errorData.message ?? "Failed to load grades");
  }

  return res.json();
};

export const getOwnGrades = async (token: string): Promise<StudentGradeResponse> => {
  const res = await fetch(`${API}/students/me/grades`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Failed to load student grades" }));
    throw new Error(errorData.message ?? "Failed to load student grades");
  }

  return res.json();
};

export const getStudents = async (token: string) => {
  const res = await fetch(`${API}/students`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Failed to load students" }));
    throw new Error(errorData.message ?? "Failed to load students");
  }

  return res.json();
};

export const updateStudent = async (
  token: string,
  studentId: string,
  data: { firstName?: string; lastName?: string; email?: string; password?: string }
) => {
  const res = await fetch(`${API}/students/${studentId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Failed to update student" }));
    throw new Error(errorData.message ?? "Failed to update student");
  }

  return res.json();
};

export const getSubjects = async (token: string): Promise<SubjectOption[]> => {
  const res = await fetch(`${API}/subjects`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Failed to load subjects" }));
    throw new Error(errorData.message ?? "Failed to load subjects");
  }

  return res.json();
};

export const registerGrade = async (
  token: string,
  data: { studentId: string; subjectId: string; value: number; comment?: string }
) => {
  const res = await fetch(`${API}/grades`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Failed to register grade" }));
    throw new Error(errorData.message ?? "Failed to register grade");
  }

  return res.json();
};
