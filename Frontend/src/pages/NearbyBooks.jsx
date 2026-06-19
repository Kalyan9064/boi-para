import React, { useEffect, useState } from "react";
import BookCardSkeleton from "../components/BookCardSkeleton";
import API from "../api/api";
import BookCard from "../components/BookCard";

function NearbyBooks() {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNearbyBooks();
    }, []);

    const fetchNearbyBooks = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await API.get("/api/books/nearby", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setBooks(res.data);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">

            <h2>📍 Books Near You</h2>

            <p>
                Discover books available closest to your location.
            </p>

            {loading ? (
                <div className="row">
                    {[...Array(12)].map((_, index) => (
                        <BookCardSkeleton key={index} />
                    ))}
                </div>
            ) : (
                <div className="row">
                    {books.map(book => (
                        <BookCard
                            key={book._id}
                            book={book}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}

export default NearbyBooks;