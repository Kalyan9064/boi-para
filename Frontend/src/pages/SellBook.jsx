import React, { useState } from "react";
import "../styles/sell.css";
import API from "../api/api";

function SellBook() {

  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    category: "",
    condition: "",
    description: "",
    location: ""
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setImage(e.target.files[0]);
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const data = new FormData();

      for (let key in form) {
        data.append(key, form[key]);
      }

      if (image) {
        data.append("image", image);
      }

      await API.post("/api/books", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      alert("Book added successfully");
      window.location.href = "/";

    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error adding book");
    }
  };

  return (
    <div className="sell-container">

      <h1 className="sell-title">Sell Your Book</h1>

      <p className="sell-subtitle">
        Post an ad to find a new home for your pre-loved book. It's completely free.
      </p>

      <form onSubmit={handleSubmit} className="sell-card">

        {/* PHOTO */}
        <div className="section-title">Photos</div>

        <div className="photo-box">
          <p>Upload book photos</p>
          <input type="file" name="image" onChange={handleChange} />
        </div>

        {/* BOOK DETAILS */}

         {/* BOOK DETAILS */}
<div className="section-title">Book Details</div>

<label className="input-label">Book Title</label>
<input
  type="text"
  name="title"
  placeholder="e.g. 1984 by George Orwell"
  className="form-control"
  onChange={handleChange}
/>

<label className="input-label">Author</label>
<input
  type="text"
  name="author"
  placeholder="e.g. George Orwell"
  className="form-control"
  onChange={handleChange}
/>

<label className="input-label">Category</label>
<select
  name="category"
  className="form-control"
  onChange={handleChange}
>
  <option value="">Select Category</option>
  <option value="literature">Literature</option>
  <option value="academic">Academic</option>
  <option value="classic">Classic</option>
  <option value="fiction">Fiction</option>
</select>

<label className="input-label">Condition</label>
<select
  name="condition"
  className="form-control"
  onChange={handleChange}
>
  <option value="">Select Condition</option>
  <option>Like New</option>
  <option>Very Good</option>
  <option>Good</option>
  <option>Fair</option>
</select>

<label className="input-label">Description</label>
<textarea
  name="description"
  placeholder="Describe the book..."
  className="form-control"
  onChange={handleChange}
/>

{/* PRICE & LOCATION */}
<div className="section-title">Pricing & Location</div>

<label className="input-label">Price</label>
<input
  type="number"
  name="price"
  placeholder="₹ Price"
  className="form-control"
  onChange={handleChange}
/>

<label className="input-label">Location</label>
<input
  type="text"
  name="location"
  placeholder="e.g. Kolkata"
  className="form-control"
  onChange={handleChange}
/>

        <button type="submit" className="post-btn">
          Post Now
        </button>

      </form>

    </div>
  );
}

export default SellBook;