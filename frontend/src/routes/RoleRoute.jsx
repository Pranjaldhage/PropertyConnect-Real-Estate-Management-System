import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth, selectRole } from "../store/authSlice";

export default function RoleRoute({
  children,
  allowedRoles = [],
}) {
  const location = useLocation();

  const { token } = useSelector(selectAuth);
  const role = useSelector(selectRole);

  // 🚫 not logged in
  if (!token) {
    return (
      <Navigate
        to={`/auth/login?redirect=${location.pathname}`}
        replace
      />
    );
  }

  // normalize role → string
  const normalizedRole = Array.isArray(role)
    ? role[0]
    : role;

  // 🚫 wrong role
  if (
    allowedRoles.length &&
    (!normalizedRole ||
      !allowedRoles.includes(normalizedRole))
  ) {
    return <Navigate to="/" replace />;
  }

  // ✅ allowed
  return children;
}
