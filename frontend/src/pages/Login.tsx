import {useState} from "react";
import { apiFetch } from "../api/client";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  async function handleLogin() {
    try {
      const res = await apiFetch('/api/auth/login', {method: 'POST', body: JSON.stringify({username, password})});
      if (res.ok) {
        setError('');
        localStorage.setItem("token", await res.text());
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
        <h1>Login</h1>
        <p>Welcome back! Please login to your account.</p>
      </div>
      <div>
        <input type="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
      <div>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
