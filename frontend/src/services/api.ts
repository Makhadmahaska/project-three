
export const API = "http://localhost:5000/api";

export const loginUser = async (email: string, password: string) => {
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