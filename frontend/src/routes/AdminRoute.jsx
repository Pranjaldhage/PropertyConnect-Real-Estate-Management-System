import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute({ children }) {
  const { token, user, loaded } = useSelector(
    (state) => state.auth
  );

  // wait until redux hydrated
  if (!loaded) return null;

  if (!token || user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}
