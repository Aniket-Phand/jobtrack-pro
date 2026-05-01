import axios from "axios";
import { toast } from "react-toastify";

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// REQUEST
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔥 RESPONSE (GLOBAL HANDLER)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("Network error 🚫");
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    } else if (status === 403) {
      toast.error("Access denied ❌");
    } else if (status >= 500) {
      toast.error("Server error ⚠️");
    } else {
      toast.error(error.response.data?.message || "Something went wrong");
    }

    return Promise.reject(error);
  }
);

// JWT decode
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