import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";
import "../styles/wishlist.css";   // ✅ CSS import

function Wishlist() {
  const [books, setBooks] = useState([]);

  // ==============================
  // 📦 FETCH WISHLIST
  // ==============================
  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get("/api/auth/wishlist", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setBooks(res.data))
      .catch(err => console.log(err));
  }, []);

  // ==============================
  // ❌ REMOVE FROM WISHLIST
  // ==============================
  const handleRemove = async (bookId) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/api/auth/wishlist/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // update UI instantly
      setBooks(prev =>
        prev.filter(book => book._id !== bookId)
      );

    } catch (err) {
      alert("Error removing book");
    }
  };

  return (
    <div className="wishlist-container">

      <h2 className="wishlist-title">My Wishlist ❤️</h2>

      {/* EMPTY STATE */}
      {books.length === 0 && (
        <div className="empty">
          <h4>No wishlist yet 😢</h4>
        </div>
      )}

      <div className="wishlist-grid">
        {books.map(book => (
          <div className="wishlist-card" key={book._id}>

            {/* ❌ REMOVE BUTTON */}
           <button
  className="remove-btn"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    handleRemove(book._id);
  }}
>
  🗑️
</button>

            {/* LINK */}
            <Link to={`/book/${book._id}`} className="book-link">

              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/${book.image}`}
                alt="book"
                className="wishlist-img"
              />

              <h6>{book.title}</h6>
              <p>₹{book.price}</p>

            </Link>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Wishlist;