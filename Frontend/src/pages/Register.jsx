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
    phone: "",
  });

  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
  });

  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationLoading(false);
        toast.success("Location captured successfully!");
      },

      () => {
        setLocationLoading(false);
        toast.error("Please allow location access");
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.phone) {
      setError("All fields are required!");
      toast.error("All fields are required!");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(form.email)) {
      setError("Invalid email format");
      toast.error("Invalid email format");
      return;
    }

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
      const errMsg =
        err.response?.data?.message || "Registration failed";

      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const locationCaptured =
    location.latitude !== "" && location.longitude !== "";

  return (
    <div className="auth-container">

      <div className="auth-card">

        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>

          <p className="auth-subtitle">
            Join Boi Para and discover books near you
          </p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="auth-field">
            <label htmlFor="name">Full Name</label>

            <input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Enter your full name"
              className="auth-input"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>


          <div className="auth-field">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
              className="auth-input"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>


          <div className="auth-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              className="auth-input"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>


          <div className="auth-field">
            <label htmlFor="phone">Phone Number</label>

            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              className="auth-input"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>


          <div className="location-section">

            <div className="location-section-header">

              <div>
                <h3>Your Location</h3>

                <p>
                  Used to show books available near you
                </p>
              </div>

            </div>


            <button
              type="button"
              className={`location-btn ${
                locationCaptured ? "location-captured" : ""
              }`}
              onClick={getCurrentLocation}
              disabled={locationLoading}
            >

              <span className="location-icon">
                {locationLoading
                  ? "⌛"
                  : locationCaptured
                  ? "✓"
                  : "⌖"}
              </span>


              <span className="location-btn-content">

                <span className="location-btn-title">

                  {locationLoading
                    ? "Detecting location..."
                    : locationCaptured
                    ? "Location Captured"
                    : "Use Current Location"}

                </span>


                <span className="location-btn-description">

                  {locationCaptured
                    ? "Your location is ready to use"
                    : "Allow location access to find nearby books"}

                </span>

              </span>


              {!locationLoading && !locationCaptured && (
                <span className="location-arrow">
                  →
                </span>
              )}

            </button>


            {locationCaptured && (

              <div className="location-success">

                <span className="success-icon">✓</span>

                <span>
                  Location captured successfully
                </span>

              </div>

            )}

          </div>


          <button
            type="submit"
            className="auth-btn"
          >
            Create Account
          </button>

        </form>


        <div className="auth-link">

          <p>
            Already have an account?{" "}

            <Link to="/login">
              Sign in
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;