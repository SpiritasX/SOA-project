import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type {JSX} from "react";

type Props = {
  children: JSX.Element;
  roles?: string[];
};

export default function RequireRole({ children, roles }: Props) {
  const { auth } = useAuth();

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(auth.role!)) {
    return <Navigate to="/" replace />;
  }

  return children;
}