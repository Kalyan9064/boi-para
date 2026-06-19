import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import API from "../api/api";
import BookCard from "../components/BookCard";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import "../styles/home.css";
import BookRequestSlider from "./BookRequestSlider";
import { useNavigate } from "react-router-dom";
import CategorySection from "../components/CategorySection";
import BookCardSkeleton from "../components/BookCardSkeleton";
import NearbyBooks from "../pages/NearbyBooks";

function Home() {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

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

      <Hero />

      <CategorySection />

      {/*  MAIN CONTENT */}
      <div className="container mt-5">

        <h2>Freshly Listed</h2>
        <p>
          Discover the latest additions to our community library.
        </p>


        {/*  EMPTY */}
        {!loading && books.length === 0 && (
          <div className="text-center mt-5">
            <h5>No books found </h5>
          </div>
        )}

        {/*  BOOK GRID */}
        <div className="row">
          {loading
            ? [...Array(8)].map((_, index) => (
              <BookCardSkeleton key={index} />
            ))
            : books
              .slice(0, 8)
              .map(book => (
                <BookCard key={book._id} book={book} />
              ))}
        </div>

        <div className="slider-bottom">
          <button
            className="request-book-btn"
            onClick={() => {
              navigate("/browse");
            }}
          >
            Browse All Books →
          </button>
        </div>
        <br></br>
        <br></br>
      </div>

      <NearbyBooks />

      <HowItWorks />

      <BookRequestSlider />

      {/* Divider Line */}
      <div className="footer-divider"></div>
      {/* <Footer /> */}
    </div>
  );
}

export default Home;