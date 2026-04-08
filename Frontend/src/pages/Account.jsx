import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/account.css";

function Account() {

  const [user, setUser] = useState(null);
  const [myBooks, setMyBooks] = useState([]);
  const [bookLoading, setBookLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==============================
  // 📦 LOAD USER + BOOKS
  // ==============================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    // 🔹 USER DATA
    API.get("/api/auth/profile")
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.log(err);
        setUser({});
      });

    // 🔹 MY BOOKS
    API.get("/api/books/my-books")
      .then(res => {
        setMyBooks(res.data);
        setBookLoading(false);
      })
      .catch(err => {
        console.log(err);
        setBookLoading(false);
      });

  }, []);

  // ==============================
  // 📤 IMAGE UPLOAD
  // ==============================
  const handleImageUpload = async (file) => {
    if (!file) return;

    setImage(file);
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await API.post("/api/auth/upload-profile", formData);

      setUser(prev => ({
        ...prev,
        profileImage: res.data.image
      }));

      setLoading(false);

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // ==============================
  // ❌ DELETE BOOK
  // ==============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this book?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/api/books/${id}`);

      setMyBooks(prev => prev.filter(book => book._id !== id));

    } catch (err) {
      console.log(err);
      alert("Error deleting book");
    }
  };

  // ==============================
  // ⏳ LOADING
  // ==============================
  if (user === null) {
    return <h3 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h3>;
  }

  return (
    <div className="account-container">

      <h1 className="account-title">My Account</h1>

      {/* ==============================
          👤 PROFILE CARD
      ============================== */}
      <div className="account-card">

        <div className="profile-section">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : user?.profileImage
                  ? `http://localhost:5000/uploads/${user.profileImage}`
                  : "https://via.placeholder.com/120"
            }
            alt="profile"
            className="profile-img"
          />

          <input
            type="file"
            onChange={(e) => handleImageUpload(e.target.files[0])}
          />

          {loading && <p>Uploading...</p>}
        </div>

        <div className="info-section">
          <p><strong>Name:</strong> {user?.name || "N/A"}</p>
          <p><strong>Email:</strong> {user?.email || "N/A"}</p>
          <p><strong>Phone:</strong> {user?.phone || "N/A"}</p>
        </div>

      </div>

      {/* ==============================
          📚 MY BOOKS SECTION
      ============================== */}
      <div className="my-books-section">

        <h2>My Books</h2>

        {bookLoading ? (
          <p>Loading...</p>
        ) : myBooks.length === 0 ? (
          <p>No books uploaded 😢</p>
        ) : (
          <div className="row">

            {myBooks.map(book => (
              <div key={book._id} className="col-md-4 mb-4">

                <div className="card h-100">

                  <img
                    src={`http://localhost:5000/uploads/${book.image}`}
                    className="card-img-top"
                    alt="book"
                    style={{ height: "200px", objectFit: "cover" }}
                  />

                  <div className="card-body">

                    <h5>{book.title}</h5>
                    <p>{book.author}</p>
                    <p>₹{book.price}</p>

                    <button
  onClick={() => handleDelete(book._id)}
  style={{
    background: "red",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    marginRight: "10px"
  }}
>
  Delete
</button>

<button
  onClick={() => window.location.href = `/edit-book/${book._id}`}
  style={{
    background: "#333",
    color: "#fff",
    border: "none",
    padding: "5px 10px"
  }}
>
  Edit
</button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Account;