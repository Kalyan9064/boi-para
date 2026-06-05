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


  if (localStorage.getItem("token")) {
    window.location.href = "/";
    return null;
  }

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

        <div style={{ marginTop: "15px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "15px 0",
            color: "#aaa",
            fontSize: "13px"
          }}>
            <div style={{ flex: 1, height: "1px", background: "#ddd" }}></div>
            <span>or</span>
            <div style={{ flex: 1, height: "1px", background: "#ddd" }}></div>
          </div>
          <button
            type="button"
            className="google-btn"
            onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              width="18"
              height="18"
            />
            Continue with Google
          </button>
        </div>

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