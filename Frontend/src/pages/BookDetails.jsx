import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import "../styles/bookdetail.css";

function BookDetail() {

  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    API.get(`/api/books/${id}`)
      .then(res => setBook(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!book) return <h3>Loading...</h3>;

  return (
    <div className="container mt-4">

      <div className="row">

        {/* LEFT IMAGE */}
        <div className="col-md-6">
          <div className="image-box">
            <img
              src={`http://localhost:5000/uploads/${book.image}`}
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

          <h5 className="author">By {book.author}</h5>

          <h2 className="price">₹{book.price}</h2>

          <hr />

          <p className="location">📍 {book.location}</p>
          <p className="time">🕒 Posted recently</p>

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
      alert("Seller phone not available");
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

    </div>
  );
}

export default BookDetail;