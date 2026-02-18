import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  return (
    <div className="card h-100 shadow-sm border-0 rounded-3">
      <div className="card-body d-flex flex-column">
        <h5 className="fw-semibold mb-2">
          {property.title}
        </h5>

        <div className="text-muted mb-1">
          📍 {property.city}
        </div>

        <div className="fw-bold mb-1">
          ₹ {property.price?.toLocaleString()}
        </div>

        <div className="text-muted mb-3">
          {property.areaSqft} sq.ft
        </div>

        <Link
          to={`/properties/${property.id}`}
          className="btn btn-outline-primary mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
