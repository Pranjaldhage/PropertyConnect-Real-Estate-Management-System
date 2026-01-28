import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAdminProperties,
  approveProperty,
  rejectProperty,
} from "../../api/propertyApi";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);

  const [status, setStatus] = useState("PENDING");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [processingId, setProcessingId] = useState(null);

  /* ======================
     LOAD DATA
  ====================== */

  useEffect(() => {
    fetchAdminProperties();
  }, [status, page]);

  const fetchAdminProperties = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getAdminProperties({
        status,
        page,
        size: 9,
      });

      setProperties(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     ACTIONS
  ====================== */

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this property?")) return;

    try {
      setProcessingId(id);
      await approveProperty(id);
      fetchAdminProperties();
    } catch (err) {
      console.error(err);
      alert("Approval failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this property?")) return;

    try {
      setProcessingId(id);
      await rejectProperty(id);
      fetchAdminProperties();
    } catch (err) {
      console.error(err);
      alert("Rejection failed");
    } finally {
      setProcessingId(null);
    }
  };

  const goToDetails = (id) => {
    navigate(`/properties/${id}`);
  };

  /* ======================
     UI STATES
  ====================== */

  if (loading)
    return (
      <h2 style={{ padding: 20 }}>
        ⏳ Loading {status.toLowerCase()} properties...
      </h2>
    );

  if (error)
    return (
      <h2 style={{ padding: 20, color: "red" }}>
        {error}
      </h2>
    );

  return (
    <div style={{ padding: 20 }}>
      <h2>🛠 Admin Dashboard</h2>

      {/* ======================
         STATUS TABS
      ====================== */}

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {["PENDING", "APPROVED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s);
              setPage(0);
            }}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: "1px solid #ccc",
              cursor: "pointer",
              background:
                status === s ? "#1976d2" : "#eee",
              color:
                status === s ? "white" : "black",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {properties.length === 0 && (
        <p style={{ marginTop: 20 }}>
          🎉 No {status.toLowerCase()} properties
        </p>
      )}

      {/* ======================
         GRID
      ====================== */}

      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 22,
        }}
      >
        {properties.map((p) => {
          const primaryImage =
            p.images?.find((img) => img.isPrimary) ||
            p.images?.[0];

          return (
            <div
              key={p.id}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                borderRadius: 8,
                background: "#fafafa",
              }}
            >
              <img
                src={
                  primaryImage?.imageUrl ||
                  "https://via.placeholder.com/400x250?text=No+Image"
                }
                alt={p.title}
                onClick={() => goToDetails(p.id)}
                style={{
                  width: "100%",
                  height: 170,
                  objectFit: "cover",
                  borderRadius: 6,
                  marginBottom: 10,
                  cursor: "pointer",
                }}
              />

              <h3>{p.title}</h3>
              <p>{p.city}</p>
              <p>
                <b>₹ {p.price}</b>
              </p>
              <p>Status: {p.status}</p>

              {/* ACTIONS */}
              {status === "PENDING" && (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() =>
                      goToDetails(p.id)
                    }
                    style={{
                      background: "#1976d2",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      cursor: "pointer",
                    }}
                  >
                    👁 View Details
                  </button>

                  <button
                    onClick={() =>
                      handleApprove(p.id)
                    }
                    disabled={
                      processingId === p.id
                    }
                    style={{
                      background: "green",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      cursor: "pointer",
                    }}
                  >
                    ✅ Approve
                  </button>

                  <button
                    onClick={() =>
                      handleReject(p.id)
                    }
                    disabled={
                      processingId === p.id
                    }
                    style={{
                      background: "#b00020",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      cursor: "pointer",
                    }}
                  >
                    🚫 Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ======================
         PAGINATION
      ====================== */}

      {totalPages > 1 && (
        <div
          style={{
            marginTop: 30,
            display: "flex",
            justifyContent: "center",
            gap: 14,
          }}
        >
          <button
            disabled={page === 0}
            onClick={() =>
              setPage((p) => p - 1)
            }
          >
            ◀ Prev
          </button>

          <span>
            Page {page + 1} of {totalPages}
          </span>

          <button
            disabled={page === totalPages - 1}
            onClick={() =>
              setPage((p) => p + 1)
            }
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}
