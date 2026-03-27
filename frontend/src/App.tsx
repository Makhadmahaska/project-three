import { useEffect, useState } from "react";

import StudentDashboard from "./pages/StudentDashbaord";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./components/Login";
import { useAuth } from "./contexts/auth";
import { getSession, type AuthResponse } from "./services/api";

export default function App() {
  const { currentUser, loading: authLoading } = useAuth();
  const [session, setSession] = useState<AuthResponse | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!currentUser) {
      setSession(null);
      setIsLoadingSession(false);
      setError("");
      return;
    }

    let cancelled = false;

    const loadSession = async () => {
      setIsLoadingSession(true);
      setError("");

      try {
        const token = await currentUser.getIdToken();
        const nextSession = await getSession(token);

        if (!cancelled) {
          setSession(nextSession);
        }
      } catch (sessionError) {
        if (!cancelled) {
          setSession(null);
          setError(
            sessionError instanceof Error
              ? sessionError.message
              : "Failed to load your account"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSession(false);
        }
      }
    };

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, [authLoading, currentUser]);

  if (authLoading || isLoadingSession) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <>
        <Login />
        {error ? <p>{error}</p> : null}
      </>
    );
  }
  if (session.user.role === "ADMIN") return <AdminDashboard token={session.token} />;
  return <StudentDashboard token={session.token} user={session.user} />;
}
