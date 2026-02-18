import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  getPropertyById,
  getPropertyImages,
  approveProperty,
  rejectProperty,
} from "../../api/propertyApi";

import { sendEnquiry } from "../../api/enquiryApi";
import { addToCart, getSavedProperties } from "../../api/cartApi";

import { selectIsAdmin, selectIsLoggedIn } from "../../store/authSlice";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isAdmin = useSelector(selectIsAdmin);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const [processing, setProcessing] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "", "saved", "already", "error"

  const pageStyle = {
    background: "#f6f8fc",
    minHeight: "calc(100vh - 56px)",
  };

  const shellStyle = {
    maxWidth: 980,
  };

  const cardStyle = {
    borderRadius: 18,
    overflow: "hidden",
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isLoggedIn]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setStatus("");

      const [propRes, imgRes] = await Promise.all([
        getPropertyById(id),
        getPropertyImages(id),
      ]);

      setProperty(propRes.data);
      setImages(imgRes.data || []);

      if (isLoggedIn) {
        try {
          const savedRes = await getSavedProperties();
          const items = savedRes?.data?.items || [];

          const alreadySaved = items.some(
            (x) => String(x.propertyId) === String(id)
          );

          if (alreadySaved) setSaveStatus("saved");
          else setSaveStatus("");
        } catch (e) {
          console.error("CHECK_SAVED_ERROR:", e);
          setSaveStatus("");
        }
      } else {
        setSaveStatus("");
      }
    } catch (err) {
      console.error(err);
      setStatus("Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
       SAVE PROPERTY
  ====================== */

  const handleSave = async () => {
    if (!isLoggedIn) {
      navigate(`/auth/login?redirect=/properties/${id}`);
      return;
    }

    if (saving || saveStatus === "saved" || saveStatus === "already") return;

    try {
      setSaving(true);
      setSaveStatus("");

      await addToCart(id, property.price);

      setSaveStatus("saved");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message?.toLowerCase() || "";
      if (msg.includes("already")) setSaveStatus("already");
      else setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  /* ======================
        ADMIN
  ====================== */

  const handleApprove = async () => {
    if (!window.confirm("Approve this property?")) return;

    try {
      setProcessing(true);
      await approveProperty(id);
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Approval failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm("Reject this property?")) return;

    try {
      setProcessing(true);
      await rejectProperty(id);
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Rejection failed");
    } finally {
      setProcessing(false);
    }
  };

  /* ======================
       UI STATES
  ====================== */

  if (loading) {
    return (
      <section style={pageStyle}>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
          <div className="text-muted">Loading property details...</div>
        </div>
      </section>
    );
  }

  if (!property) {
    return (
      <section style={pageStyle}>
        <div className="container py-5 text-center">
          <h4 className="text-danger">{status || "Property not found"}</h4>
        </div>
      </section>
    );
  }

  return (
    <section style={pageStyle}>
      <div className="container py-4" style={shellStyle}>
        {/* HEADER (matches other pages) */}
        <div className="mb-4 text-center">
          <h1 className="fw-bold mb-1" style={{ letterSpacing: "-0.4px" }}>
            Property Details
          </h1>
          <p className="text-muted mb-0">
            View full details, images, and contact the owner.
          </p>
        </div>

        {/* IMAGE GALLERY */}
        {images.length > 0 ? (
          <div className="row g-3 mb-4">
            {images.map((img) => (
              <div key={img.id} className="col-md-4">
                <img
                  src={img.imageUrl}
                  alt="property"
                  className="img-fluid shadow-sm"
                  style={{
                    borderRadius: 18,
                    height: 220,
                    width: "100%",
                    objectFit: "cover",
                    background: "#eef1f6",
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted text-center mb-4">No images available</div>
        )}

        {/* MAIN CARD */}
        <div className="card border-0 shadow-sm" style={cardStyle}>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <h2 className="fw-bold mb-1">{property.title}</h2>
                <p className="text-muted mb-0">
                  {property.city}, {property.state}
                </p>
              </div>

              <span className="badge bg-success fs-6 px-3 py-2 rounded-3">
                ₹ {property.price}
              </span>
            </div>

            <p className="mt-3 mb-2">{property.description}</p>

            <p className="small text-secondary mb-0">
              📍 {property.addressLine}, {property.state} - {property.pincode}
            </p>

            {/* SAVE */}
            {!isAdmin && (
              <div className="mt-4">
                <button
                  onClick={handleSave}
                  disabled={
                    !isLoggedIn ||
                    saving ||
                    saveStatus === "saved" ||
                    saveStatus === "already"
                  }
                  className={`btn btn-lg px-4 rounded-3 ${
                    saveStatus === "saved" || saveStatus === "already"
                      ? "btn-success"
                      : "btn-primary"
                  }`}
                  title={!isLoggedIn ? "Login to save" : ""}
                >
                  {!isLoggedIn
                    ? "Login to Save"
                    : saving
                    ? "Saving..."
                    : saveStatus === "saved"
                    ? "✅ Saved"
                    : saveStatus === "already"
                    ? "✅ Already Saved"
                    : "💾 Save Property"}
                </button>

                {saveStatus === "error" && (
                  <div className="alert alert-danger mt-3 py-2 mb-0">
                    ❌ Failed to save property
                  </div>
                )}

                {(saveStatus === "saved" || saveStatus === "already") && (
                  <Link
                    to="/customer/saved"
                    className="d-block mt-2 fw-semibold text-decoration-none"
                  >
                    View Saved Properties →
                  </Link>
                )}
              </div>
            )}

            {/* ADMIN ACTIONS */}
            {isAdmin && property.status === "PENDING" && (
              <>
                <hr className="my-4" />
                <h5 className="fw-bold mb-3">Admin Actions</h5>

                <div className="d-flex gap-2 flex-wrap">
                  <button
                    onClick={handleApprove}
                    disabled={processing}
                    className="btn btn-success px-4 rounded-3"
                  >
                    {processing ? "Processing..." : "✅ Approve"}
                  </button>

                  <button
                    onClick={handleReject}
                    disabled={processing}
                    className="btn btn-danger px-4 rounded-3"
                  >
                    {processing ? "Processing..." : "🚫 Reject"}
                  </button>
                </div>
              </>
            )}

            {/* ENQUIRY */}
            {!isAdmin && (
              <>
                <hr className="my-4" />
                <h5 className="fw-bold mb-3">Send Enquiry</h5>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();

                    if (!message.trim()) {
                      setStatus("Message cannot be empty");
                      return;
                    }

                    try {
                      await sendEnquiry({ propertyId: property.id, message });
                      setStatus("✅ Enquiry sent successfully!");
                      setMessage("");
                    } catch (err) {
                      console.error(err);
                      setStatus("❌ Failed to send enquiry");
                    }
                  }}
                >
                  <textarea
                    rows={4}
                    className="form-control mb-3"
                    placeholder="Write your enquiry here..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setStatus("");
                    }}
                  />

                  <button className="btn btn-outline-primary px-4 rounded-3">
                    Send Enquiry
                  </button>

                  {status && (
                    <div
                      className={`alert mt-3 py-2 mb-0 ${
                        status.includes("✅") ? "alert-success" : "alert-danger"
                      }`}
                    >
                      {status}
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
