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

export type GradeInput = {
  studentId: string;
  course: string;
  grade: number;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
};

export const getGrades = async () => {
  const res = await fetch(`${API}/grades`);

  if (!res.ok) {
    throw new Error("Failed to fetch grades");
  }

  return res.json();
};

export const getStudents = async () => {
  const res = await fetch(`${API}/students`);

  if (!res.ok) {
    throw new Error("Failed to fetch students");
  }

  return res.json();
};

export const registerGrade = async (data: GradeInput) => {
  const res = await fetch(`${API}/grades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to register grade");
  }

  return res.json();
};