import "../styles/hero.css";
import { Link, useNavigate } from "react-router-dom";

function Hero() {

  const navigate = useNavigate();

  const handleSellClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
    } else {
      navigate("/sell-book");
    }
  };

  return (
    <div id="hero" className="hero">
      <div className="hero-overlay">
        <div className="container hero-content">

          <h1>
            Discover the Charm of{" "}
            <span className="highlight">Vintage</span> Books
          </h1>

          <p>
            Boi-Para is your neighborhood marketplace for classic literature,
            antique finds, and beloved secondhand stories.
          </p>

          <div className="hero-buttons">

            <Link to="/browse" className="btn-primary">
              Browse Collection →
            </Link>

            {/* ✅ SELL BUTTON */}
            <button onClick={handleSellClick} className="btn-outline">
              Sell a Book
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Hero;