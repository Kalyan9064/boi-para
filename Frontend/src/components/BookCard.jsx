import { Link } from "react-router-dom";
import "../styles/bookcard.css";

function BookCard({ book }) {

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

  return (
    <div className="col-md-3 mb-4"> {/* 4 cards per row */}
    
     <Link to={`/book/${book._id}`} className="book-link">
      <div className="book-card">

        {/* IMAGE + PRICE BADGE */}
        
        <div className="image-wrapper">
          <img
            src={`http://localhost:5000/uploads/${book.image}`}
            alt="book"
            className="book-image"
          />

          <div className="price-badge">
            ₹{book.price}
          </div>
        </div>

        <div className="book-body">

          <h6 className="title">
              {book.title}
          </h6>

          <p className="author">{book.author}</p>

          {/* TAGS (temporary static) */}
          <div className="tags">
            <span className="tag">{book.condition}</span>
            <span className="tag">{book.category}</span>
          </div>

          {/* LOCATION + TIME */}
          <div className="bottom-row">
            <span>📍 {book.location}</span>
            {/* <span>⏱ {getTimeAgo(book.createdAt)}</span> */}
             {/* <span>📍 {new Date(book.createdAt).toLocaleDateString()}</span> */}
            <span>⏱ {getTimeAgo(book.createdAt)}</span>
          </div>

        </div>

      </div>
      </Link>

    </div>
  );
}

export default BookCard;