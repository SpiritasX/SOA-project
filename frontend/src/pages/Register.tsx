import { useState } from "react";
import { apiFetch } from "../api/client";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('TOURIST');

  const [error, setError] = useState('');

  const navigate = useNavigate();

  async function handleRegister() {
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({username, password, email, firstName, lastName, role})
      });
      if (res.ok) {
        navigate('/login');
      } else {
        setError(await res.text());
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  }

  return (
    <div>
      <div>
        <h1>Register</h1>
        <p>Create a new account to get started.</p>
      </div>
      <div>
        <input type="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="TOURIST">Tourist</option>
          <option value="GUIDE">Admin</option>
        </select>
        <button onClick={handleRegister}>Register</button>
      </div>
      <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Register;
