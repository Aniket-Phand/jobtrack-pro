import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate(); // ✅ added

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const token = await loginUser({ email, name });

      console.log("JWT TOKEN:", token);

      localStorage.setItem("token", token);

      alert("Login Successful ✅");

      navigate("/dashboard"); // ✅ redirect

    } catch (error) {
      console.error(error);
      alert("Login Failed ❌");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;