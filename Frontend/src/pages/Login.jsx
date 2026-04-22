import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import "../styles/auth.css";

function Login() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/auth/login", form);

      localStorage.setItem("token", res.data.token);

      alert("Login successful");
      window.location.href = "/";

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2 className="auth-title">Login</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="auth-input"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            onChange={handleChange}
          />

          <button className="auth-btn">Login</button>

        </form>

        <div className="auth-link">
          <p>
            Don’t have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>

      </div>

    </div>
  );
}

export default Login;