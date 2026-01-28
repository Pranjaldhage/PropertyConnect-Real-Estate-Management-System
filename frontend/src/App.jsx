import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppRoutes from "./routes/AppRoutes";
import { setAuth, clearAuth } from "./store/authSlice";
import { getMyProfile } from "./api/userApi";

import { jwtDecode } from "jwt-decode";

export default function App() {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) return;

      try {
        // fetch profile from user-service
        const res = await getMyProfile();

        // decode role from token
        const decoded = jwtDecode(token);

        dispatch(
          setAuth({
            token,
            user: {
              ...res.data,
              role: decoded.role,
            },
          })
        );
      } catch (err) {
        console.error("AUTO LOGIN FAILED", err);
        dispatch(clearAuth());
      }
    };

    loadUser();
  }, [token, dispatch]);

  return <AppRoutes />;
}
