import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api/api";
import BookCard from "../components/BookCard";

function Browse() {
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const location = useLocation();

  const categories = [
    "Academic & Textbooks",
    "Competitive Exam Books",
    "Programming & Technology",
    "Fiction",
    "Romance",
    "Mystery & Thriller",
    "Fantasy",
    "Self-Help",
    "Business & Finance",
    "Science",
    "Biography & Autobiography",
    "Bengali Books",
    "Hindi Books",
    "Children's Books",
    "Manga & Comics",
  ];

  useEffect(() => {
  const params = new URLSearchParams(location.search);

  const selectedCategory = params.get("category");

  if (selectedCategory) {
    setCategory(selectedCategory);
  }
}, [location.search]);


  useEffect(() => {
    API.get("/api/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">

        {/* LEFT SIDEBAR */}
        <div className="col-md-3">
          <div className="p-3 border rounded">
            <h5>Filters</h5>

            <hr />

            <h6>Categories</h6>

            <label>
              <input
                type="radio"
                name="category"
                checked={category === ""}
                onChange={() => setCategory("")}
              />{" "}
              All
            </label>

            <br />

            {categories.map((cat) => (
              <div key={cat}>
                <label>
                  <input
                    type="radio"
                    name="category"
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                  />{" "}
                  {cat}
                </label>
                <br />
              </div>
            ))}

            <br />

            <h6>Condition</h6>

            <label>
              <input
                type="radio"
                name="condition"
                checked={condition === ""}
                onChange={() => setCondition("")}
              />{" "}
              All
            </label>
            <br />

            <label>
              <input
                type="radio"
                name="condition"
                checked={condition === "Like New"}
                onChange={() => setCondition("Like New")}
              />{" "}
              Like New
            </label>
            <br />

            <label>
              <input
                type="radio"
                name="condition"
                checked={condition === "Very Good"}
                onChange={() => setCondition("Very Good")}
              />{" "}
              Very Good
            </label>
            <br />

            <label>
              <input
                type="radio"
                name="condition"
                checked={condition === "Good"}
                onChange={() => setCondition("Good")}
              />{" "}
              Good
            </label>
            <br />

            <label>
              <input
                type="radio"
                name="condition"
                checked={condition === "Fair"}
                onChange={() => setCondition("Fair")}
              />{" "}
              Fair
            </label>
            <br />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-md-9">
          <div className="row">
            {books
              .filter((book) => {
                return (
                  (category === "" ||
                    book.category === category) &&
                  (condition === "" ||
                    book.condition === condition)
                );
              })
              .map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Browse;