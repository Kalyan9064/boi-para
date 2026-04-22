import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

function EditBook() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    category: "",
    condition: "",
    description: "",
    location: ""
  });

  // load existing book
  useEffect(() => {
    API.get(`/api/books/${id}`)
      .then(res => setForm(res.data))
      .catch(err => console.log(err));
  }, [id]);

  // input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // update book
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    await API.put(
      `/api/books/${id}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Book updated successfully");
    navigate("/account");

  } catch (err) {
    console.log(err.response?.data || err.message);
    alert("Error updating book");
  }
};

  return (
    <div className="container mt-4">

      <h2>Edit Book</h2>

      <form onSubmit={handleSubmit}>

        <input name="title" value={form.title} onChange={handleChange} className="form-control mb-2" />

        <input name="author" value={form.author} onChange={handleChange} className="form-control mb-2" />

        <input type="number" name="price" value={form.price} onChange={handleChange} className="form-control mb-2" />

        <input name="category" value={form.category} onChange={handleChange} className="form-control mb-2" />

        <input name="condition" value={form.condition} onChange={handleChange} className="form-control mb-2" />

        <input name="location" value={form.location} onChange={handleChange} className="form-control mb-2" />

        <textarea name="description" value={form.description} onChange={handleChange} className="form-control mb-2" />

        <button type="submit" className="btn btn-dark">Update Book</button>

      </form>

    </div>
  );
}

export default EditBook;