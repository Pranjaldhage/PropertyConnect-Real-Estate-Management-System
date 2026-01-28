import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../../api/userApi";

export default function CustomerProfile() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getMyProfile();
      setForm(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateMyProfile(form);
      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-white shadow-lg rounded-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            name="email"
            disabled
            value={form.email || ""}
            className="border border-gray-200 p-3 w-full rounded-lg bg-gray-100"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-semibold mb-1">Mobile</label>
          <input
            name="mobile"
            value={form.mobile || ""}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold mb-1">City</label>
          <input
            name="city"
            value={form.city || ""}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Button */}
        <div className="md:col-span-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
