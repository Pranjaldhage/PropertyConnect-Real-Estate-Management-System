import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/authApi";

export default function Register() {
  const navigate = useNavigate();

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
      await registerUser({ email, password });

      alert("✅ Registration successful! Please login.");
      navigate("/auth/login", { replace: true });
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={pageStyle}>
      <div className="container py-4" style={{ maxWidth: 420 }}>
        {/* HEADER */}
        <div className="text-center mb-4">
          {/* icon bubble (same as Login) */}
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
            📝
          </div>

          <h3 className="fw-bold mb-1" style={{ letterSpacing: "-0.4px" }}>
            Create Account
          </h3>
          <p className="text-muted mb-0">Register to continue</p>
        </div>

        {/* CARD */}
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
                  placeholder="Create a password"
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
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>

            {/* FOOTER LINK */}
            <div className="text-center mt-3">
              <span className="text-muted">Already have an account?</span>{" "}
              <Link
                to="/auth/login"
                className="text-decoration-none fw-semibold"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
