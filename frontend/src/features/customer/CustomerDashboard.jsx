import { Link } from "react-router-dom";

export default function CustomerDashboard() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Customer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <DashboardCard
          title="My Profile"
          description="View and update your profile"
          link="/customer/profile"
        />

        <DashboardCard
          title="My Enquiries"
          description="Track your property enquiries"
          link="/customer/enquiries"
        />

        <DashboardCard
          title="Saved Properties"
          description="Your shortlisted homes"
          link="/customer/saved"
        />

        <DashboardCard
          title="Browse Properties"
          description="Find your next home"
          link="/"
        />

      </div>
    </div>
  );
}

function DashboardCard({ title, description, link }) {
  return (
    <Link
      to={link}
      className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 block"
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}
