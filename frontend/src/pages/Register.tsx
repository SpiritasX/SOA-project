import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("TOURIST");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    try {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
          email,
          firstName,
          lastName,
          role,
        }),
      });

      if (res.ok) {
        navigate("/login");
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
        <p className="eyebrow">Join TourLink</p>
        <h1>Create a profile for exploring or publishing guided tours.</h1>
        <p className="subtitle">Create a traveler or guide account.</p>
      </section>

      <section className="auth-panel">
        <form className="form" onSubmit={handleRegister}>
          <div className="section-title">
            <h2>Register</h2>
            <p className="muted">New TourLink account.</p>
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
              />
            </div>

            <div className="field">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="registerUsername">Username</label>
            <input
              id="registerUsername"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="registerPassword">Password</label>
            <input
              id="registerPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="field">
            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="TOURIST">Tourist</option>
              <option value="GUIDE">Guide</option>
            </select>
          </div>

          <button className="btn btn-primary" type="submit">
            Register
          </button>

          <p className="muted">
            Already registered? <Link to="/login">Login</Link>
          </p>

          {error && <div className="alert alert-error">{error}</div>}
        </form>
      </section>
    </div>
  );
}

export default Register;
