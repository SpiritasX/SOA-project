import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type {JSX} from "react";

type Props = {
  children: JSX.Element;
  roles?: string[];
};

export default function RequireRole({ children, roles }: Props) {
  const { auth } = useAuth();

  if (auth.loading) {
    return (
      <div className="state-page">
        <div className="state-card">
          <p className="eyebrow">Loading</p>
          <h1>Preparing your workspace</h1>
        </div>
      </div>
    );
  }

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(auth.role!)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
