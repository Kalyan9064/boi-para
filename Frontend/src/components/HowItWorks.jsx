import "../styles/howitworks.css";

function HowItWorks() {
  return (
    <div className="how-section">

      <h2 className="how-title">How It Works</h2>

      <div className="how-grid">

        <div className="how-card">
          <div className="how-icon">📚</div>
          <h4>Browse Books</h4>
          <p>Explore thousands of second-hand books near you.</p>
        </div>

        <div className="how-card">
          <div className="how-icon">💬</div>
          <h4>Contact Seller</h4>
          <p>Chat directly with sellers via WhatsApp.</p>
        </div>

        <div className="how-card">
          <div className="how-icon">💰</div>
          <h4>Buy or Sell</h4>
          <p>Get the best deals or sell your books easily.</p>
        </div>

      </div>

    </div>
  );
}

export default HowItWorks;