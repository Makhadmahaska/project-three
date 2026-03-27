import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase/firebase";
import Sidebar from "./Sidebar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wireframe-shell">
      <header className="browser-frame">
        <div className="browser-tab-title">A Web Page</div>
        <div className="browser-toolbar">
          <div className="browser-actions" aria-hidden="true">
            <span>&lt;</span>
            <span>&gt;</span>
            <span>x</span>
            <span>[]</span>
          </div>

          <div className="browser-address">https://sundsgarden.se/elev/</div>
          <div className="browser-search">Q</div>
        </div>
      </header>

      <main className="login-stage">
        <div className="dashboard-layout login-layout">
          <Sidebar
            items={[
              { label: "Login", active: true },
              { label: "My Grades" },
              { label: "Register Grades" },
              { label: "Student Accounts" }
            ]}
          />

          <section className="login-panel">
            <h1>Login</h1>

            <form className="login-form" onSubmit={handleLogin}>
              <label className="field-row">
                <span>Email:</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="field-row">
                <span>Password:</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <label className="remember-row">
                <input type="checkbox" defaultChecked />
                <span>Remember Me</span>
              </label>

            <div className="login-actions">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
              <a href="/">Forgot password?</a>
            </div>

            {error ? <p className="login-error">{error}</p> : null}
          </form>
        </section>
      </div>
      </main>

      <footer className="wireframe-footer">
        <span>Admin</span>
      </footer>
    </div>
  );
}
