import { Link } from "react-router-dom";
import API from "../api/api";
import toast from "../utils/toast";
import "../styles/bookcard.css";
import { useState, useEffect } from "react";
import getTimeAgo from "../utils/getTimeAgo";

function BookCard({ book }) {

  // ==============================
  // ❤️ STATE
  // ==============================
  const [isSaved, setIsSaved] = useState(false);

  // ==============================
  // 🔍 CHECK IF SAVED
  // ==============================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    API.get("/api/auth/wishlist", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        const exists = res.data.some(
          item => item._id === book._id
        );
        setIsSaved(exists);
      })
      .catch(() => { });
  }, [book._id]);

  // ==============================
  // ❤️ TOGGLE WISHLIST
  // ==============================
  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.warning("Please login first");
        return;
      }

      if (isSaved) {
        // REMOVE
        await API.delete(`/api/auth/wishlist/${book._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setIsSaved(false);
        toast.info("Removed from Wishlist");

      } else {
        // ADD
        await API.post(
          `/api/auth/wishlist/${book._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setIsSaved(true);
        toast.success("Added to Wishlist! ❤️");
      }

    } catch (err) {
      toast.error("Error updating wishlist");
    }
  };

  const locationArea =
    book.seller?.location?.area ||
    book.location?.area ||
    "";

  const locationCity =
    book.seller?.location?.city ||
    book.location?.city ||
    "";

  const readableLocation = [
    locationArea,
    locationCity,
  ]
    .filter(Boolean)
    .join(", ");

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
              {isSaved ? "❤️" : "🤍"}
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
            {/* ================= LOCATION ================= */}

            <div className="book-location-row">
              <span className="book-location-icon">
                📍
              </span>

              <span className="book-location-text">
                {readableLocation || "Location Available"}
              </span>
            </div>


            {/* ================= DISTANCE + TIME ================= */}

            <div className="bottom-row">

              {typeof book.distance === "number" && (

                <span className="distance-badge">

                  {book.distance < 1
                    ? `${Math.round(book.distance * 1000)} m away`
                    : `${book.distance.toFixed(1)} km away`}

                </span>

              )}


              <span className="book-time">

                ⏱ {getTimeAgo(book.createdAt)}

              </span>

            </div>

          </div>

        </div>

      </Link>

    </div>
  );
}

export default BookCard;