import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import vehicleDoc from "../assets/vehicle-doc.svg";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
  const res = await axios.post("http://localhost:5174/api/login", { email, password });
      // save user info and token in localStorage
      localStorage.setItem("token", res.data.token);
  localStorage.setItem("ownerId", res.data.user._id || res.data.user.id); // important for UploadDocs
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <form onSubmit={handleLogin}>
        <fieldset>
          <legend>Login Here</legend>
          <div>
            <img src={vehicleDoc} alt="logo" style={{ width: "50px", borderRadius: "50%" }} />
          </div>
          <h3>Welcome Back 👏</h3>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br /><br />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br /><br />
          <button type="submit">Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <br />
          <span>
            <Link to="/signup">Signup Here</Link> | <Link to="/forgot-password">Forgot Password</Link>
          </span>
        </fieldset>
      </form>
    </div>
  );
}
