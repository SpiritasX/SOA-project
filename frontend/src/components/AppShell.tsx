import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

type NavItem = {
  to: string;
  label: string;
  auth?: boolean;
  roles?: string[];
  badge?: number;
};

const navItems: NavItem[] = [
  { to: "/", label: "Explore" },
  { to: "/profile", label: "Profile", auth: true },
  { to: "/admin", label: "Admin", roles: ["ADMINISTRATOR"] },
  { to: "/blog/create", label: "Write", auth: true },
  { to: "/tour/create", label: "New Tour", roles: ["GUIDE"] },
  { to: "/tour/active", label: "Active Tour", roles: ["TOURIST"] },
  { to: "/simulator", label: "Simulator", roles: ["TOURIST"] },
];

function canShow(item: NavItem, token: string | null, role: string | null) {
  if (item.roles) return Boolean(token && role && item.roles.includes(role));
  if (item.auth) return Boolean(token);
  return true;
}

function roleName(role: string | null) {
  if (!role) return "Guest";
  return role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function AppShell({ children }: { children: ReactNode }) {
  const { auth, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const visibleItems = navItems.filter((item) =>
    canShow(item, auth.token, auth.role)
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="brand" to="/">
          <span className="brand-mark">TL</span>
          <span>
            <strong>TourLink</strong>
            <small>social tours</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link is-active" : "nav-link"
              }
              end={item.to === "/"}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
          {auth.role === "TOURIST" && (
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link is-active" : "nav-link"
              }
              to="/cart"
            >
              Cart
              {items.length > 0 && <span className="nav-badge">{items.length}</span>}
            </NavLink>
          )}
        </nav>

        <div className="account-actions">
          <span className="role-pill">{roleName(auth.role)}</span>
          {auth.token ? (
            <button className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="app-main">{children}</main>
    </div>
  );
}
