import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { auth, login } = useAuth();

  useEffect(() => {
    if (!auth.role) return;

    if (auth.role === 'TOURIST' || auth.role === 'GUIDE') {
      navigate('/profile');
    } else if (auth.role === 'ADMINISTRATOR') {
      navigate('/admin');
    }
  }, [auth.role])

  async function handleLogin() {
    try {
      const res = await apiFetch('/api/auth/login', {method: 'POST', body: JSON.stringify({username, password})});
      if (res.ok) {
        setError('');
        const token = await res.text();
        login(token);
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
