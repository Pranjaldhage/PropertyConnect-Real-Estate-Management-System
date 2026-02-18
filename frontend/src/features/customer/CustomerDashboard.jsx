import { Link } from "react-router-dom";

export default function CustomerDashboard() {
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

  return (
    <section style={{ background: "#f6f8fc", minHeight: "100vh" }}>
      <div className="container py-5">

        {/* HEADER */}
        <div className="mb-5 text-center">
          <h1 className="fw-bold mb-1" style={{ letterSpacing: "-0.4px" }}>
            Customer Dashboard
          </h1>
          <p className="text-muted mb-0">
            Manage your profile, enquiries, and saved properties
          </p>
        </div>

        {/* CARDS */}
        <div className="row g-4">
          <DashboardCard
            icon="👤"
            title="My Profile"
            description="View and update your personal details"
            link="/customer/profile"
            cardStyle={cardStyle}
            hoverOn={hoverOn}
            hoverOff={hoverOff}
          />

          <DashboardCard
            icon="💬"
            title="My Enquiries"
            description="Track your property enquiries"
            link="/customer/enquiries"
            cardStyle={cardStyle}
            hoverOn={hoverOn}
            hoverOff={hoverOff}
          />

          <DashboardCard
            icon="💾"
            title="Saved Properties"
            description="View your shortlisted homes"
            link="/customer/saved"
            cardStyle={cardStyle}
            hoverOn={hoverOn}
            hoverOff={hoverOff}
          />

          <DashboardCard
            icon="🏠"
            title="Browse Properties"
            description="Explore new properties"
            link="/properties"
            cardStyle={cardStyle}
            hoverOn={hoverOn}
            hoverOff={hoverOff}
          />
        </div>
      </div>
    </section>
  );
}

function DashboardCard({
  icon,
  title,
  description,
  link,
  cardStyle,
  hoverOn,
  hoverOff,
}) {
  return (
    <div className="col-sm-6 col-lg-3">
      <Link to={link} className="text-decoration-none text-dark">
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

            <h5 className="fw-semibold mb-2">{title}</h5>
            <p className="text-muted mb-0">{description}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
