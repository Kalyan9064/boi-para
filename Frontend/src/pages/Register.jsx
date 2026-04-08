import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import "../styles/auth.css";

function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
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
      await API.post("/api/auth/register", form);

      alert("Registered successfully");
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2 className="auth-title">Sign Up</h2>

        <form onSubmit={handleSubmit}>

          <input name="name" placeholder="Name" className="auth-input" onChange={handleChange} />

          <input name="email" placeholder="Email" className="auth-input" onChange={handleChange} />

          <input type="password" name="password" placeholder="Password" className="auth-input" onChange={handleChange} />

          <input name="phone" placeholder="Phone (+91...)" className="auth-input" onChange={handleChange} />

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