import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectAuth,
  selectRole,
} from "../store/authSlice";

/**
 * Generic auth-protected route
 */
export function PrivateRoute({ children }) {
  const location = useLocation();
  const { token, loaded } = useSelector(selectAuth);

  // ⏳ Wait for hydration
  if (!loaded) {
    return (
      <div className="p-6 text-center text-gray-500">
        Checking session...
      </div>
    );
  }

  if (!token) {
    return (
      <Navigate
        to={`/auth/login?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`}
        replace
      />
    );
  }

  return children;
}

/**
 * Role-based protected route
 */
export function RoleRoute({
  children,
  allowedRoles = [],
}) {
  const location = useLocation();
  const { token, loaded } = useSelector(selectAuth);
  const role = useSelector(selectRole);

  if (!loaded) {
    return (
      <div className="p-6 text-center text-gray-500">
        Checking permissions...
      </div>
    );
  }

  if (!token) {
    return (
      <Navigate
        to={`/auth/login?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`}
        replace
      />
    );
  }

  const normalizedRole = Array.isArray(role)
    ? role[0]
    : role;

  if (
    allowedRoles.length &&
    (!normalizedRole ||
      !allowedRoles.includes(normalizedRole))
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}
