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
import { addToCart } from "../../api/cartApi";

import {
  selectIsAdmin,
  selectIsLoggedIn,
} from "../../store/authSlice";

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
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const [propRes, imgRes] = await Promise.all([
        getPropertyById(id),
        getPropertyImages(id),
      ]);

      setProperty(propRes.data);
      setImages(imgRes.data);
    } catch (err) {
      console.error(err);
      setStatus("Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
       CART SAVE
  ====================== */

  const handleSave = async () => {
  if (!isLoggedIn) {
    navigate(`/auth/login?redirect=/properties/${id}`);
    return;
  }

  try {
    setSaving(true);
    setSaveStatus("");

    await addToCart(property.id, property.price);

    setSaveStatus("✅ Property saved!");
  } catch (err) {
    console.error(err);
    setSaveStatus("❌ Failed to save property");
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

  if (loading) return <h2>Loading...</h2>;
  if (!property) return <h2>{status}</h2>;

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      {/* IMAGE GALLERY */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {images.length > 0 ? (
          images.map((img) => (
            <img
              key={img.id}
              src={img.imageUrl}
              alt="property"
              width={260}
              height={180}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      {/* PROPERTY INFO */}
      <h2>{property.title}</h2>
      <p>
        <b>City:</b> {property.city}
      </p>
      <p>
        <b>State:</b> {property.state}
      </p>
      <p>
        <b>Price:</b> ₹ {property.price}
      </p>
      <p>{property.description}</p>

      <p>
        {property.addressLine}, {property.state} - {property.pincode}
      </p>

      {/* ======================
     SAVE BUTTON
====================== */}

{!isAdmin && isLoggedIn && (
  <div style={{ marginTop: 20 }}>
    <button
      onClick={handleSave}
      disabled={saving}
      style={{
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: 6,
        cursor: "pointer",
        opacity: saving ? 0.6 : 1,
      }}
    >
      {saving ? "Saving..." : "💾 Save Property"}
    </button>

    {saveStatus && (
      <p style={{ marginTop: 8 }}>{saveStatus}</p>
    )}

    {saveStatus.includes("saved") && (
      <Link
        to="/customer/saved"
        style={{ display: "block", marginTop: 6 }}
      >
        View Saved Properties →
      </Link>
    )}
  </div>
)}

      {/* ======================
           ADMIN ACTIONS
      ====================== */}

      {isAdmin && property.status === "PENDING" && (
        <>
          <hr />

          <h3>Admin Actions</h3>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={handleApprove}
              disabled={processing}
              style={{
                background: "green",
                color: "white",
                border: "none",
                padding: "8px 14px",
                cursor: "pointer",
                opacity: processing ? 0.6 : 1,
              }}
            >
              {processing ? "Processing..." : "✅ Approve"}
            </button>

            <button
              onClick={handleReject}
              disabled={processing}
              style={{
                background: "#b00020",
                color: "white",
                border: "none",
                padding: "8px 14px",
                cursor: "pointer",
                opacity: processing ? 0.6 : 1,
              }}
            >
              {processing ? "Processing..." : "🚫 Reject"}
            </button>
          </div>
        </>
      )}

      {/* ======================
           CUSTOMER ENQUIRY
      ====================== */}

      {!isAdmin && (
        <>
          <hr />

          <h3>Send Enquiry</h3>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              if (!message.trim()) {
                setStatus("Message cannot be empty");
                return;
              }

              try {
                await sendEnquiry({
                  propertyId: property.id,
                  message,
                });

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
              style={{ width: "100%", marginBottom: 10 }}
              placeholder="Write your enquiry here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button type="submit">Send</button>

            {status && <p>{status}</p>}
          </form>
        </>
      )}
    </div>
  );
}
