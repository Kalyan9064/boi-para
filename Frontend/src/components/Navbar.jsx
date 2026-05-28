import React, { useState } from "react";
import "../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

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
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">

        {/* LOGO */}
        <div className="logo">
          <a href="/">
            Boi-Para
            <img
              src="/boipara-logo.png"
              alt="Boi Para"
              style={{ height: "50px" }}
            />
          </a>
        </div>

        {/* HAMBURGER ICON */}
<div
  className="hamburger"
  onClick={() => setMenuOpen(!menuOpen)}
>
  {menuOpen ? "✕" : "☰"}
</div>

        {/* NAV LINKS */}
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>

          {/* SEARCH */}
          <form
            onSubmit={handleSearch}
            className="search-box small-search"
          >
            <span className="search-icon">🔍</span>

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <Link to="/browse" onClick={() => setMenuOpen(false)}>
            Browse Books
          </Link>

          {token && (
            <span
              className="sell-link"
              onClick={() => {
                if (token) {
                  window.location.href = "/sell-book";
                } else {
                  alert("Please login first");
                  window.location.href = "/login";
                }
                setMenuOpen(false);
              }}
            >
              Sell
            </span>
          )}

          <Link
            to="/wishlist"
            onClick={() => setMenuOpen(false)}
          >
            Wishlist ❤️
          </Link>

          {token ? (
            <>
              <Link
                to="/account"
                onClick={() => setMenuOpen(false)}
              >
                My Account
              </Link>

              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;