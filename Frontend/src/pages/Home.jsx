import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import API from "../api/api";
import BookCard from "../components/BookCard";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import "../styles/home.css";
import BookRequestSlider from "./BookRequestSlider";

function Home() {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);

  // ✅ INITIAL LOAD
  useEffect(() => {
    setLoading(true);

   API.get(`/api/books?page=${page}`)
  .then(res => {
    console.log(res.data);
    setBooks(res.data);
    setLoading(false);
  })
      .catch(err => {
        console.log("ERROR:", err);
        setLoading(false);
      });
  }, [page]);

  return (
  <div>

    {/*  HERO */}
    <Hero />
    <HowItWorks />
    <BookRequestSlider />

    {/*  MAIN CONTENT */}
    <div className="container mt-5">

      <h2>Freshly Listed</h2>
      <p>
           Discover the latest additions to our community library.
      </p>

      {/*  LOADING */}
      {loading && (
        <div className="text-center mb-3">
          <h5>Loading...</h5>
        </div>
      )}

      {/*  EMPTY */}
      {!loading && books.length === 0 && (
        <div className="text-center mt-5">
          <h5>No books found </h5>
        </div>
      )}

      {/*  BOOK GRID */}
      <div className="row">
        {books.map(book => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>

    </div>

    {/* Divider Line */}
    <div className="footer-divider"></div>
    {/* <Footer /> */}
  </div>
);
}

export default Home;