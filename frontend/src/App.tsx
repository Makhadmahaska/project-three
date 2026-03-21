mport { useState } from "react";
import Login from "./components/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [user, setUser] = useState<any>(null);

  if (!user) return <Login onLogin={setUser} />;

  if (user.role === "admin") return <AdminDashboard />;

  return <StudentDashboard user={user} />;
}