import { useNavigate, useLocation } from "react-router-dom";
import { getUserFromToken } from "../services/api";
import { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
import { ConfirmContext } from "../context/ConfirmContext";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserFromToken();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const openConfirm = (title, message, onConfirm) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const closeConfirm = () => {
    setConfirmState({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <ConfirmContext.Provider value={{ openConfirm }}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">

        {/* SIDEBAR */}
        <div className="w-60 bg-gray-900 text-white flex flex-col p-4">
          <h2 className="text-xl font-bold mb-6">JobTrack</h2>

          <button
            onClick={() => navigate("/dashboard")}
            className={`p-2 mb-2 rounded ${
              isActive("/dashboard") ? "bg-indigo-600" : "hover:bg-gray-700"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 mb-2 rounded hover:bg-gray-700"
          >
            Jobs
          </button>

          {user?.role === "ADMIN" && (
            <>
              <button
                onClick={() => navigate("/admin")}
                className={`p-2 mb-2 rounded ${
                  isActive("/admin") ? "bg-indigo-600" : "hover:bg-gray-700"
                }`}
              >
                Admin Panel
              </button>

              <button
                onClick={() => navigate("/admin/dashboard")}
                className={`p-2 rounded ${
                  isActive("/admin/dashboard")
                    ? "bg-indigo-600"
                    : "hover:bg-gray-700"
                }`}
              >
                Admin Dashboard
              </button>
            </>
          )}
        </div>

        {/* MAIN */}
        <div className="flex-1 flex flex-col">

          <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 shadow">
            <h1 className="font-semibold text-gray-800 dark:text-white">
              JobTrack Pro
            </h1>

            <div className="flex items-center gap-4">

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-3 py-1 border rounded dark:text-white"
              >
                {darkMode ? "Light" : "Dark"}
              </button>

              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user?.email} ({user?.role})
              </span>

              <button
                onClick={() =>
                  openConfirm(
                    "Logout",
                    "Are you sure you want to logout?",
                    handleLogout
                  )
                }
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            {children}
          </div>
        </div>

        {/* MODAL */}
        <ConfirmModal
          isOpen={confirmState.isOpen}
          title={confirmState.title}
          message={confirmState.message}
          onCancel={closeConfirm}
          onConfirm={() => {
            confirmState.onConfirm?.();
            closeConfirm();
          }}
        />

      </div>
    </ConfirmContext.Provider>
  );
}

export default Layout;