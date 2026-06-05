import React, { useState, useEffect } from "react";
import "../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Navbar() {
  const token = localStorage.getItem("token");
  const [search, setSearch] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // JWT Decoder Helper
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchUnreadCount = () => {
      API.get("/api/conversations")
        .then((res) => {
          const decoded = parseJwt(token);
          const userId = decoded?.id;
          if (userId) {
            const count = res.data.reduce((sum, conv) => {
              return sum + (conv.unreadCounts?.[userId] || 0);
            }, 0);
            setUnreadCount(count);
          }
        })
        .catch((err) => {
          console.error("Error fetching unread count:", err);
        });
    };

    fetchUnreadCount();
    // Poll every 15 seconds to keep the unread count updated in the navbar
    const interval = setInterval(fetchUnreadCount, 15000);

    return () => clearInterval(interval);
  }, [token]);

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
                  alert("Please login first");
                  window.location.href = "/login";
                }
              }}
            >
              Sell
            </span>
          )}

          <Link to="/wishlist">Wishlist ❤️</Link>

          {token ? (
            <>
              <Link to="/chat" style={{ position: "relative" }}>
                Messages
                {unreadCount > 0 && <span className="nav-unread-badge">{unreadCount}</span>}
              </Link>
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