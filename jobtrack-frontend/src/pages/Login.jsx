import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    let err = {};
    if (!email) err.email = "Email is required";
    if (!name) err.name = "Name is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const token = await loginUser({ email, name });

      if (remember) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

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
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600">

      <ToastContainer position="top-right" autoClose={2000} />

      {/* Card */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-8 w-96 text-white">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-sm text-gray-200 mb-6">
          Login to your JobTrack Pro account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 p-2 rounded-lg bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-300 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-sm">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full mt-1 p-2 rounded-lg bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-red-300 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Remember me
            </label>

            <span className="cursor-pointer hover:underline text-gray-200">
              Forgot?
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-white text-indigo-600 hover:bg-gray-200"
            }`}
          >
            {loading ? (
              <div className="flex justify-center">
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              "Login 🚀"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <hr className="flex-grow border-white/30" />
          <span className="mx-2 text-sm">OR</span>
          <hr className="flex-grow border-white/30" />
        </div>

        {/* Google Button */}
        <button
          onClick={() => toast.info("Google login coming soon 🚧")}
          className="w-full py-2 rounded-lg bg-white text-black hover:bg-gray-200 transition"
        >
          Continue with Google
        </button>

      </div>
    </div>
  );
}

export default Login;