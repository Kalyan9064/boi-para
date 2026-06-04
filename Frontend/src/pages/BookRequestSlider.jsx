import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/bookrequestslider.css";

function BookRequestSlider() {

    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);  // ← add
    const [form, setForm] = useState({                  // ← add
        bookName: "",
        author: "",
        message: "",
        location: ""
    });

    // ==============================
    // FETCH ALL REQUESTS
    // ==============================
    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await API.get("/api/requests");
            setRequests(res.data);
        } catch (error) {
            console.log("Error fetching requests:", error);
        }
    };

    // ==============================
    // TIME AGO FUNCTION
    // ==============================
    const getTimeAgo = (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now - past) / 1000);
        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(diffInSeconds / 3600);
        const days = Math.floor(diffInSeconds / 86400);
        if (days > 0) return `${days} day(s) ago`;
        if (hours > 0) return `${hours} hour(s) ago`;
        if (minutes > 0) return `${minutes} minute(s) ago`;
        return "Just now";
    };

    // ==============================
    // WHATSAPP HANDLER
    // ==============================
    // const handleWhatsApp = (phone) => {
    //     window.open(`https://wa.me/91${phone}`);
        
    // };

    // ==============================
    // EMPTY STATE
    // ==============================
    if (requests.length === 0) {
        return null; // hide section if no requests
    }

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            await API.post("/api/requests", form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Book requested successfully!");
            setShowModal(false);
            setForm({ bookName: "", author: "", message: "", location: "" });
            fetchRequests(); // refresh slider

        } catch (error) {
            alert(error.response?.data?.message || "Error submitting request");
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="slider-section">

            {/* ======== TOP ROW ======== */}
            <div className="slider-top-row">
                <h2 className="slider-heading">
                    Community Book Requests
                </h2>
                <button
                    className="see-all-btn"
                    onClick={() => {
                        //navigate("/all-requests")
                          setShowModal(true);  // ← only this
                    }}


                    //  className="request-book-btn"
                    // onClick={() => {
                    //     const token = localStorage.getItem("token");
                    //     if (!token) {
                    //         alert("Please login first");
                    //         return;
                    //     }
                    //     setShowModal(true);  // ← only this
                    // }}
                >
                    See All →
                </button>
            </div>

            {/* ======== SLIDER ======== */}
            <div className="slider-wrapper">
                <div className="slider-track">

                    {[...requests, ...requests].map((request, index) => (
                        <div key={index} className="request-card">

                            {/* LABEL */}
                            <span className="card-label">Looking For</span>

                            {/* BOOK NAME */}
                            <h4 className="card-title">
                                {request.bookName}
                            </h4>

                            {/* AUTHOR */}
                            <p className="card-author">
                                by {request.author}
                            </p>

                            {/* DIVIDER */}
                            <hr className="card-divider" />

                            {/* MESSAGE */}
                            {request.message && (
                                <p className="card-message">
                                    "{request.message}"
                                </p>
                            )}

                            {/* LOCATION + TIME */}
                            <p className="card-meta">
                                📍 {request.location} • {getTimeAgo(request.createdAt)}
                            </p>

                            {/* BUYER NAME */}
                            <p className="card-buyer">
                                👤 {request.requestedBy?.name}
                            </p>

                            {/* WHATSAPP BUTTON */}
                            <button
                                className="whatsapp-btn"
                                onClick={() => {
                                    // handleWhatsApp(request.requestedBy?.phone)
                                    const author = request.author;
                                    const phone = request.requestedBy?.phone;

                                    if (!phone) {
                                        alert("Phone not available");
                                        return;
                                    }

                                    const message = `Hi, I have the book "${request.bookName}" by ${author} which you requested on Boi Para. I want to sell this book. Are you interested? `;
                                    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

                                    window.open(url, "_blank");
                                }}
                            >
                                I Have This Book
                            </button>

                        </div>
                    ))}

                </div>
            </div>

            {/* ======== BOTTOM BUTTON ======== */}
            <div className="slider-bottom">
                <button
                    className="request-book-btn"
                    onClick={() => {
                        const token = localStorage.getItem("token");
                        if (!token) {
                            alert("Please login first");
                            return;
                        }
                        setShowModal(true);  // ← only this
                    }}
                >
                    + Request a Book
                </button>
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">

                        {/* HEADER */}
                        <div className="modal-header">
                            <h2>📚 Request a Book</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* FORM */}
                        <input
                            className="modal-input"
                            type="text"
                            name="bookName"
                            placeholder="Book Name *"
                            value={form.bookName}
                            onChange={handleChange}
                        />

                        <input
                            className="modal-input"
                            type="text"
                            name="author"
                            placeholder="Author *"
                            value={form.author}
                            onChange={handleChange}
                        />

                        <input
                            className="modal-input"
                            type="text"
                            name="location"
                            placeholder="Your Location *"
                            value={form.location}
                            onChange={handleChange}
                        />

                        <textarea
                            className="modal-input"
                            name="message"
                            placeholder="Message (optional)"
                            value={form.message}
                            onChange={handleChange}
                            rows={3}
                        />

                        {/* SUBMIT */}
                        <button
                            className="modal-submit"
                            onClick={handleSubmit}
                        >
                            Submit Request
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}

export default BookRequestSlider;