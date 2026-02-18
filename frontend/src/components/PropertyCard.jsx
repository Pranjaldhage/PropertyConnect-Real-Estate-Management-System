import { useNavigate } from "react-router-dom";

export default function PropertyCard({ property }) {
  const navigate = useNavigate();

  return (
    <div className="card h-100 shadow-sm border-0 rounded-3">
      {/* IMAGE */}
      <img
        src={
          property.images?.[0]?.imageUrl ||
          "https://via.placeholder.com/400x250?text=Property"
        }
        alt={property.title}
        className="card-img-top"
        style={{ height: 180, objectFit: "cover" }}
      />

      {/* BODY */}
      <div className="card-body d-flex flex-column">
        <h5 className="fw-semibold mb-1">{property.title}</h5>

        <div className="text-muted mb-1">
          📍 {property.city}
        </div>

        <div className="fw-bold mb-2">
          ₹ {property.price?.toLocaleString()}
        </div>

        <button
          onClick={() => navigate(`/properties/${property.id}`)}
          className="btn btn-outline-primary mt-auto"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
