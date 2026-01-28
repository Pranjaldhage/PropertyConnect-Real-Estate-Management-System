import api from "./axios";

/* ======================
   CUSTOMER / PUBLIC
====================== */

export const getAllProperties = () => {
  return api.get("/properties");
};

export const getPropertyById = (id) => {
  return api.get(`/properties/${id}`);
};

export const getPropertyImages = (id) => {
  return api.get(`/properties/${id}/images`);
};

export const searchProperties = (params) => {
  return api.get("/properties/search", {
    params,
  });
};

/* ======================
   ADMIN
====================== */

// 🔥 MASTER LIST — any status + pagination
export const getAdminProperties = ({
  status,
  page = 0,
  size = 9,
}) => {
  return api.get("/properties/admin/list", {
    params: {
      status,
      page,
      size,
    },
  });
};

// approve
export const approveProperty = (id) => {
  return api.put(`/properties/${id}/approve`);
};

// reject
export const rejectProperty = (id) => {
  return api.put(`/properties/${id}/reject`);
};
