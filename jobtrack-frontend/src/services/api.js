import axios from "axios";
import { toast } from "react-toastify";

// 🔐 GET TOKEN
const getToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

// 🌐 BASE URL FROM ENV
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

// 🚀 AXIOS INSTANCE
const api = axios.create({
  baseURL: BASE_URL,
});

// 🔥 REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 RESPONSE INTERCEPTOR (GLOBAL ERROR HANDLER)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🚫 NETWORK ERROR
    if (!error.response) {
      toast.error("Network error 🚫");
      return Promise.reject(error);
    }

    const status = error.response.status;

    // 🔒 UNAUTHORIZED
    if (status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      toast.error("Session expired. Please login again.");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }

    // ⛔ FORBIDDEN
    else if (status === 403) {
      toast.error("Access denied ❌");
    }

    // ⚠️ SERVER ERROR
    else if (status >= 500) {
      toast.error("Server error ⚠️");
    }

    // ❗ OTHER ERRORS
    else {
      toast.error(
        error.response.data?.message || "Something went wrong"
      );
    }

    return Promise.reject(error);
  }
);

// 🔓 DECODE JWT
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return {
      email: payload.sub,
      role: payload.role || "USER",
    };
  } catch {
    return null;
  }
};

export default api;