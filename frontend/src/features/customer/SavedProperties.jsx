import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  getSavedProperties,
  removeFromCart,
} from "../../api/cartApi";

import { getPropertyById } from "../../api/propertyApi";

import {
  selectIsLoggedIn,
  setSavedCount,
} from "../../store/authSlice";

export default function SavedProperties() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [items, setItems] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth/login");
      return;
    }

    fetchSaved();
  }, [isLoggedIn]);

  const fetchSaved = async () => {
    try {
      setLoading(true);

      const res = await getSavedProperties();
      const cartItems = res.data.items || [];

      setItems(cartItems);

      // 🔥 update navbar badge
      const totalQty = cartItems.reduce(
  (sum, i) => sum + i.quantity,
  0
);

dispatch(setSavedCount(totalQty));

      // 🔥 fetch property details
      const details = await Promise.all(
  cartItems.map(async (i) => {
    try {
      const r = await getPropertyById(i.propertyId);

      return {
        ...r.data,
        quantity: i.quantity,
        price: i.price,
      };
    } catch {
      return null;
    }
  })
);

setProperties(details.filter(Boolean));


      setProperties(details);
    } catch (err) {
      console.error("Failed to fetch saved", err);
      setError("Failed to load saved properties");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (propertyId) => {
    try {
      await removeFromCart(propertyId);

      // re-fetch cart → sync redux + UI
      fetchSaved();
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  if (loading)
    return <p className="p-6">Loading saved properties...</p>;

  if (error)
    return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Saved Properties
      </h1>

      {properties.length === 0 ? (
        <p>No saved properties.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {properties.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                overflow: "hidden",
                background: "white",
              }}
            >
              {/* IMAGE */}
              <img
                src={
                  p.images?.[0]?.imageUrl ||
                  "https://via.placeholder.com/400x250"
                }
                alt={p.title}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: 14 }}>
                <h3>{p.title}</h3>

                <p>{p.city}</p>

                <p>₹ {p.price}</p>

                <p>Qty: {p.quantity}</p>

                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    gap: 10,
                  }}
                >
                  <Link
                    to={`/properties/${p.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    View
                  </Link>

                  <button
                    onClick={() =>
                      handleRemove(p.id)
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
