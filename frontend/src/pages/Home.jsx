import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const heroStyle = {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    backgroundImage:
      "linear-gradient(120deg, rgba(0,0,0,0.72), rgba(0,0,0,0.35)), url('https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1600&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const cardStyle = {
    borderRadius: 18,
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
    backgroundColor: "#ffffff",
  };

  const hoverOn = (e) => {
    e.currentTarget.style.transform = "translateY(-3px)";
    e.currentTarget.style.boxShadow = "0 0.6rem 1.6rem rgba(0,0,0,0.10)";
  };

  const hoverOff = (e) => {
    e.currentTarget.style.transform = "translateY(0px)";
    e.currentTarget.style.boxShadow = "";
  };

  const btnHoverOn = (e) => {
    e.currentTarget.style.transform = "translateY(-1px)";
  };

  const btnHoverOff = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
  };

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="text-white" style={heroStyle}>
        <div className="container py-5">
          <div className="col-lg-8">
            <h1
              className="fw-bold mb-2"
              style={{ fontSize: "3rem", letterSpacing: "-0.5px" }}
            >
              Find Your Dream Home <span className="text-warning">Today</span>
            </h1>

            <p className="text-white-50 mb-4" style={{ maxWidth: 620 }}>
              Browse verified properties, save your favorites, and connect with
              sellers instantly.
            </p>

            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-primary btn-lg px-4 rounded-3 shadow-sm"
                onMouseEnter={btnHoverOn}
                onMouseLeave={btnHoverOff}
                onClick={() => navigate("/properties")}
              >
                Browse Properties
              </button>

              <button
                className="btn btn-outline-light btn-lg px-4 rounded-3"
                onMouseEnter={btnHoverOn}
                onMouseLeave={btnHoverOff}
                onClick={() => navigate("/customer/dashboard")}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="border-bottom" style={{ background: "#f8f9fb" }}>
        <div className="container py-5">
          <div className="row g-4 text-center">
            <StatCard
              value="500+"
              label="Verified Listings"
              cardStyle={cardStyle}
              hoverOn={hoverOn}
              hoverOff={hoverOff}
            />
            <StatCard
              value="200+"
              label="Happy Customers"
              cardStyle={cardStyle}
              hoverOn={hoverOn}
              hoverOff={hoverOff}
            />
            <StatCard
              value="50+"
              label="Trusted Agents"
              cardStyle={cardStyle}
              hoverOn={hoverOn}
              hoverOff={hoverOff}
            />
          </div>
        </div>
      </section>

      {/* Soft divider */}
      <div style={{ height: 40, background: "#f6f8fc" }} />

      {/* ================= FEATURES ================= */}
      <section style={{ background: "linear-gradient(180deg, #ffffff, #f6f8fc)" }}>
        <div className="container py-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-1" style={{ letterSpacing: "-0.4px" }}>
              Why Choose Us?
            </h2>
            <p className="text-muted mb-0">
              Simple experience for searching, saving, and contacting sellers.
            </p>
          </div>

          <div className="row g-4">
            <FeatureCard
              icon="🏠"
              title="Verified Properties"
              text="Every listing is reviewed for authenticity."
              cardStyle={cardStyle}
              hoverOn={hoverOn}
              hoverOff={hoverOff}
              highlight
            />
            <FeatureCard
              icon="💬"
              title="Easy Enquiry"
              text="Contact owners instantly and track your requests."
              cardStyle={cardStyle}
              hoverOn={hoverOn}
              hoverOff={hoverOff}
            />
            <FeatureCard
              icon="💾"
              title="Save Favorites"
              text="Shortlist properties and revisit anytime."
              cardStyle={cardStyle}
              hoverOn={hoverOn}
              hoverOff={hoverOff}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function StatCard({ value, label, cardStyle, hoverOn, hoverOff }) {
  return (
    <div className="col-md-4">
      <div
        className="shadow-sm p-4"
        style={cardStyle}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
      >
        <div className="fw-bold text-primary" style={{ fontSize: "2rem" }}>
          {value}
        </div>
        <div className="text-muted">{label}</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text, cardStyle, hoverOn, hoverOff, highlight }) {
  return (
    <div className="col-md-4">
      <div
        className="card h-100 border-0 shadow-sm text-center"
        style={cardStyle}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
      >
        <div className="card-body p-4 d-flex flex-column align-items-center">

          <div
            className="d-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{
              width: 60,
              height: 60,
              background:
                "linear-gradient(135deg, rgba(13,110,253,0.15), rgba(13,110,253,0.05))",
              fontSize: 26,
            }}
          >
            {icon}
          </div>

          <h5 className="fw-semibold mb-1">{title}</h5>
          <p className="text-muted mb-0">{text}</p>
        </div>
      </div>
    </div>
  );
}


