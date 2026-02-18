import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminProperties,
  approveProperty,
  rejectProperty,
} from "../../api/propertyApi";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("PENDING");
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const pageStyle = {
    background: "#f6f8fc",
    minHeight: "calc(100vh - 56px)",
  };

  const shellStyle = {
    maxWidth: 1100,
  };

  const cardStyle = {
    borderRadius: 18,
  };

  // ✅ visible pill colors (fix for "not visible" issue)
  const statusPillClass = (s) => {
    if (s === "PENDING") return "bg-warning text-dark";
    if (s === "APPROVED") return "bg-success";
    if (s === "REJECTED") return "bg-danger";
    return "bg-secondary";
  };

  useEffect(() => {
    fetchAdminProperties();
    // eslint-disable-next-line
  }, [status, page]);

  const fetchAdminProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAdminProperties({ status, page, size: 9 });
      setProperties(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (e) {
      console.error(e);
      setError("❌ Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this property?")) return;
    try {
      setProcessingId(id);
      await approveProperty(id);
      fetchAdminProperties();
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
      alert("Rejection failed");
    } finally {
      setProcessingId(null);
    }
  };

  const setTab = (nextStatus) => {
    setStatus(nextStatus);
    setPage(0);
  };

  return (
    <section style={pageStyle}>
      <div className="container py-4" style={shellStyle}>
        {/* HEADER */}
        <div className="mb-4 text-center">
          <h1 className="fw-bold mb-1" style={{ letterSpacing: "-0.4px" }}>
            Admin Dashboard
          </h1>
          <p className="text-muted mb-0">Manage listings and approvals</p>
        </div>

        {/* STATUS FILTER (matches your screenshot) */}
        <div className="card border-0 shadow-sm mb-4" style={cardStyle}>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
              <div>
                <h5 className="fw-bold mb-1">Status Filter</h5>
                <p className="text-muted mb-0">
                  Select a status to view properties
                </p>
              </div>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span
                  className={`badge rounded-pill px-3 py-2 ${statusPillClass(
                    status
                  )}`}
                >
                  {status}
                </span>

                <button
                  className="btn btn-primary rounded-3 px-3"
                  onClick={fetchAdminProperties}
                >
                  🔄 Refresh
                </button>

                <button
                  className="btn btn-outline-secondary rounded-3 px-3"
                  onClick={() => navigate("/")}
                >
                  Home
                </button>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <button
                  className={`btn w-100 rounded-3 ${
                    status === "PENDING" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  style={{ height: 48 }}
                  onClick={() => setTab("PENDING")}
                >
                  ⏳ Pending
                </button>
              </div>

              <div className="col-md-4">
                <button
                  className={`btn w-100 rounded-3 ${
                    status === "APPROVED" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  style={{ height: 48 }}
                  onClick={() => setTab("APPROVED")}
                >
                  ✅ Approved
                </button>
              </div>

              <div className="col-md-4">
                <button
                  className={`btn w-100 rounded-3 ${
                    status === "REJECTED" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  style={{ height: 48 }}
                  onClick={() => setTab("REJECTED")}
                >
                  ⛔ Rejected
                </button>
              </div>
            </div>

            <div className="text-muted small mt-3">
              Showing <b>{properties.length}</b> item(s) on this page.
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="card border-0 shadow-sm" style={cardStyle}>
            <div className="card-body p-5 text-center">
              <div className="spinner-border text-primary mb-3" role="status" />
              <div className="text-muted">Loading properties...</div>
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="card border-0 shadow-sm" style={cardStyle}>
            <div className="card-body p-4 text-center">
              <div className="text-danger fw-semibold mb-3">{error}</div>
              <button
                className="btn btn-primary rounded-3"
                onClick={fetchAdminProperties}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && properties.length === 0 && (
          <div className="card border-0 shadow-sm" style={cardStyle}>
            <div className="card-body p-5 text-center">
              <h4 className="fw-bold mb-2">No {status} Properties</h4>
              <p className="text-muted mb-0">
                You’re all caught up. Switch status to check other listings.
              </p>
            </div>
          </div>
        )}

        {/* GRID */}
        {!loading && !error && properties.length > 0 && (
          <>
            <div className="row g-4">
              {properties.map((p) => {
                const primaryImage =
                  p.images?.find((img) => img.isPrimary) || p.images?.[0];
                const busy = processingId === p.id;

                return (
                  <div key={p.id} className="col-md-6 col-lg-4">
                    <div
                      className="card h-100 border-0 shadow-sm overflow-hidden"
                      style={cardStyle}
                    >
                      {/* IMAGE */}
                      <img
                        src={
                          primaryImage?.imageUrl ||
                          "https://via.placeholder.com/800x500?text=No+Image"
                        }
                        alt={p.title}
                        style={{
                          height: 180,
                          width: "100%",
                          objectFit: "cover",
                          cursor: "pointer",
                          background: "#eef1f6",
                        }}
                        onClick={() => navigate(`/properties/${p.id}`)}
                      />

                      {/* BODY */}
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <h6 className="fw-semibold mb-1">{p.title}</h6>

                          {/* ✅ FIXED BADGE (now visible) */}
                          <span
                            className={`badge rounded-pill px-3 py-2 ${statusPillClass(
                              p.status
                            )}`}
                            style={{ fontSize: "0.75rem" }}
                          >
                            {p.status}
                          </span>
                        </div>

                        <div className="text-muted mb-2">📍 {p.city || "—"}</div>
                        <div className="fw-bold mb-3">₹ {p.price}</div>

                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            className="btn btn-outline-primary rounded-3"
                            onClick={() => navigate(`/properties/${p.id}`)}
                          >
                            View Details
                          </button>

                          {status === "PENDING" && (
                            <>
                              <button
                                className="btn btn-success rounded-3"
                                onClick={() => handleApprove(p.id)}
                                disabled={busy}
                              >
                                {busy ? "Processing..." : "Approve"}
                              </button>

                              <button
                                className="btn btn-danger rounded-3"
                                onClick={() => handleReject(p.id)}
                                disabled={busy}
                              >
                                {busy ? "Processing..." : "Reject"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
                <button
                  className="btn btn-outline-secondary rounded-3"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ◀ Prev
                </button>

                <span className="fw-semibold text-muted">
                  Page <span className="text-dark">{page + 1}</span> of{" "}
                  <span className="text-dark">{totalPages}</span>
                </span>

                <button
                  className="btn btn-outline-secondary rounded-3"
                  disabled={page === totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next ▶
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
