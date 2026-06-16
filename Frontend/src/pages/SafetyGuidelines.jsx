import React from "react";
import {
  FaShieldAlt,
  FaShoppingBag,
  FaStore,
  FaBan,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import "../styles/safetyGuidelines.css";

function SafetyGuidelines() {
  return (
    <div className="safety-page">
      <div className="safety-wrapper">

        {/* Hero Section */}
        <div className="safety-hero">
          <div className="safety-icon">
            <FaShieldAlt />
          </div>

          <h1>Safety Guidelines</h1>

          <p>
            At <strong>Boi Para</strong>, we are committed to creating a safe
            and trustworthy community for students and book lovers. Please
            follow these guidelines to ensure secure and smooth transactions.
          </p>
        </div>

        {/* Buyers */}
        <div className="safety-card">
          <h2>
            <FaShoppingBag /> For Buyers
          </h2>

          <div className="guideline-item">
            <h3>Verify Book Details</h3>
            <p>
              Carefully review the book title, author, edition, condition,
              price, and photos before making a purchase.
            </p>
          </div>

          <div className="guideline-item">
            <h3>Inspect Before Payment</h3>
            <p>
              If meeting in person, inspect the book thoroughly to ensure it
              matches the seller's description.
            </p>
          </div>

          <div className="guideline-item">
            <h3>Meet in Safe Public Places</h3>
            <p>
              Arrange exchanges in public places such as colleges, libraries,
              cafés, or other busy locations.
            </p>
          </div>

          <div className="guideline-item">
            <h3>Use Secure Payment Methods</h3>
            <p>
              Never share OTPs, passwords, CVV numbers, or banking credentials
              with anyone.
            </p>
          </div>

          <div className="guideline-item">
            <h3>Report Suspicious Activity</h3>
            <p>
              Notify Boi Para if you encounter fraudulent behavior, fake
              listings, or inappropriate conduct.
            </p>
          </div>
        </div>

        {/* Sellers */}
        <div className="safety-card">
          <h2>
            <FaStore /> For Sellers
          </h2>

          <div className="guideline-item">
            <h3>Provide Accurate Information</h3>
            <p>
              Clearly describe your books and mention any damage, notes,
              highlighting, or missing pages.
            </p>
          </div>

          <div className="guideline-item">
            <h3>Upload Genuine Photos</h3>
            <p>
              Use clear and recent images of the actual book being sold.
            </p>
          </div>

          <div className="guideline-item">
            <h3>Protect Your Privacy</h3>
            <p>
              Avoid publicly sharing unnecessary personal information.
            </p>
          </div>

          <div className="guideline-item">
            <h3>Meet Safely</h3>
            <p>
              Prefer public locations for in-person transactions and inform
              someone you trust if necessary.
            </p>
          </div>

          <div className="guideline-item">
            <h3>Be Respectful</h3>
            <p>
              Communicate professionally and respond honestly to buyer
              questions.
            </p>
          </div>
        </div>

        {/* Prohibited Activities */}
        <div className="safety-card">
          <h2>
            <FaBan /> Prohibited Activities
          </h2>

          <ul className="prohibited-list">
            <li>
              <FaExclamationTriangle /> Posting fake or misleading listings.
            </li>

            <li>
              <FaExclamationTriangle /> Selling pirated, counterfeit, or illegal
              books.
            </li>

            <li>
              <FaExclamationTriangle /> Harassment, threats, or abusive language.
            </li>

            <li>
              <FaExclamationTriangle /> Scams, fraud, or deceptive practices.
            </li>

            <li>
              <FaExclamationTriangle /> Misusing another user's personal
              information.
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="safety-card disclaimer">
          <h2>
            <FaInfoCircle /> Disclaimer
          </h2>

          <p>
            Boi Para serves only as a platform that connects buyers and
            sellers. We do not inspect, verify, store, package, or deliver the
            books listed by users.
          </p>

          <p>
            Users are solely responsible for exercising caution, verifying
            information, and making informed decisions during transactions.
          </p>
        </div>

        {/* Footer Note */}
        <div className="safety-footer">
          <p>
            Thank you for helping us build a safe and respectful community for
            everyone at <strong>Boi Para.</strong>
          </p>

          <span>Last Updated: June 2026</span>
        </div>

      </div>
    </div>
  );
}

export default SafetyGuidelines;