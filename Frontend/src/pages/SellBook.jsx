import React, { useState } from "react";
import "../styles/sell.css";
import API from "../api/api";
import toast from "../utils/toast";

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

  const [images, setImages] = useState([]);         // actual File objects
  const [previews, setPreviews] = useState([]);     // preview URLs for display

  // ==============================
  // HANDLE TEXT INPUTS
  // ==============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ==============================
  // HANDLE IMAGE SELECT
  // ==============================
  const handleImageChange = (e) => {
    const selected = Array.from(e.target.files);

    // max 5 images total
    const combined = [...images, ...selected].slice(0, 5);
    setImages(combined);

    // generate preview URLs
    const urls = combined.map(file => URL.createObjectURL(file));
    setPreviews(urls);
  };

  // ==============================
  // REMOVE ONE IMAGE
  // ==============================
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  // ==============================
  // SUBMIT
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login first");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least 1 image");
      return;
    }

    try {
      const data = new FormData();

      // append all text fields
      for (let key in form) {
        data.append(key, form[key]);
      }

      // append all images with same key "images"
      images.forEach(img => {
        data.append("images", img);
      });

      await API.post("/api/books", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      toast.success("Book added successfully! 🎉");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);

    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error adding book");
    }
  };

  return (
    <div className="sell-container">

      <h1 className="sell-title">Sell Your Book</h1>
      <p className="sell-subtitle">
        Post an ad to find a new home for your pre-loved book. It's completely free.
      </p>

      <form onSubmit={handleSubmit} className="sell-card">

        {/* ======== PHOTOS SECTION ======== */}
        <div className="section-title">Photos</div>

        <div className="photo-box">
          <p>📸 Upload up to 5 book photos</p>

          <input
            type="file"
            accept="image/*"
            multiple                        
            onChange={handleImageChange}
            style={{ marginTop: "10px" }}
          />

          <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
            {images.length}/5 images selected
          </p>
        </div>

        {/* ======== IMAGE PREVIEWS ======== */}
        {previews.length > 0 && (
          <div className="preview-grid">
            {previews.map((url, index) => (
              <div key={index} className="preview-item">

                <img
                  src={url}
                  alt={`preview-${index}`}
                  className="preview-img"
                />

                {/* REMOVE BUTTON */}
                <button
                  type="button"
                  className="preview-remove"
                  onClick={() => removeImage(index)}
                >
                  ✕
                </button>

                {/* FIRST IMAGE BADGE */}
                {index === 0 && (
                  <span className="preview-main-badge">Main</span>
                )}

              </div>
            ))}
          </div>
        )}

        {/* ======== BOOK DETAILS ======== */}
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
        <select name="category" className="form-control" onChange={handleChange}>
          <option value="">Select Category</option>
          <option value="literature">Literature</option>
          <option value="academic">Academic</option>
          <option value="classic">Classic</option>
          <option value="fiction">Fiction</option>
        </select>

        <label className="input-label">Condition</label>
        <select name="condition" className="form-control" onChange={handleChange}>
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

        {/* ======== PRICE & LOCATION ======== */}
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
          Post Now 🚀
        </button>

      </form>
    </div>
  );
}

export default SellBook;