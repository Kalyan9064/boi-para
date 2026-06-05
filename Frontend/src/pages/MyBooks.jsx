import React, { useEffect, useState } from "react";
import API from "../api/api";
import toast from "../utils/toast";

function MyBooks() {

  const [books, setBooks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get("/api/books/my-books", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setBooks(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await API.delete(`/api/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success("Book deleted successfully!");

      // remove from UI
      setBooks(books.filter(book => book._id !== id));

    } catch (error) {
      toast.error("Error deleting book");
    }
  };

  return (
    <div>

      <h2>My Books</h2>

      {books.map(book => (
        <div key={book._id}>

          <h3>{book.title}</h3>
          <p>{book.author}</p>

          <button onClick={() => handleDelete(book._id)}>
            Delete
          </button>

        </div>
      ))}

    </div>
  );
}

export default MyBooks;