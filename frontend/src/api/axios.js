import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8086", // API Gateway
});

/* ============================
   REQUEST — attach JWT ONLY
   Gateway will decode it
============================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================
   RESPONSE — handle 401
============================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      const currentPath = window.location.pathname;

      window.location.href = `/auth/login?redirect=${encodeURIComponent(
        currentPath
      )}`;
    }

    return Promise.reject(error);
  }
);

export default api;
