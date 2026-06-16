import "../styles/footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer">

      {/* ================= CTA ================= */}
      <div className="footer-cta">
        <h2>Have Books Gathering Dust?</h2>

        <p>
          Join thousands of readers clearing their shelves and finding new homes
          for their beloved books. Listing is completely free.
        </p>

        <Link to="/sell-book">
          <button className="cta-btn">Post a Free Ad</button>
        </Link>
      </div>

      {/* ================= MAIN ================= */}
      <div className="container footer-main">

        {/* LEFT */}
        <div className="footer-col">
          <h3>Boi-Para</h3>
          <p>
            The neighborhood for vintage and used books. Connect directly with
            fellow readers, buy and sell classic literature without intermediaries.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/browse">Browse Catalog</Link></li>
            <li><Link to="/sell-book">Start Selling</Link></li>
            <li><Link>Messages</Link></li>
            <li>
              <Link to="/#how-it-works">
                How it Works
              </Link>
            </li>
          </ul>
        </div>

        {/* LEGAL */}
        <div className="footer-col">
          <h3>Legal</h3>
          <ul>
            <li><Link to="/terms-of-service">Terms of Service</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/safety-guidelines">Safety Guidelines</Link></li>
          </ul>
        </div>

        {/* CONTACT (NEW) */}
        <div className="footer-col">
          <h3>Contact Us</h3>
          <p>Email:<a
            href="mailto:support.boipara@gmail.com"
            className="contact-email"
          >
            boipara.support@gmail.com
          </a></p> 
        </div>

      </div>

      {/* ================= BOTTOM ================= */}
      <div className="container footer-bottom">
        <span>© 2026 Boi-Para Marketplace. All rights reserved.</span>
        <span>Connecting readers, one page at a time.</span>
      </div>

    </div>
  );
}

export default Footer;