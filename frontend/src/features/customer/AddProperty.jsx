import { useMemo, useState } from "react";
import axios from "axios";

const EMPTY_PROPERTY = {
  title: "",
  description: "",
  price: "",
  areaSqft: "",
  propertyType: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
};

const isValidUrl = (value) => {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

export default function AddProperty() {
  const [property, setProperty] = useState(EMPTY_PROPERTY);
  const [images, setImages] = useState([{ imageUrl: "", isPrimary: true }]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const trimmedProperty = useMemo(
    () => ({
      ...property,
      title: property.title.trim(),
      description: property.description.trim(),
      addressLine: property.addressLine.trim(),
      city: property.city.trim(),
      state: property.state.trim(),
      pincode: property.pincode.trim(),
    }),
    [property]
  );

  const showErr = (key) => submitted && !!fieldErrors[key];

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty((p) => ({ ...p, [name]: value }));
    clearMessages();
    // optional: live-clear that field error after user types
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleImageChange = (index, e) => {
    const { name, value } = e.target;
    const imgs = [...images];
    imgs[index][name] = value;
    setImages(imgs);

    clearMessages();
    // clear image-related errors as user edits
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.images;
      delete next[`imageUrl_${index}`];
      delete next.primaryImage;
      return next;
    });
  };

  const setPrimary = (index) => {
    setImages(images.map((img, i) => ({ ...img, isPrimary: i === index })));

    clearMessages();
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.primaryImage;
      return next;
    });
  };

  const addImageField = () => {
    setImages([...images, { imageUrl: "", isPrimary: false }]);
    clearMessages();
  };

  const validateAll = () => {
    const errors = {};

    // Title
    if (!trimmedProperty.title) errors.title = "Title is required.";
    else if (trimmedProperty.title.length < 3) errors.title = "Title must be at least 3 characters.";

    // Property Type
    if (!trimmedProperty.propertyType) errors.propertyType = "Property type is required.";

    // Description
    if (!trimmedProperty.description) errors.description = "Description is required.";
    else if (trimmedProperty.description.length < 10)
      errors.description = "Description must be at least 10 characters.";

    // Price
    const priceNum = Number(trimmedProperty.price);
    if (!trimmedProperty.price) errors.price = "Price is required.";
    else if (Number.isNaN(priceNum) || priceNum <= 0) errors.price = "Enter a valid price greater than 0.";

    // Area
    const areaNum = Number(trimmedProperty.areaSqft);
    if (!trimmedProperty.areaSqft) errors.areaSqft = "Area is required.";
    else if (Number.isNaN(areaNum) || areaNum <= 0) errors.areaSqft = "Enter a valid area greater than 0.";

    // Address
    if (!trimmedProperty.addressLine) errors.addressLine = "Address line is required.";
    if (!trimmedProperty.city) errors.city = "City is required.";
    if (!trimmedProperty.state) errors.state = "State is required.";

    // Pincode (India 6 digits)
    if (!trimmedProperty.pincode) errors.pincode = "Pincode is required.";
    else if (!/^\d{6}$/.test(trimmedProperty.pincode))
      errors.pincode = "Pincode must be exactly 6 digits.";

    // Images
    if (!Array.isArray(images) || images.length === 0) {
      errors.images = "At least one image URL is required.";
    } else {
      const hasAnyUrl = images.some((img) => (img.imageUrl || "").trim().length > 0);
      if (!hasAnyUrl) errors.images = "At least one image URL is required.";

      images.forEach((img, idx) => {
        const url = (img.imageUrl || "").trim();
        if (url && !isValidUrl(url)) {
          errors[`imageUrl_${idx}`] = "Enter a valid URL (https://...)";
        }
      });

      const primaryCount = images.filter((i) => i.isPrimary).length;
      if (primaryCount !== 1) {
        errors.primaryImage = "Please select exactly one primary image.";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitProperty = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    clearMessages();

    const ok = validateAll();
    if (!ok) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8086/properties",
        {
          ...trimmedProperty,
          price: Number(trimmedProperty.price),
          areaSqft: Number(trimmedProperty.areaSqft),
          images: images.map((img) => ({
            ...img,
            imageUrl: (img.imageUrl || "").trim(),
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("✅ Property submitted successfully!");
      setProperty(EMPTY_PROPERTY);
      setImages([{ imageUrl: "", isPrimary: true }]);
      setSubmitted(false);
      setFieldErrors({});
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit property");
    } finally {
      setLoading(false);
    }
  };

  const pageBg = {
    background: "#f6f8fc",
    minHeight: "calc(100vh - 56px)",
  };

  const cardStyle = {
    borderRadius: 18,
    backgroundColor: "#ffffff",
  };

  return (
    <>
      {/* Validation styling */}
      <style>{`
        .form-control.is-invalid,
        .form-select.is-invalid {
          border-color: rgba(220,53,69,.55) !important;
          box-shadow: 0 0 0 0.18rem rgba(220,53,69,.08) !important;
          background-color: rgba(220,53,69,.03);
        }
        .invalid-feedback {
          display: block;
          font-size: 0.85rem;
          color: #b02a37;
        }
      `}</style>

      <section style={pageBg}>
        <div className="container py-4" style={{ maxWidth: 980 }}>
          {/* HEADER */}
          <div className="mb-4 text-center">
            <h2 className="fw-bold mb-1" style={{ letterSpacing: "-0.4px" }}>
              Add Property
            </h2>
            <p className="text-muted mb-0">
              Enter property details and submit for approval.
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={submitProperty} noValidate>
            <div className="row g-4">
              {/* PROPERTY DETAILS */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm h-100" style={cardStyle}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">Property Details</h5>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Title</label>
                      <input
                        className={`form-control ${showErr("title") ? "is-invalid" : ""}`}
                        name="title"
                        value={property.title}
                        onChange={handleChange}
                        placeholder="Property title"
                        disabled={loading}
                      />
                      {showErr("title") && <div className="invalid-feedback">{fieldErrors.title}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Property Type</label>
                      <select
                        className={`form-select ${showErr("propertyType") ? "is-invalid" : ""}`}
                        name="propertyType"
                        value={property.propertyType}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="">Select</option>
                        <option value="FLAT">Flat</option>
                        <option value="HOUSE">House</option>
                        <option value="VILLA">Villa</option>
                        <option value="PLOT">Plot</option>
                      </select>
                      {showErr("propertyType") && (
                        <div className="invalid-feedback">{fieldErrors.propertyType}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        className={`form-control ${showErr("description") ? "is-invalid" : ""}`}
                        name="description"
                        rows={4}
                        value={property.description}
                        onChange={handleChange}
                        placeholder="Property description"
                        disabled={loading}
                      />
                      {showErr("description") && (
                        <div className="invalid-feedback">{fieldErrors.description}</div>
                      )}
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Price</label>
                        <input
                          className={`form-control ${showErr("price") ? "is-invalid" : ""}`}
                          name="price"
                          value={property.price}
                          onChange={handleChange}
                          placeholder="₹ Price"
                          inputMode="numeric"
                          disabled={loading}
                        />
                        {showErr("price") && <div className="invalid-feedback">{fieldErrors.price}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Area (sq ft)</label>
                        <input
                          className={`form-control ${showErr("areaSqft") ? "is-invalid" : ""}`}
                          name="areaSqft"
                          value={property.areaSqft}
                          onChange={handleChange}
                          placeholder="Area"
                          inputMode="numeric"
                          disabled={loading}
                        />
                        {showErr("areaSqft") && (
                          <div className="invalid-feedback">{fieldErrors.areaSqft}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ADDRESS + IMAGES */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm h-100" style={cardStyle}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">Address & Images</h5>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Address Line</label>
                      <input
                        className={`form-control ${showErr("addressLine") ? "is-invalid" : ""}`}
                        name="addressLine"
                        value={property.addressLine}
                        onChange={handleChange}
                        placeholder="House no, Street, Area"
                        disabled={loading}
                      />
                      {showErr("addressLine") && (
                        <div className="invalid-feedback">{fieldErrors.addressLine}</div>
                      )}
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">City</label>
                        <input
                          className={`form-control ${showErr("city") ? "is-invalid" : ""}`}
                          name="city"
                          value={property.city}
                          onChange={handleChange}
                          disabled={loading}
                        />
                        {showErr("city") && <div className="invalid-feedback">{fieldErrors.city}</div>}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">State</label>
                        <input
                          className={`form-control ${showErr("state") ? "is-invalid" : ""}`}
                          name="state"
                          value={property.state}
                          onChange={handleChange}
                          disabled={loading}
                        />
                        {showErr("state") && <div className="invalid-feedback">{fieldErrors.state}</div>}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Pincode</label>
                        <input
                          className={`form-control ${showErr("pincode") ? "is-invalid" : ""}`}
                          name="pincode"
                          value={property.pincode}
                          onChange={handleChange}
                          inputMode="numeric"
                          disabled={loading}
                        />
                        {showErr("pincode") && (
                          <div className="invalid-feedback">{fieldErrors.pincode}</div>
                        )}
                      </div>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold mb-0">Images</h6>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={addImageField}
                        disabled={loading}
                      >
                        + Add Image
                      </button>
                    </div>

                    {showErr("images") && <div className="invalid-feedback mb-2">{fieldErrors.images}</div>}
                    {showErr("primaryImage") && (
                      <div className="invalid-feedback mb-2">{fieldErrors.primaryImage}</div>
                    )}

                    {images.map((img, index) => (
                      <div key={index} className="d-flex gap-2 mb-2 align-items-start">
                        <div className="flex-grow-1">
                          <input
                            className={`form-control ${
                              submitted && fieldErrors[`imageUrl_${index}`] ? "is-invalid" : ""
                            }`}
                            name="imageUrl"
                            placeholder="Image URL (https://...)"
                            value={img.imageUrl}
                            onChange={(e) => handleImageChange(index, e)}
                            disabled={loading}
                          />
                          {submitted && fieldErrors[`imageUrl_${index}`] && (
                            <div className="invalid-feedback">{fieldErrors[`imageUrl_${index}`]}</div>
                          )}
                        </div>

                        <div className="form-check d-flex align-items-center mt-2">
                          <input
                            type="radio"
                            className="form-check-input"
                            checked={img.isPrimary}
                            onChange={() => setPrimary(index)}
                            disabled={loading}
                          />
                          <label className="form-check-label ms-1">Primary</label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMIT */}
            <div className="d-flex justify-content-end mt-4">
              <button
                type="submit"
                className="btn btn-primary btn-lg px-5 rounded-3 shadow-sm"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Property"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
