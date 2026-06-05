import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/bookdetail.css";
import "../styles/reviews.css";

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [sellerBooks, setSellerBooks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);

  // Reviews and Reputation State
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [myReview, setMyReview] = useState({ rating: 5, review: "" });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingForm, setEditingForm] = useState({ rating: 5, review: "" });
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(null);

  // ==============================
  // 👤 FETCH CURRENT USER
  // ==============================
  useEffect(() => {
    if (token) {
      API.get("/api/auth/profile")
        .then(res => setCurrentUser(res.data))
        .catch(err => console.log(err));
    }
  }, [token]);

  // ==============================
  // 📦 FETCH MAIN BOOK
  // ==============================
  useEffect(() => {
    API.get(`/api/books/${id}`)
      .then(res => setBook(res.data))
      .catch(err => console.log(err));
  }, [id]);

  // ==============================
  // 📚 FETCH SELLER BOOKS & REVIEWS
  // ==============================
  useEffect(() => {
    if (book?.seller?._id) {
      // 1. Fetch other books from seller
      API.get(`/api/books/seller/${book.seller._id}`)
        .then(res => {
          const filtered = res.data.filter(
            b => b._id !== book._id
          );
          setSellerBooks(filtered);
        })
        .catch(err => console.log(err));

      // 2. Fetch seller reviews
      fetchReviews();
    }
  }, [book]);

  const fetchReviews = () => {
    if (book?.seller?._id) {
      setReviewsLoading(true);
      API.get(`/api/reviews/seller/${book.seller._id}`)
        .then(res => {
          setReviews(res.data);
          setReviewsLoading(false);
        })
        .catch(err => {
          console.log(err);
          setReviewsLoading(false);
        });
    }
  };

  // ==============================
  // ➕ REVIEW CRUD HANDLERS
  // ==============================
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!myReview.review.trim()) {
      alert("Please write a review");
      return;
    }
    API.post("/api/reviews", {
      seller: book.seller._id,
      rating: myReview.rating,
      review: myReview.review
    })
      .then(() => {
        alert("Review submitted successfully");
        setMyReview({ rating: 5, review: "" });
        fetchReviews();
        // Refresh book data to load updated rating stats
        API.get(`/api/books/${id}`)
          .then(res => setBook(res.data))
          .catch(err => console.log(err));
      })
      .catch(err => {
        alert(err.response?.data?.message || "Failed to submit review");
      });
  };

  const handleUpdateReview = (e) => {
    e.preventDefault();
    if (!editingForm.review.trim()) {
      alert("Please write a review");
      return;
    }
    API.put(`/api/reviews/${editingReviewId}`, {
      rating: editingForm.rating,
      review: editingForm.review
    })
      .then(() => {
        alert("Review updated successfully");
        setEditingReviewId(null);
        fetchReviews();
        // Refresh book data
        API.get(`/api/books/${id}`)
          .then(res => setBook(res.data))
          .catch(err => console.log(err));
      })
      .catch(err => {
        alert(err.response?.data?.message || "Failed to update review");
      });
  };

  const handleDeleteReview = (reviewId) => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    API.delete(`/api/reviews/${reviewId}`)
      .then(() => {
        alert("Review deleted successfully");
        fetchReviews();
        // Refresh book data
        API.get(`/api/books/${id}`)
          .then(res => setBook(res.data))
          .catch(err => console.log(err));
      })
      .catch(err => {
        alert(err.response?.data?.message || "Failed to delete review");
      });
  };

  // ==============================
  // ⭐ RENDER HELPERS
  // ==============================
  const StarDisplay = ({ rating }) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<span key={i}>★</span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} style={{ opacity: 0.5 }}>★</span>);
      } else {
        stars.push(<span key={i} style={{ color: "#cbd5e0" }}>★</span>);
      }
    }
    return <div className="stars-display">{stars}</div>;
  };

  const StarRatingSelector = ({ value, onChange }) => {
    return (
      <div className="star-rating-selector">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`selector-star ${star <= value ? "active" : ""}`}
            onClick={() => onChange(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getReputationBadge = (avg, qty) => {
    if (qty === 0) return <span className="seller-reputation-badge badge-new">🆕 New Seller</span>;
    if (avg >= 4.5 && qty >= 3) return <span className="seller-reputation-badge badge-trusted">⭐ Trusted Seller</span>;
    return <span className="seller-reputation-badge badge-regular">👍 Active Seller</span>;
  };

  if (!book) return <h3>Loading...</h3>;

  return (
    <div className="container mt-4">
      <div className="row">
        {/* ================= LEFT IMAGE ================= */}
        <div className="col-md-6">
          <div className="image-box">
            {/* MAIN IMAGE */}
            <img
              src={book.images?.[selectedImage] || "/placeholder-book.jpg"}
              alt="book"
              className="main-image"
              onError={(e) => {
                e.target.src = "/placeholder-book.jpg";
              }}
            />

            {/* THUMBNAILS */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
              {book.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="thumb"
                  onClick={() => setSelectedImage(index)}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    cursor: "pointer",
                    border: selectedImage === index ? "2px solid blue" : "1px solid #ccc"
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT DETAILS ================= */}
        <div className="col-md-6">
          <div className="badge-box">
            <span className="badge category">{book.category}</span>
            <span className="badge condition">{book.condition}</span>
          </div>

          <h1 className="book-title">{book.title}</h1>

          {book.isSold && (
            <h4 style={{ color: "red" }}>This book is SOLD</h4>
          )}

          <h5 className="author">By {book.author}</h5>

          <h2 className="price">₹{book.price}</h2>

          <hr />

          <p>📍 {book.location}</p>

          <hr />

          <h5>Description</h5>
          <p>{book.description}</p>

          {/* ================= SELLER ================= */}
          <div className="seller-box">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <h6>Seller Information</h6>
              {book.seller && getReputationBadge(book.seller.ratingsAverage, book.seller.ratingsQuantity)}
            </div>

            <p className="mt-2"><strong>{book.seller?.name}</strong></p>
            {book.seller && book.seller.ratingsQuantity > 0 && (
              <div className="mb-2">
                <StarDisplay rating={book.seller.ratingsAverage} />
                <span className="text-muted small ml-1">
                  {book.seller.ratingsAverage} ({book.seller.ratingsQuantity} reviews)
                </span>
              </div>
            )}
            <p>{book.seller?.email}</p>

            <button
              onClick={() => {
                if (!token) {
                  alert("Please login first to chat with the seller.");
                  navigate("/login");
                  return;
                }

                if (currentUser && currentUser._id === book.seller?._id) {
                  alert("You cannot start a conversation with yourself (this is your book listing).");
                  return;
                }

                API.post("/api/conversations", { sellerId: book.seller._id })
                  .then((res) => {
                    navigate("/chat", { state: { selectConversation: res.data } });
                  })
                  .catch((err) => {
                    console.error("Error initiating conversation:", err);
                    alert(err.response?.data?.message || "Failed to start conversation.");
                  });
              }}
              style={{
                background: "#6366f1",
                color: "#fff",
                border: "none",
                padding: "10px 15px",
                marginTop: "10px",
                cursor: "pointer",
                borderRadius: "5px",
                fontWeight: "600"
              }}
            >
              Chat with Seller
            </button>

            <div className="warning">
              For your safety, meet in a public place.
            </div>
          </div>
        </div>
      </div>

      {/* ================= RATINGS & REVIEWS SECTION ================= */}
      <div className="reviews-section">
        <div className="reviews-header">
          <div>
            <h4 style={{ fontWeight: 700, margin: 0 }}>Seller Reviews</h4>
            {book.seller && (
              <div className="d-flex align-items-center gap-2 mt-1">
                {book.seller.ratingsQuantity > 0 && (
                  <StarDisplay rating={book.seller.ratingsAverage} />
                )}
              </div>
            )}
          </div>
          {book.seller && book.seller.ratingsQuantity > 0 && (
            <div className="stars-display" style={{ fontSize: "1.4rem" }}>
              <span className="rating-number">{book.seller.ratingsAverage}</span>
              <span className="rating-count">/5 ({book.seller.ratingsQuantity} reviews)</span>
            </div>
          )}
        </div>

        {/* Submit Review Form */}
        {token && currentUser && book.seller && currentUser._id !== book.seller._id && !reviews.some(r => r.reviewer?._id === currentUser._id) && !editingReviewId && (
          <div className="review-form-container">
            <h6 style={{ fontWeight: 600 }}>Rate your experience with {book.seller.name}</h6>
            <form onSubmit={handleSubmitReview}>
              <StarRatingSelector
                value={myReview.rating}
                onChange={(val) => setMyReview({ ...myReview, rating: val })}
              />
              <textarea
                className="review-textarea"
                placeholder="Share your experience dealing with this seller (response time, book condition, transaction smoothness...)"
                value={myReview.review}
                onChange={(e) => setMyReview({ ...myReview, review: e.target.value })}
                required
              />
              <button type="submit" className="submit-review-btn mt-2">Submit Feedback</button>
            </form>
          </div>
        )}

        {/* Edit Review Form */}
        {editingReviewId && (
          <div className="review-form-container">
            <h6 style={{ fontWeight: 600 }}>Edit your feedback</h6>
            <form onSubmit={handleUpdateReview}>
              <StarRatingSelector
                value={editingForm.rating}
                onChange={(val) => setEditingForm({ ...editingForm, rating: val })}
              />
              <textarea
                className="review-textarea"
                value={editingForm.review}
                onChange={(e) => setEditingForm({ ...editingForm, review: e.target.value })}
                required
              />
              <div className="d-flex gap-2 mt-2">
                <button type="submit" className="submit-review-btn">Save Changes</button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setEditingReviewId(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {reviewsLoading ? (
          <p className="text-muted">Loading reviews...</p>
        ) : reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map((rev) => (
              <div key={rev._id} className="review-item">
                <div className="review-meta">
                  <div className="reviewer-info">
                    <img
                      src={rev.reviewer?.profileImage ? `/uploads/${rev.reviewer.profileImage}` : "/placeholder-avatar.png"}
                      alt="avatar"
                      className="reviewer-avatar"
                      onError={(e) => { e.target.src = "/placeholder-avatar.png"; }}
                    />
                    <div>
                      <span className="reviewer-name">{rev.reviewer?.name}</span>
                      <div className="stars-display mt-0" style={{ fontSize: "0.85rem" }}>
                        <StarDisplay rating={rev.rating} />
                      </div>
                    </div>
                  </div>
                  <span className="review-date">
                    {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="review-text">{rev.review}</p>

                {/* Edit/Delete actions */}
                {currentUser && rev.reviewer?._id === currentUser._id && (
                  <div className="review-actions">
                    <button
                      className="review-action-btn"
                      onClick={() => {
                        setEditingReviewId(rev._id);
                        setEditingForm({ rating: rev.rating, review: rev.review });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="review-action-btn delete"
                      onClick={() => handleDeleteReview(rev._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-center py-3">No reviews submitted for this seller yet.</p>
        )}
      </div>

      {/* ================= MORE FROM SELLER ================= */}
      {sellerBooks.length > 0 && (
        <div className="mt-5">
          <h4>More from this seller</h4>
          <div className="row">
            {sellerBooks.map(item => (
              <div className="col-md-3" key={item._id}>
                <div
                  className="card p-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/book/${item._id}`)}
                >
                  <img
                    src={item.images?.[0] || "/placeholder-book.jpg"}
                    alt="book"
                    style={{ height: "150px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "/placeholder-book.jpg";
                    }}
                  />
                  <h6 className="mt-2">{item.title}</h6>
                  <p>₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookDetail;