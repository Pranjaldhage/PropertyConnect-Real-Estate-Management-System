import { useEffect, useState } from "react";
import { getMyEnquiries } from "../../api/enquiryApi";
import { getMyProfile } from "../../api/userApi";
import { Link } from "react-router-dom";

export default function MyEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const profileRes = await getMyProfile();
      const customerId = profileRes.data.id;

      const enquiryRes = await getMyEnquiries(customerId);
      setEnquiries(enquiryRes.data);
    } catch (err) {
      console.error("Failed to fetch enquiries", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading enquiries...</p>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Enquiries</h1>

      {enquiries.length === 0 ? (
        <p>No enquiries yet.</p>
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <div
              key={e.id}
              className="bg-white shadow rounded-lg p-6 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">
                  Property #{e.propertyId}
                </h2>

                <p className="text-gray-600">
                  Status:{" "}
                  <span className="font-semibold">{e.status}</span>
                </p>

                <p className="text-sm text-gray-500">
                  Date: {new Date(e.createdAt).toLocaleDateString()}
                </p>
              </div>

              <Link
                to={`/properties/${e.propertyId}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Property
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
