import React, { useState, useRef, useEffect } from "react";
import "../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "../utils/toast";
import API from "../api/api";

function parseToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function Navbar() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user info from backend
  useEffect(() => {
    if (!token) return;
    const payload = parseToken(token);
    if (!payload) return;

    API.get("/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [token]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // SEARCH
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${search}`);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">

        {/* LEFT — Logo */}
        <div className="logo">
          <a href="/">
            Boi-Para
            <img src="/boipara-logo.png" alt="Boi Para" style={{ height: "50px" }} />
          </a>
        </div>

        {/* RIGHT — Nav Links */}
        <div className="nav-links">

          {/* Search */}
          <form onSubmit={handleSearch} className="search-box small-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* Browse */}
          <Link to="/browse">Browse Books</Link>

          {/* Sell — only when logged in */}
          {token && (
            <span
              className="sell-link"
              onClick={() => (window.location.href = "/sell-book")}
            >
              Sell
            </span>
          )}

          {/* Wishlist */}
          <Link to="/wishlist">Wishlist ❤️</Link>

          {/* Account / Login */}
          {token && user ? (
            <div className="account-dropdown-wrapper" ref={dropdownRef}>
              <button
                className="account-btn"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                My Account
              </button>

              {dropdownOpen && (
                <div className="account-dropdown">
                  {/* Header */}
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.name || "User"}</p>
                    <p className="dropdown-email">{user.email}</p>
                    {/* <span className="dropdown-role">User</span> */}
                  </div>

                  <hr className="dropdown-divider" />

                  <Link
                    to="/account"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Profile
                  </Link>

                  <button className="dropdown-item signout-btn" onClick={handleLogout}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : token ? (
            // token exists but user not loaded yet — show placeholder
            <div className="account-dropdown-wrapper" ref={dropdownRef}>
              <button className="account-btn" disabled>
                My Account ▾
              </button>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;