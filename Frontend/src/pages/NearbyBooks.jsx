import React, { useEffect, useState } from "react";
import BookCardSkeleton from "../components/BookCardSkeleton";
import API from "../api/api";
import BookCard from "../components/BookCard";

function NearbyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNearbyBooks();
  }, []);

  const fetchNearbyBooks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/api/books/nearby", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(res.data);
    } catch (error) {
      console.log("Nearby Books Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>📍 Books Near You</h2>

      <p>
        Discover books available closest to your location.
      </p>

      {!loading && (
        <p>
          <strong>{books.length}</strong> nearby books found
        </p>
      )}

      {loading ? (
        <div className="row">
          {[...Array(12)].map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center mt-5">
          <h4>No nearby books found</h4>
          <p>Try checking back later.</p>
        </div>
      ) : (
        <div className="row">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default NearbyBooks;