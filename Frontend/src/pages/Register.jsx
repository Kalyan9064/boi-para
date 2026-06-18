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

  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        toast.success("Location captured!");
      },
      () => {
        toast.error("Please allow location access");
      }
    );
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

    if (!location.latitude || !location.longitude) {
      toast.error("Please select your location");
      return;
    }

    try {
      setError("");
      await API.post("/api/auth/register", {
        ...form,
        location,
      });

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
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Name"
            className="auth-input"
            onChange={handleChange}
            required
          />

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            className="auth-input"
            onChange={handleChange}
            required
          />

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
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

          <button
            type="button"
            onClick={getCurrentLocation}
          >
            📍 Use Current Location
          </button>

          {location.latitude && (
            <div style={{ marginTop: "10px" }}>
              <small>✅ Location captured successfully</small>
            </div>
          )}

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