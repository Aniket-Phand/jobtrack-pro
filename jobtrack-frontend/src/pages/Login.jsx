import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const token = await loginUser({ email, name });

      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login Failed ❌");
    }
  };

  return (
    <div style={containerStyle}>
      
      <div style={cardStyle}>
        <h1 className="text-red-500 text-3xl">Tailwind Working!!!</h1>
        <h2 style={{ marginBottom: "20px" }}>Welcome Back 👋</h2>
        <p style={{ marginBottom: "30px", color: "#6b7280" }}>
          Login to your JobTrack Pro account
        </p>

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          
          <div style={inputGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={inputGroup}>
            <label>Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Login 🚀
          </button>
        </form>
      </div>
    </div>
  );
}

//STYLES

const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to right, #4f46e5, #3b82f6)"
};

const cardStyle = {
  background: "white",
  padding: "40px",
  borderRadius: "12px",
  width: "350px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  textAlign: "center"
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  marginBottom: "15px",
  width: "100%"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  outline: "none"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "20px",
  background: "#4f46e5",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  transition: "0.3s"
};

export default Login;