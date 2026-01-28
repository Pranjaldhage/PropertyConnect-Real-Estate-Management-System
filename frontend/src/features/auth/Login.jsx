import { useState } from "react";
import {
  useNavigate,
  useLocation,
  Link,
  useSearchParams,
} from "react-router-dom";
import { useDispatch } from "react-redux";

import { loginUser } from "../../api/authApi";
import { getMyProfile } from "../../api/userApi";
import { getSavedProperties } from "../../api/cartApi";

import {
  setAuth,
  setSavedCount,
} from "../../store/authSlice";

import { jwtDecode } from "jwt-decode";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // redirect sources
  const redirectParam = searchParams.get("redirect");
  const redirectState = location.state?.from;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      /* ======================
         1️⃣ LOGIN
      ====================== */
      const res = await loginUser({
        email,
        password,
      });

      const token = res.data;

      /* ======================
         🔥 SAVE TOKEN FIRST
      ====================== */
      localStorage.setItem("token", token);

      /* ======================
         2️⃣ DECODE JWT
      ====================== */
      const decoded = jwtDecode(token);

      const role =
        decoded.role ||
        decoded.userRole ||
        decoded.authorities;

      const userId =
        decoded.userId ||
        decoded.id ||
        decoded.sub;

      /* ======================
         3️⃣ FETCH PROFILE
      ====================== */
      const profileRes = await getMyProfile();

      /* ======================
         4️⃣ SAVE REDUX
      ====================== */
      dispatch(
        setAuth({
          token,
          user: {
            ...profileRes.data,
            id: userId,
            role,
          },
        })
      );

      /* ======================
         5️⃣ CART BADGE SYNC
      ====================== */
      if (role === "CUSTOMER") {
        try {
          const cartRes = await getSavedProperties();

          dispatch(
            setSavedCount(
              cartRes.data.items?.length || 0
            )
          );
        } catch (err) {
          console.warn(
            "Cart fetch failed after login"
          );
          dispatch(setSavedCount(0));
        }
      }

      /* ======================
         6️⃣ REDIRECT
      ====================== */
      const defaultRedirect =
        role === "ADMIN" ? "/admin" : "/";

      const redirectTo =
        redirectParam ||
        redirectState ||
        defaultRedirect;

      navigate(redirectTo, { replace: true });

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p
            style={{
              color: "red",
              marginTop: 8,
            }}
          >
            {error}
          </p>
        )}
      </form>

      {/* SIGN UP LINK */}
      <p style={{ marginTop: 10 }}>
        New user?{" "}
        <Link to="/auth/register">
          Sign up
        </Link>
      </p>
    </div>
  );
}
