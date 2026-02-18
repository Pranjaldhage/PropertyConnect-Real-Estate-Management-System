import { useEffect, useState } from "react";
import PropertyCard from "../../components/PropertyCard";
import {
  getAllProperties,
  searchProperties,
} from "../../api/propertyApi";

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageStyle = {
    background: "#f6f8fc",
    minHeight: "calc(100vh - 56px)",
  };

  const shellStyle = {
    maxWidth: 980,
  };

  const cardStyle = {
    borderRadius: 18,
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await getAllProperties();
      setProperties(res.data);
    } catch {
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await searchProperties({
        city,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
      });
      setProperties(res.data);
    } catch {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    fetchAll();
  };

  return (
    <section style={pageStyle}>
      <div className="container py-4" style={shellStyle}>
        {/* HEADER */}
        <div className="mb-4 text-center">
          <h1 className="fw-bold mb-1" style={{ letterSpacing: "-0.4px" }}>
            Available Properties
          </h1>
          <p className="text-muted mb-0">
            Browse verified properties and find your perfect home
          </p>
        </div>

        {/* FILTER CARD */}
        <div
          className="card border-0 shadow-sm mb-4"
          style={cardStyle}
        >
          <div className="card-body p-4">
            <h5 className="fw-semibold mb-3">Search & Filter</h5>

            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label fw-semibold">City</label>
                <input
                  className="form-control"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">Min Price</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">Max Price</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              <div className="col-md-2 d-grid gap-2">
                <button
                  className="btn btn-primary rounded-3"
                  onClick={handleSearch}
                >
                  🔍 Search
                </button>
                <button
                  className="btn btn-outline-secondary rounded-3"
                  onClick={handleClear}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* STATES */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" />
            <div className="text-muted">Loading properties...</div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-5 text-muted">
            No properties found for the selected filters.
          </div>
        )}

        {/* GRID */}
        {!loading && !error && properties.length > 0 && (
          <div className="row g-4">
            {properties.map((p) => (
              <div className="col-sm-6 col-md-4" key={p.id}>
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
