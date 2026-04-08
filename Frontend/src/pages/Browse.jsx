import React, { useEffect, useState } from "react";
import API from "../api/api";
import BookCard from "../components/BookCard";

function Browse() {

  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");

  useEffect(() => {
    API.get("/api/books")
      .then(res => setBooks(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container mt-4">

      <div className="row">

        {/* 🔹 LEFT SIDEBAR */}
        <div className="col-md-3">

          <div className="p-3 border rounded">

            <h5>Filters</h5>

            <hr />

            <h6>Categories</h6>

<label>
  <input type="radio" name="category" onChange={() => setCategory("")} />
  All
</label><br />

<label>
  <input type="radio" name="category" onChange={() => setCategory("classic")} />
  Classic
</label><br />

<label>
  <input type="radio" name="category" onChange={() => setCategory("literature")} />
  Literature
</label><br />

<label>
  <input type="radio" name="category" onChange={() => setCategory("academic")} />
  Academic
</label><br />

            <br />

            <h6>Condition</h6>

<label>
  <input type="radio" name="condition" onChange={() => setCondition("")} />
  All
</label><br />

<label>
  <input type="radio" name="condition" onChange={() => setCondition("Like New")} />
  Like New
</label><br />

<label>
  <input type="radio" name="condition" onChange={() => setCondition("Very Good")} />
  Very Good
</label><br />

<label>
  <input type="radio" name="condition" onChange={() => setCondition("Good")} />
  Good
</label><br />

<label>
  <input type="radio" name="condition" onChange={() => setCondition("Fair")} />
  Fair
</label><br />

          </div>

        </div>

        {/* 🔹 RIGHT CONTENT */}
        <div className="col-md-9">

          <div className="row">
           {books
  .filter(book => {
    return (
      (category === "" || book.category === category) &&
      (condition === "" || book.condition === condition)
    );
  })
  .map(book => (
    <BookCard key={book._id} book={book} />
))}
          </div>

        </div>

      </div>

    </div>
  );
}

export default Browse;