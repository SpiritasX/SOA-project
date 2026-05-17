import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';
import Profile from "./pages/Profile";
import User from "./pages/User";
import CreateBlog from "./pages/blog/Create";
import ViewBlog from "./pages/blog/View";
import CreateTour from "./pages/tour/Create";
import EditTour from "./pages/tour/Edit";
import ViewTour from "./pages/tour/View";
import ReviewTour from "./pages/tour/Review";
import Simulator from "./pages/tour/Simulator";
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
        <Link to="/profile" style={{ margin: '0 10px' }}>Profile</Link>
        <Link to="/admin" style={{ margin: '0 10px' }}>Admin</Link>
        <Link to="/blog/create" style={{ margin: '0 10px' }}>Create Blog</Link>
        <Link to="/tour/create" style={{ margin: '0 10px' }}>Create Tour</Link>
        <Link to="/simulator" style={{ margin: '0 10px' }}>Simulator</Link>
        <button onClick={logout} style={{ margin: '0 10px' }}>Logout</button>
      </nav>

      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={
            <Home />
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <RequireRole>
              <Profile />
            </RequireRole>
          } />
          <Route path="/user/:id" element={
            <RequireRole>
              <User />
            </RequireRole>
          } />
          <Route path="/blog/create" element={
            <RequireRole>
              <CreateBlog />
            </RequireRole>
          } />
          <Route path="/blog/:id" element={
            <RequireRole>
              <ViewBlog />
            </RequireRole>
          } />
          <Route path="/tour/create" element={
            <RequireRole roles={["GUIDE"]}>
              <CreateTour />
            </RequireRole>
          } />
          <Route path="/tour/:id/edit" element={
            <RequireRole roles={["GUIDE"]}>
              <EditTour />
            </RequireRole>
          } />
          <Route path="/tour/:id" element={
            <ViewTour />
          } />
          <Route path="/tour/:id/review" element={
            <RequireRole roles={["TOURIST"]}>
              <ReviewTour />
            </RequireRole>
          } />
          <Route path="/simulator" element={
            <RequireRole roles={["TOURIST"]}>
              <Simulator />
            </RequireRole>
          } />
          <Route path="/admin" element={
            <RequireRole roles={["ADMINISTRATOR"]}>
              <Admin />
            </RequireRole>
          } />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
