import React, { useEffect, useState } from "react";
import API from "../api/api";
import toast from "../utils/toast";
import "../styles/allrequests.css"
import getTimeAgo from "../utils/getTimeAgo";

function AllRequests() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        API.get("/api/requests")
            .then((res) => setRequests(res.data))
            .catch((err) => console.log(err));
    }, []);


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

                            {/* WhatsApp Button */}
                            <button
                                className="whatsapp-btn"
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AllRequests;