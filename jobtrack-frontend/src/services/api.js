import axios from "axios";

//COMMON TOKEN GETTER (IMPORTANT)
const getToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

// Axios instance configuration
const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken(); //UPDATED

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      //CLEAR BOTH
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Decode JWT token to extract user info
export const getUserFromToken = () => {
  const token = getToken(); //UPDATED
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