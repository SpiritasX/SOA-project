import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { auth, login } = useAuth();

  useEffect(() => {
    if (!auth.role) return;

    if (auth.role === "TOURIST" || auth.role === "GUIDE") {
      navigate("/profile");
    } else if (auth.role === "ADMINISTRATOR") {
      navigate("/admin");
    }
  }, [auth.role, navigate]);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const token = await res.text();
        login(token);
      } else {
        setError(await res.text());
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again later.");
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-copy">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in to manage tours, stories, and purchases.</h1>
        <p className="subtitle">Your routes, stories, purchases, and active tours.</p>
      </section>

      <section className="auth-panel">
        <form className="form" onSubmit={handleLogin}>
          <div className="section-title">
            <h2>Login</h2>
            <p className="muted">Access your TourLink account.</p>
          </div>

          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Login
          </button>

          <p className="muted">
            New here? <Link to="/register">Create an account</Link>
          </p>

          {error && <div className="alert alert-error">{error}</div>}
        </form>
      </section>
    </div>
  );
}

export default Login;
