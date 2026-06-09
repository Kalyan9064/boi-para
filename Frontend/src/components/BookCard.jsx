import { Link } from "react-router-dom";
import "../styles/bookcard.css";
import { useWishlist } from "../context/WishlistContext";

function BookCard({ book }) {

  const { isSaved, toggleWishlist } = useWishlist();

  // ==============================
  // 🕒 TIME FUNCTION
  // ==============================
  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);

    const diffInSeconds = Math.floor((now - past) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);

    if (days > 0) return `${days} day(s) ago`;
    if (hours > 0) return `${hours} hour(s) ago`;
    if (minutes > 0) return `${minutes} minute(s) ago`;

    return "Just now";
  };

  // ==============================
  // ❤️ TOGGLE WISHLIST
  // ==============================
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(book._id);
  };

  return (
    <div className="col-md-3 mb-4">

      <Link to={`/book/${book._id}`} className="book-link">

        <div className="book-card">

          {/* ================= IMAGE ================= */}
          <div className="image-wrapper">

            <img
              src={book.images && book.images[0] ? book.images[0] : "/placeholder-book.jpg"}
              onError={(e) => { e.target.src = "/placeholder-book.jpg"; }}
              alt="book"
              className="book-image"
            />

            {/* 💰 PRICE */}
            <div className="price-badge">
              ₹{book.price}
            </div>

            {/* ❤️ TOGGLE BUTTON */}
            <button
              onClick={handleWishlist}
              className="wishlist-btn"
            >
              {isSaved(book._id) ? "❤️" : "🤍"}
            </button>

          </div>

          {/* ================= BODY ================= */}
          <div className="book-body">

            <h6 className="title">
              {book.title}
            </h6>

            <p className="author">{book.author}</p>

            {/* TAGS */}
            <div className="tags">
              <span className="tag">{book.condition}</span>
              <span className="tag">{book.category}</span>
            </div>

            {/* LOCATION + TIME */}
            <div className="bottom-row">
              <span>📍 {book.location}</span>
              <span>⏱ {getTimeAgo(book.createdAt)}</span>
            </div>

          </div>

        </div>

      </Link>

    </div>
  );
}

export default BookCard;