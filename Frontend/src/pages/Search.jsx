import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api/api";
import BookCard from "../components/BookCard";

function Search() {
  const [books, setBooks] = useState([]);

  const query = new URLSearchParams(useLocation().search);
  const q = query.get("q");

  useEffect(() => {
    if (!q) return;

    API.get(`/api/books/search?q=${q}`)
      .then(res => setBooks(res.data))
      .catch(err => console.log(err));
  }, [q]);

  return (
    <div className="container mt-4">

      <h3>Search Results for "{q}"</h3>

      <div className="row">
        {books.map(book => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>

      {books.length === 0 && (
        <h5>No books found 😢</h5>
      )}

    </div>
  );
}

export default Search;