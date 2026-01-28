import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";

import PropertyList from "../features/property/PropertyList";
import PropertyDetails from "../features/property/PropertyDetails";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";

import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";

import AdminDashboard from "../features/admin/AdminDashboard";
import CustomerProfile from "../features/customer/CustomerProfile";
import MyEnquiries from "../features/customer/MyEnquiries";
import CustomerDashboard from "../features/customer/CustomerDashboard";

import SavedProperties from "../features/customer/SavedProperties";


export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {/* =====================
            PUBLIC
        ===================== */}
        <Route path="/" element={<PropertyList />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* =====================
            LOGGED-IN USERS
        ===================== */}
        <Route
          path="/properties/:id"
          element={
            <PrivateRoute>
              <PropertyDetails />
            </PrivateRoute>
          }
        />

        {/* =====================
            CUSTOMER
        ===================== */}
        <Route
          path="/customer/profile"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["CUSTOMER"]}>
                <CustomerProfile />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/customer/enquiries"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["CUSTOMER"]}>
                <MyEnquiries />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/customer/dashboard"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["CUSTOMER"]}>
                <CustomerDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
  path="/customer/saved"
  element={
    <PrivateRoute>
      <RoleRoute allowedRoles={["CUSTOMER"]}>
        <SavedProperties />
      </RoleRoute>
    </PrivateRoute>
  }
/>


        {/* =====================
            ADMIN ONLY
        ===================== */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
