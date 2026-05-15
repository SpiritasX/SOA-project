import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';
import Profile from "./pages/Profile";
import CreateBlog from "./pages/blog/Create";
import ViewBlog from "./pages/blog/View";
import Admin from "./pages/Admin.tsx";
import RequireRole from "./components/RequireRole.tsx";

function App() {
  const { logout } = useAuth();

  return (
    <Router>
      <nav style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <Link to="/" style={{ margin: '0 10px' }}>Home</Link>
        <Link to="/login" style={{ margin: '0 10px' }}>Login</Link>
        <Link to="/register" style={{ margin: '0 10px' }}>Register</Link>
        <Link to="/blog/create" style={{ margin: '0 10px' }}>Create Blog</Link>
        <button onClick={logout} style={{ margin: '0 10px' }}>Logout</button>
      </nav>

      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={
            <div>
              <h1>Welcome to the App</h1>
              <p>This is a minimal starting point.</p>
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <RequireRole>
              <Profile />
            </RequireRole>
          } />
          <Route path="/admin" element={
            <RequireRole roles={["ADMINISTRATOR"]}>
              <Admin />
            </RequireRole>
          } />
          <Route path="/blog/create" element={
            <RequireRole>
              <CreateBlog />
            </RequireRole>
          } />
          <Route path="/blog/:id" element={
            <ViewBlog />
          } />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
