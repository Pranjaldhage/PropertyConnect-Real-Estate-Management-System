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

import { setAuth, setSavedCount } from "../../store/authSlice";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const redirectParam = searchParams.get("redirect");
  const redirectState = location.state?.from;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const pageStyle = {
    background: "#f6f8fc",
    minHeight: "calc(100vh - 56px)",
    display: "flex",
    alignItems: "center",
  };

  const cardStyle = {
    borderRadius: 18,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      const token = res.data;

      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);

      const role = decoded.role || decoded.userRole || decoded.authorities;
      const userId = decoded.userId || decoded.id || decoded.sub;

      const profileRes = await getMyProfile();

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

      if (role === "CUSTOMER") {
        try {
          const cartRes = await getSavedProperties();
          dispatch(setSavedCount(cartRes.data.items?.length || 0));
        } catch {
          dispatch(setSavedCount(0));
        }
      }

      const defaultRedirect = role === "ADMIN" ? "/admin" : "/";
      const redirectTo = redirectParam || redirectState || defaultRedirect;

      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={pageStyle}>
      <div className="container py-4" style={{ maxWidth: 420 }}>
        <div className="text-center mb-4">
          {/* icon bubble like Home */}
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: 72,
              height: 72,
              background:
                "linear-gradient(135deg, rgba(13,110,253,0.15), rgba(13,110,253,0.05))",
              fontSize: 30,
            }}
          >
            🔐
          </div>

          <h3 className="fw-bold mb-1" style={{ letterSpacing: "-0.4px" }}>
            Login
          </h3>
          <p className="text-muted mb-0">Sign in to continue</p>
        </div>

        <div className="card border-0 shadow-sm" style={cardStyle}>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit} noValidate>
              {/* EMAIL */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* ERROR */}
              {error && (
                <div className="alert alert-danger py-2 mb-3">
                  {error}
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-100 rounded-3 shadow-sm"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="text-center mt-3">
              <span className="text-muted">New user?</span>{" "}
              <Link to="/auth/register" className="text-decoration-none fw-semibold">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
