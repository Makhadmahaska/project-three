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

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};

export const getGrades = async () => {
  const res = await fetch(`${API}/grades`);
  return res.json();
};

export const getStudents = async () => {
  const res = await fetch(`${API}/students`);
  return res.json();
};

export const registerGrade = async (data: any) => {
  const res = await fetch(`${API}/grades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};
