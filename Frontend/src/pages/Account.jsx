import React, { useEffect, useState } from "react";
import API from "../api/api";
import toast from "../utils/toast";
import "../styles/account.css";

function Account() {

  const [user, setUser] = useState(null);
  const [myBooks, setMyBooks] = useState([]);
  const [bookLoading, setBookLoading] = useState(true);
  const [myRequests, setMyRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  
  // LOAD USER + BOOKS + REQUESTS
 
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login first");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
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

    // 🔹 MY REQUESTS
    API.get("/api/requests/my-requests")
      .then(res => {
        setMyRequests(res.data);
        setRequestsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setRequestsLoading(false);
      });

  }, []);

  // IMAGE UPLOAD

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
      toast.success("Profile picture updated!");

    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Error uploading profile picture");
    }
  };


  //  DELETE BOOK
 
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this book?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/api/books/${id}`);

      setMyBooks(prev => prev.filter(book => book._id !== id));
      toast.success("Book deleted successfully!");

    } catch (err) {
      console.log(err);
      toast.error("Error deleting book");
    }
  };

  
  // DELETE REQUEST

  const handleDeleteRequest = async (id) => {
    const confirmDelete = window.confirm("Delete this book request?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/api/requests/${id}`);

      setMyRequests(prev => prev.filter(req => req._id !== id));
      toast.success("Request deleted successfully!");

    } catch (err) {
      console.log(err);
      toast.error("Error deleting request");
    }
  };


  //  LOADING

  if (user === null) {
    return <h3 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h3>;
  }

  return (
    <div className="account-container">

      <h1 className="account-title">My Account</h1>

      {/* PROFILE CARD */}
      <div className="account-card">

        <div className="profile-section">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : user?.profileImage
                  ? `${import.meta.env.VITE_API_URL}/uploads/${user.profileImage}`
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

      {/* MY BOOKS SECTION */}
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
                    src={book.images && book.images[0] ? book.images[0] : "/placeholder-book.jpg"}
                    className="card-img-top"
                    alt="book"
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "/placeholder-book.jpg";
                    }}
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

      {/*MY BOOK REQUESTS SECTION */}
      <div className="my-requests-section mt-5">

        <h2>My Book Requests</h2>

        {requestsLoading ? (
          <p>Loading...</p>
        ) : myRequests.length === 0 ? (
          <p>No book requests submitted yet.</p>
        ) : (
          <div className="row">
            {myRequests.map(request => (
              <div key={request._id} className="col-md-6 mb-4">
                <div className="card h-100 p-3" style={{ background: "#fcfbfa", borderColor: "#e5dfd6" }}>
                  <div className="card-body d-flex flex-column justify-content-between p-0">
                    <div>
                      <span className="badge bg-secondary mb-2" style={{ backgroundColor: "#8b5a2b" }}>Looking For</span>
                      <h5 className="card-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: "bold" }}>{request.bookName}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">by {request.author}</h6>
                      {request.message && (
                        <p className="card-text italic-text" style={{ fontStyle: "italic", color: "#555" }}>
                          "{request.message}"
                        </p>
                      )}
                      <p className="card-text" style={{ fontSize: "14px" }}>
                        📍 {request.location}
                      </p>
                    </div>
                    
                    <div className="mt-3">
                      <button
                        onClick={() => handleDeleteRequest(request._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete Request
                      </button>
                    </div>
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