import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !name) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const token = await loginUser({ email, name });
      localStorage.setItem("token", token);

      toast.success("Login successful 🚀");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      toast.error("Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-blue-500 dark:from-gray-900 dark:to-gray-800">

      <ToastContainer position="top-right" autoClose={2000} />

      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-96">

        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Welcome Back 👋
        </h2>

        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Login to your JobTrack Pro account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full p-2 mt-1 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full p-2 mt-1 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white transition ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              "Login 🚀"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;