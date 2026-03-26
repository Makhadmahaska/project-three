import { useState } from "react";

import StudentDashboard from "./pages/StudentDashbaord";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./components/Login";
import type { AuthResponse } from "./services/api";

export default function App() {
  const [session, setSession] = useState<AuthResponse | null>(null);

  if (!session) return <Login onLogin={setSession} />;
  if (session.user.role === "ADMIN") return <AdminDashboard />;
  return <StudentDashboard user={session.user} />;
}
