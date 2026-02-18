import { useEffect, useState, useCallback } from "react";
import { getMyProfile, getMyAddresses, saveProfileFull } from "../../api/userApi";

const EMPTY_PROFILE = { name: "", email: "", mobile: "", gender: "" };
const EMPTY_ADDRESS = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export default function CustomerProfile() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [address, setAddress] = useState(EMPTY_ADDRESS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const pickLatestAddress = (list) => {
    if (!Array.isArray(list) || list.length === 0) return null;
    return [...list].sort((a, b) => (b.id || 0) - (a.id || 0))[0];
  };

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const profileRes = await getMyProfile();
      const p = profileRes?.data || {};

      const name = p.name ?? p.fullName ?? "";
      const email = p.email ?? p.userEmail ?? "";
      const mobile = p.mobileNumber ?? p.mobile ?? p.phone ?? "";
      const gender = p.gender ?? "";

      setProfile({ name, email, mobile, gender });

      const addrRes = await getMyAddresses();
      const list = addrRes?.data || [];
      const latest = pickLatestAddress(list);

      setAddress({
        addressLine1: latest?.addressLine1 ?? latest?.line1 ?? "",
        addressLine2: latest?.addressLine2 ?? latest?.line2 ?? "",
        city: latest?.city ?? "",
        state: latest?.state ?? "",
        postalCode: latest?.postalCode ?? latest?.pincode ?? "",
        country: latest?.country ?? "India",
      });
    } catch (err) {
      console.error("FETCH_PROFILE_ADDRESS_ERROR:", err);
      setError("Failed to load profile from database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await saveProfileFull({
        profile: {
          name: profile.name,
          gender: profile.gender,
          mobileNumber: profile.mobile,
        },
        address: {
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
      });

      setSuccess("✅ Saved successfully");
      await fetchAll();
    } catch (err) {
      console.error("SAVE_PROFILE_FULL_ERROR:", err);
      setError(err?.response?.data?.message || "Failed to save in database.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section style={{ background: "#f6f8fc", minHeight: "calc(100vh - 56px)" }}>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
          <div className="text-muted">Loading profile from database...</div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ background: "#f6f8fc", minHeight: "calc(100vh - 56px)" }}>
      <div className="container py-4" style={{ maxWidth: 980 }}>
        {/* HEADER */}
        <div className="mb-4 text-center">
          <h1 className="fw-bold mb-1" style={{ letterSpacing: "-0.4px" }}>
            My Profile
          </h1>
          <p className="text-muted mb-0">
            Update your profile and address details.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="row g-4">
          {/* PROFILE */}
          <div className="col-lg-6">
            <div
              className="card border-0 shadow-sm h-100"
              style={cardStyle}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
            >
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Profile Details</h5>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    disabled={saving}
                    className="form-control"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    disabled
                    value={profile.email}
                    className="form-control bg-light"
                    placeholder="Email"
                  />
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Mobile</label>
                    <input
                      name="mobile"
                      value={profile.mobile}
                      onChange={handleProfileChange}
                      disabled={saving}
                      className="form-control"
                      placeholder="Mobile number"
                      inputMode="numeric"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Gender</label>
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleProfileChange}
                      disabled={saving}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label fw-semibold">City</label>
                  <input
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    disabled={saving}
                    className="form-control"
                    placeholder="Your city"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="col-lg-6">
            <div
              className="card border-0 shadow-sm h-100"
              style={cardStyle}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
            >
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Address</h5>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Address Line 1</label>
                  <input
                    name="addressLine1"
                    value={address.addressLine1}
                    onChange={handleAddressChange}
                    disabled={saving}
                    className="form-control"
                    placeholder="House no, Street, Area"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Address Line 2</label>
                  <input
                    name="addressLine2"
                    value={address.addressLine2}
                    onChange={handleAddressChange}
                    disabled={saving}
                    className="form-control"
                    placeholder="Landmark (optional)"
                  />
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">State</label>
                    <input
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      disabled={saving}
                      className="form-control"
                      placeholder="State"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Pincode</label>
                    <input
                      name="postalCode"
                      value={address.postalCode}
                      onChange={handleAddressChange}
                      disabled={saving}
                      className="form-control"
                      placeholder="Pincode"
                      inputMode="numeric"
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Country</label>
                    <input
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      disabled={saving}
                      className="form-control"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SAVE */}
        <div className="d-flex justify-content-end mt-4">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="btn btn-primary btn-lg px-5 rounded-3 shadow-sm"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </section>
  );
}
