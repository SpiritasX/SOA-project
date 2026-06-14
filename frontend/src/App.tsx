import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from "./pages/Profile";
import User from "./pages/User";
import CreateBlog from "./pages/blog/Create";
import ViewBlog from "./pages/blog/View";
import CreateTour from "./pages/tour/Create";
import EditTour from "./pages/tour/Edit";
import ViewTour from "./pages/tour/View";
import ReviewTour from "./pages/tour/Review";
import Simulator from "./pages/tour/Simulator";
import ShoppingCart from "./pages/tour/ShoppingCart";
import ActiveTour from "./pages/tour/ActiveTour";
import Admin from "./pages/Admin.tsx";
import RequireRole from "./components/RequireRole.tsx";
import AppShell from "./components/AppShell.tsx";

function App() {
  return (
    <Router>
      <AppShell>
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
          <Route path="/cart" element={
            <RequireRole roles={["TOURIST"]}>
              <ShoppingCart />
            </RequireRole>
          } />
          <Route path="/tour/active" element={
            <RequireRole roles={["TOURIST"]}>
              <ActiveTour />
            </RequireRole>
          } />
          <Route path="/admin" element={
            <RequireRole roles={["ADMINISTRATOR"]}>
              <Admin />
            </RequireRole>
          } />
        </Routes>
      </AppShell>
    </Router>
  );
}

export default App;
