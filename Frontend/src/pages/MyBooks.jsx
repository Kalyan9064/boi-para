import React, { useEffect, useState } from "react";
import API from "../api/api";

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

      alert("Book deleted");

      // remove from UI
      setBooks(books.filter(book => book._id !== id));

    } catch (error) {
      alert("Error deleting book");
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