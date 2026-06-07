import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import toast from "../utils/toast";
import "../styles/auth.css";

function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔴 Validation
    if (!form.name || !form.email || !form.password || !form.phone) {
      setError("All fields are required!");
      toast.error("All fields are required!");
      return;
    }

    // Email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) {
      setError("Invalid email format");
      toast.error("Invalid email format");
      return;
    }

    // Phone validation
    if (form.phone.length < 10) {
      setError("Phone must be at least 10 digits");
      toast.error("Phone must be at least 10 digits");
      return;
    }

    try {
      setError("");
      await API.post("/api/auth/register", form);

      toast.success("Registered successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      const errMsg = err.response?.data?.message || "Registration failed";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2 className="auth-title">Sign Up</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>

          <input
            name="name"
            placeholder="Name"
            className="auth-input"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="auth-input"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone (+91...)"
            className="auth-input"
            onChange={handleChange}
            required
          />

          <button className="auth-btn">Register</button>

        </form>

        <div className="auth-link">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;