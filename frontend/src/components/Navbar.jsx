import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  selectUser,
  selectRole,
  selectIsAdmin,
  clearAuth,
  selectAuth,
} from "../store/authSlice";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loaded } = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);
  const isAdmin = useSelector(selectIsAdmin);

  const handleLogout = () => {
    dispatch(clearAuth({ reason: "manual" }));
    navigate("/auth/login");
  };

  if (!loaded) return null;

  const navClass = ({ isActive }) =>
    `text-decoration-none px-2 py-1 ${isActive ? "text-white fw-semibold" : "text-secondary"
    }`;

  return (
    <nav className="bg-dark border-bottom border-secondary">
      <div className="container py-2 d-flex flex-wrap align-items-center justify-content-between gap-3">

        {/* BRAND */}
        <button
          className="btn btn-link p-0 text-decoration-none text-white fw-bold fs-5"
          type="button"
          onClick={() => navigate(isAdmin ? "/admin" : "/")}
        >
          🏠 PropertyConnect
        </button>

        {/* LINKS */}
        <div className="d-flex flex-wrap align-items-center gap-2">

          <NavLink to="/" className={navClass}>
            Home
          </NavLink>

          {role === "CUSTOMER" && (
            <>
              <NavLink to="/customer/dashboard" className={navClass}>
                Dashboard
              </NavLink>

              <NavLink to="/customer/profile" className={navClass}>
                Profile
              </NavLink>

              <NavLink to="/customer/properties/add" className={navClass}>
                Add Property
              </NavLink>

              <NavLink to="/customer/saved" className={navClass}>
                Saved Properties
              </NavLink>

              <NavLink to="/customer/enquiries" className={navClass}>
                My Enquiries
              </NavLink>
            </>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-white text-decoration-none px-2 py-1 rounded fw-semibold ${isActive ? "bg-danger" : "opacity-75"
                }`
              }
            >
              Admin
            </NavLink>
          )}

          {/* AUTH */}
          {!user ? (
            <Link className="btn btn-outline-light btn-sm" to="/auth/login">
              Login
            </Link>
          ) : (
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}