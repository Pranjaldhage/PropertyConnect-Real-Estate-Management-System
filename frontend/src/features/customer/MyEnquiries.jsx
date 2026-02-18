import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyEnquiries } from "../../api/enquiryApi";
import { getMyProfile } from "../../api/userApi";
import { getPropertyById } from "../../api/propertyApi";

export default function MyEnquiries() {
  const [items, setItems] = useState([]); // enquiries + property
  const [loading, setLoading] = useState(true);

  const pageStyle = {
    background: "#f6f8fc",
    minHeight: "calc(100vh - 56px)",
  };

  const shellStyle = {
    maxWidth: 1100,
  };

  const cardStyle = {
    borderRadius: 18,
    backgroundColor: "#ffffff",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
  };

  const hoverOn = (e) => {
    e.currentTarget.style.transform = "translateY(-3px)";
    e.currentTarget.style.boxShadow = "0 0.6rem 1.6rem rgba(0,0,0,0.10)";
  };

  const hoverOff = (e) => {
    e.currentTarget.style.transform = "translateY(0px)";
    e.currentTarget.style.boxShadow = "";
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // keep profile call if backend needs auth/profile validation
      await getMyProfile();

      const enquiryRes = await getMyEnquiries();
      const enquiries = enquiryRes.data || [];

      // ✅ Fetch property details for each enquiry
      const merged = await Promise.all(
        enquiries.map(async (e) => {
          try {
            const pRes = await getPropertyById(e.propertyId);
            return { enquiry: e, property: pRes.data };
          } catch (err) {
            // if property fetch fails, still show enquiry
            return { enquiry: e, property: null };
          }
        })
      );

      setItems(merged);
    } catch (err) {
      console.error("Failed to fetch enquiries", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  };

  const getImg = (p) => {
    if (!p) return "https://via.placeholder.com/800x500?text=Property";
    return (
      p.images?.find((x) => x.isPrimary)?.imageUrl ||
      p.images?.[0]?.imageUrl ||
      "https://via.placeholder.com/800x500?text=Property"
    );
  };

  return (
    <section style={pageStyle}>
      <div className="container py-4" style={shellStyle}>
        {/* HEADER */}
        <div className="mb-4 text-center">
          <h1 className="fw-bold mb-1" style={{ letterSpacing: "-0.4px" }}>
            My Enquiries
          </h1>
          <p className="text-muted mb-0">
            View your enquiry message along with full property details.
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <div className="spinner-border text-primary mb-3" role="status" />
            <div className="text-muted">Loading enquiries...</div>
          </div>
        ) : items.length === 0 ? (
          /* EMPTY */
          <div
            className="card border-0 shadow-sm mx-auto"
            style={{ ...cardStyle, maxWidth: 720 }}
          >
            <div className="card-body p-5 text-center">
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
                💬
              </div>

              <h4 className="fw-bold mb-2">No enquiries yet</h4>
              <p
                className="text-muted mb-4"
                style={{ maxWidth: 520, margin: "0 auto" }}
              >
                When you send an enquiry to a property owner, it will appear
                here.
              </p>

              <Link
                to="/properties"
                className="btn btn-primary btn-lg px-5 rounded-3 shadow-sm"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        ) : (
          /* GRID */
          <div className="row g-4">
            {items.map(({ enquiry, property }) => {
              const img = getImg(property);

              return (
                <div key={enquiry.id} className="col-12 col-md-6 col-lg-4">
                  <div
                    className="card h-100 border-0 shadow-sm overflow-hidden"
                    style={cardStyle}
                    onMouseEnter={hoverOn}
                    onMouseLeave={hoverOff}
                  >
                    {/* IMAGE */}
                    <div style={{ height: 190, background: "#eef1f6" }}>
                      <img
                        src={img}
                        alt={property?.title || "Property"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    <div className="card-body p-4">
                      {/* TITLE + PRICE */}
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <h6 className="fw-bold mb-1" style={{ lineHeight: 1.2 }}>
                          {property?.title || `Property #${enquiry.propertyId}`}
                        </h6>

                        {property?.price != null && (
                          <span className="badge bg-success rounded-pill px-3 py-2">
                            ₹ {property.price}
                          </span>
                        )}
                      </div>

                      {/* LOCATION */}
                      <div className="text-muted mb-3">
                        📍 {property?.city || "—"}
                        {property?.state ? `, ${property.state}` : ""}
                      </div>

                      {/* ENQUIRY DATE */}
                      <div className="text-muted small mb-2">
                        Enquiry Date:{" "}
                        <span className="fw-semibold">
                          {formatDate(enquiry.createdAt)}
                        </span>
                      </div>

                      {/* MESSAGE */}
                      <div
                        className="border rounded-3 p-3"
                        style={{
                          minHeight: 95,
                          background: "#f8f9fb",
                        }}
                      >
                        <div className="text-muted small mb-1">Your Message</div>
                        <div
                          className="fw-semibold"
                          style={{ wordBreak: "break-word" }}
                        >
                          {enquiry.message || "—"}
                        </div>
                      </div>

                      {/* BUTTONS */}
                      <div className="d-flex gap-2 mt-3">
                        <Link
                          to={`/properties/${enquiry.propertyId}`}
                          className="btn btn-primary rounded-3 w-100"
                        >
                          View Full Details
                        </Link>

                        <Link
                          to="/properties"
                          className="btn btn-outline-secondary rounded-3"
                          title="Browse more properties"
                        >
                          🔍
                        </Link>
                      </div>

                      {/* PROPERTY NOT FOUND */}
                      {!property && (
                        <div className="alert alert-warning mt-3 py-2 mb-0">
                          Property details not available (maybe deleted).
                        </div>
                      )}
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
