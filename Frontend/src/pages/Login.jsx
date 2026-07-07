import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import toast from "../utils/toast";
import "../styles/auth.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/api/auth/login", form);

      localStorage.setItem("token", res.data.token);

      toast.success("Login successful");

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card login-card">

        {/* HEADER */}

        <div className="auth-header">

          <h2 className="auth-title">
            Welcome Back
          </h2>

          <p className="auth-subtitle">
            Sign in to continue exploring books on Boi Para
          </p>

        </div>


        {/* LOGIN FORM */}

        <form onSubmit={handleSubmit}>

          <div className="auth-field">

            <label htmlFor="email">
              Email Address
            </label>

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

            <div className="password-label-row">

              <label htmlFor="password">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="forgot-password"
              >
                Forgot password?
              </Link>

            </div>

            <div className="auth-password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="auth-input"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="auth-password-toggle"
              >
                {showPassword ? <FaRegEyeSlash aria-hidden="true" size={18} /> : <FaRegEye aria-hidden="true" size={18} />}
              </button>
            </div>

          </div>


          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >

            {loading ? "Signing in..." : "Sign In"}

          </button>

        </form>


        {/* REGISTER LINK */}

        <div className="auth-link">

          <p>
            Don&apos;t have an account?{" "}

            <Link to="/register">
              Create account
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;