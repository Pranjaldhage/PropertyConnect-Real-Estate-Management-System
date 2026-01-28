import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/authSlice";

export default function PrivateRoute({ children }) {
  const location = useLocation();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (!isLoggedIn) {
    return (
      <Navigate
        to={`/auth/login?redirect=${location.pathname}`}
        replace
      />
    );
  }

  return children;
}
