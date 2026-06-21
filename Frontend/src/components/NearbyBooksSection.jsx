import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import BookCard from "./BookCard";
import BookCardSkeleton from "./BookCardSkeleton";

function NearbyBooksSection() {
  const [nearbyBooks, setNearbyBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchNearbyBooks();
  }, []);

  const fetchNearbyBooks = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await API.get("/api/books/nearby", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNearbyBooks(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">

      <h2>📍 Books Near You</h2>

      <p>
        Books available closest to your location.
      </p>

      {loading ? (
        <div className="row">
          {[...Array(8)].map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="row">
          {nearbyBooks.slice(0, 8).map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}

      <div className="slider-bottom">
        <button
          className="request-book-btn"
          onClick={() => navigate("/book-near-you")}
        >
          See All Nearby Books →
        </button>
      </div>

    </div>
  );
}

export default NearbyBooksSection;