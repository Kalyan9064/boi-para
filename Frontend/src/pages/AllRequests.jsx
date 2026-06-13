import React, { useEffect, useState } from "react";
import API from "../api/api";
import toast from "../utils/toast";
import "../styles/allrequests.css"

function AllRequests() {
    const [requests, setRequests] = useState([]);

    const token = localStorage.getItem("token");
    let loggedInUserId = null;
    if (token) {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            loggedInUserId = JSON.parse(window.atob(base64)).id;
        } catch (e) {
            console.log("Token decode error:", e);
        }
    }

    useEffect(() => {
        API.get("/api/requests")
            .then((res) => setRequests(res.data))
            .catch((err) => console.log(err));
    }, []);

    // Time Ago Function
    const getTimeAgo = (date) => {
        const now = new Date();
        const past = new Date(date);

        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} sec ago`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} min ago`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} hr ago`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Delete this book request?");
        if (!confirmDelete) return;

        try {
            await API.delete(`/api/requests/${id}`);
            setRequests(prev => prev.filter(req => req._id !== id));
            toast.success("Request deleted successfully!");
        } catch (err) {
            console.log(err);
            toast.error("Error deleting request");
        }
    };

    return (
        <div className="all-requests-container">
            <h1>All Book Requests</h1>

            {requests.length === 0 ? (
                <p>No requests found.</p>
            ) : (
                <div className="all-requests-grid">
                    {requests.map((request) => (
                        <div key={request._id} className="request-card">

                            {/* Label */}
                            <span className="card-label">
                                Looking For
                            </span>

                            {/* Book Name */}
                            <h4 className="card-title">
                                {request.bookName}
                            </h4>

                            {/* Author */}
                            <p className="card-author">
                                by {request.author}
                            </p>

                            <hr className="card-divider" />

                            {/* Message */}
                            {request.message && (
                                <p className="card-message">
                                    "{request.message}"
                                </p>
                            )}

                            {/* Location and Time */}
                            <p className="card-meta">
                                📍 {request.location} •{" "}
                                {getTimeAgo(request.createdAt)}
                            </p>

                            {/* Buyer */}
                            <p className="card-buyer">
                                👤 {request.requestedBy?.name}
                            </p>

                            {/* Action Buttons */}
                            <div className="card-actions" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                {/* WhatsApp Button */}
                                <button
                                    className="whatsapp-btn"
                                    style={{ flex: 1 }}
                                    onClick={() => {
                                        const phone =
                                            request.requestedBy?.phone;

                                        if (!phone) {
                                            toast.error(
                                                "Phone not available"
                                            );
                                            return;
                                        }

                                        const message = `Hi, I have the book "${request.bookName}" by ${request.author} which you requested on Boi Para. I want to sell this book. Are you interested?`;

                                        const url = `https://wa.me/${phone}?text=${encodeURIComponent(
                                            message
                                        )}`;

                                        window.open(url, "_blank");
                                    }}
                                >
                                    I Have This Book
                                </button>

                                {request.requestedBy?._id === loggedInUserId && (
                                    <button
                                        className="delete-request-btn"
                                        style={{
                                            background: "#dc3545",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "8px",
                                            padding: "10px 15px",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            transition: "background 0.3s"
                                        }}
                                        onClick={() => handleDelete(request._id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AllRequests;