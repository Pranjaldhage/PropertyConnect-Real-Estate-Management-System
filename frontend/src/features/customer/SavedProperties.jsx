import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { getSavedProperties, removeFromCart } from "../../api/cartApi";
import { getPropertyById } from "../../api/propertyApi";
import { selectIsLoggedIn } from "../../store/authSlice";

export default function SavedProperties() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageStyle = {
    background: "#f6f8fc",
    minHeight: "calc(100vh - 56px)",
  };

  const cardStyle = {
    borderRadius: 18,
    overflow: "hidden",
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth/login");
      return;
    }
    fetchSaved();
    // eslint-disable-next-line
  }, [isLoggedIn]);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getSavedProperties();
      const items = res.data.items || [];

      const details = await Promise.all(
        items.map(async (i) => {
          try {
            const r = await getPropertyById(i.propertyId);
            return r.data;
          } catch {
            return null;
          }
        })
      );

      setProperties(details.filter(Boolean));
    } catch (err) {
      setError("Failed to load saved properties");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (propertyId) => {
    try {
      await removeFromCart(propertyId);
      fetchSaved();
    } catch {
      alert("Failed to remove property");
    }
  };

  if (loading) {
    return (
      <section style={pageStyle}>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary mb-3" />
          <div className="text-muted">Loading saved properties…</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={pageStyle}>
        <div className="container py-4" style={{ maxWidth: 980 }}>
          <div className="alert alert-danger mb-0">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section style={pageStyle}>
      <div className="container py-4" style={{ maxWidth: 980 }}>
        {/* HEADER (MATCHES OTHER PAGES) */}
        <div className="mb-4 text-center">
          <h1 className="fw-bold mb-1" style={{ letterSpacing: "-0.4px" }}>
            Saved Properties
          </h1>
          <p className="text-muted mb-0">
            Your shortlisted properties appear here.
          </p>
        </div>

        {/* EMPTY STATE */}
        {properties.length === 0 ? (
          <div
            className="d-flex flex-column align-items-center justify-content-center text-center"
            style={{ minHeight: "50vh" }}
          >
            <div className="display-6 mb-2">💾</div>
            <h5 className="fw-bold">No saved properties</h5>
            <p className="text-muted mb-3" style={{ maxWidth: 480 }}>
              Browse properties and save the ones you like.
            </p>
            <Link to="/properties" className="btn btn-primary btn-lg px-5 rounded-3">
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {properties.map((p) => {
              const img =
                p.images?.find((x) => x.isPrimary)?.imageUrl ||
                p.images?.[0]?.imageUrl ||
                "https://via.placeholder.com/600x400?text=Property";

              return (
                <div className="col-sm-6 col-lg-4" key={p.id}>
                  <div className="card h-100 border-0 shadow-sm" style={cardStyle}>
                    {/* IMAGE */}
                    <div style={{ height: 200, background: "#eef1f6" }}>
                      <img
                        src={img}
                        alt={p.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    {/* BODY */}
                    <div className="card-body p-4">
                      <h6 className="fw-semibold mb-1">{p.title}</h6>
                      <div className="text-muted mb-2">📍 {p.city || "—"}</div>
                      <div className="fw-bold mb-3">₹ {p.price}</div>

                      <div className="d-flex gap-2">
                        <Link
                          to={`/properties/${p.id}`}
                          className="btn btn-primary w-100 rounded-3"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleRemove(p.id)}
                          className="btn btn-outline-danger w-100 rounded-3"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
