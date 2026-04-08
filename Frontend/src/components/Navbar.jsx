import React from "react";
import "../styles/navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* LEFT */}
        <div className="logo">
          {/* 📚 Boi-Para */}
          <Link to="/">📚 Boi-Para</Link>
        </div>

        {/* RIGHT */}
        <div className="nav-links">
          <Link to="/browse">Browse Books</Link>

          {token && (
            <span
              style={{ cursor: "pointer", margin: "0 10px" }}
              onClick={() => {
                const token = localStorage.getItem("token");

                if (token) {
                  window.location.href = "/sell-book";
                } else {
                  alert("Please login first");
                  window.location.href = "/login";
                }
              }}
            >
              Sell
            </span>
          )}

          <Link>Messages</Link>

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
