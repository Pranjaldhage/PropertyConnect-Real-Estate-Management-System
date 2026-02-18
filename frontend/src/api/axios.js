import axios from "axios";

/**
 * Axios instance for API Gateway calls.
 * Only JWT is attached here — Gateway handles identity propagation.
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8086",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================
   REQUEST INTERCEPTOR
============================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Trace header for debugging across microservices
    config.headers["X-REQUEST-ID"] =
      crypto.randomUUID?.() ||
      Math.random().toString(36).substring(2);

    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================
   RESPONSE INTERCEPTOR
============================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Network / gateway down
    if (!error.response) {
      console.error("NETWORK_ERROR:", error);
      alert("Server unreachable. Please try again.");
      return Promise.reject(error);
    }

    // Unauthorized → force login (unless already there)
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");

      const path = window.location.pathname;

      if (!path.startsWith("/auth/login")) {
        window.location.href = `/auth/login?redirect=${encodeURIComponent(
          path
        )}`;
      }

      return Promise.reject(error);
    }

    // Forbidden → logged in but not allowed
    if (status === 403) {
      alert("You are not authorized to access this resource.");
    }

    return Promise.reject(error);
  }
);

export default api;
