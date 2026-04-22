import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/bookdetail.css";

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [sellerBooks, setSellerBooks] = useState([]);

  // ==============================
  // 📦 FETCH MAIN BOOK
  // ==============================
  useEffect(() => {
    API.get(`/api/books/${id}`)
      .then(res => setBook(res.data))
      .catch(err => console.log(err));
  }, [id]);

  // ==============================
  // 📚 FETCH SELLER BOOKS
  // ==============================
  useEffect(() => {
    if (book?.seller?._id) {
      API.get(`/api/books/seller/${book.seller._id}`)
        .then(res => {
          // remove current book
          const filtered = res.data.filter(
            b => b._id !== book._id
          );
          setSellerBooks(filtered);
        })
        .catch(err => console.log(err));
    }
  }, [book]);

  if (!book) return <h3>Loading...</h3>;

  return (
    <div className="container mt-4">

      <div className="row">

        {/* LEFT IMAGE */}
        <div className="col-md-6">
          <div className="image-box">
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/${book.image}`}
              alt="book"
            />
          </div>
        </div>

        {/* RIGHT DETAILS */}
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

          {/* SELLER BOX */}
          <div className="seller-box">
            <h6>Seller Information</h6>

            <p><strong>{book.seller?.name}</strong></p>
            <p>{book.seller?.email}</p>

            <button
              onClick={() => {
                const phone = book.seller?.phone;

                if (!phone) {
                  alert("Phone not available");
                  return;
                }

                const message = `Hi, I'm interested in your book: ${book.title}`;
                const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

                window.open(url, "_blank");
              }}
              style={{
                background: "#25D366",
                color: "#fff",
                border: "none",
                padding: "10px 15px",
                marginTop: "10px",
                cursor: "pointer"
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

      {/* ==============================
          📚 MORE FROM THIS SELLER
      ============================== */}
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
                    src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                    alt="book"
                    style={{ height: "150px", objectFit: "cover" }}
                  />

                  <h6>{item.title}</h6>
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