import React, { useState } from "react";
import "../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "../utils/toast";

function Navbar() {
  const token = localStorage.getItem("token");
  const [search, setSearch] = useState("");
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
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">

        {/* LEFT */}
        <div className="logo">
          <a href="/"> Boi-Para
            <img
              src="/boipara-logo.png"
              alt="Boi Para"
              style={{ height: "50px" }}
            />
          </a>
        </div>

        {/* <Link to="/#hero">📚 Boi-Para</Link> */}
        {/* RIGHT */}
        <div className="nav-links">

          {/* 🔍 SEARCH (LEFT OF BROWSE) */}
          <form onSubmit={handleSearch} className="search-box small-search">
            <span className="search-icon">🔍</span>

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* BROWSE */}
          <Link to="/browse">Browse Books</Link>

          {token && (
            <span
              className="sell-link"
              onClick={() => {
                if (token) {
                  window.location.href = "/sell-book";
                } else {
                  toast.warning("Please login first");
                  setTimeout(() => {
                    window.location.href = "/login";
                  }, 1000);
                }
              }}
            >
              Sell
            </span>
          )}

          <Link to="/wishlist">Wishlist ❤️</Link>

          {token ? (
            <>
              <Link to="/account">My Account</Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;