import { useState, type FormEvent } from "react";
import { loginUser, type AuthResponse } from "../services/api";

type LoginProps = {
  onLogin: (data: AuthResponse) => void;
};

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await loginUser(email, password);
    onLogin(data);
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
              <button type="submit">Login</button>
              <a href="/">Forgot password?</a>
            </div>
          </form>
        </section>
      </main>

      <footer className="wireframe-footer">
        <span>Admin</span>
      </footer>
    </div>
  );
}
