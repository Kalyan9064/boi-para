import "../styles/footer.css";

function Footer() {
  return (
    <div className="footer">

      {/* CTA */}
      <div className="footer-cta">
        <h2>Have Books Gathering Dust?</h2>

        <p>
          Join thousands of readers clearing their shelves and finding new homes
          for their beloved books. Listing is completely free.
        </p>

        <button className="cta-btn">Post a Free Ad</button>
      </div>

      {/* MAIN */}
      <div className="container footer-main">

        {/* LEFT */}
        <div className="footer-col">
          <h3>Boi-Para</h3>
          <p>
            The neighborhood for vintage and used books. Connect directly with
            fellow readers, buy and sell classic literature without intermediaries.
          </p>
        </div>

        {/* CENTER */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li>Browse Catalog</li>
            <li>Start Selling</li>
            <li>Messages</li>
            <li>How it Works</li>
          </ul>
        </div>

        {/* RIGHT */}
        <div className="footer-col">
          <h3>Legal</h3>
          <ul>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Safety Guidelines</li>
          </ul>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="container footer-bottom">
        <span>© 2026 Boi-Para Marketplace. All rights reserved.</span>
        <span>Connecting readers, one page at a time.</span>
      </div>

    </div>
  );
}

export default Footer;