import React from "react";
import {
  FaUserShield,
  FaDatabase,
  FaLock,
  FaCookieBite,
  FaExchangeAlt,
  FaEnvelope,
} from "react-icons/fa";
import "../styles/privacyPolicy.css";

function PrivacyPolicy() {
  return (
    <div className="policy-page">
      <div className="policy-wrapper">

        <div className="policy-hero">
          <div className="policy-icon">
            <FaUserShield />
          </div>

          <h1>Privacy Policy</h1>

          <p>
            Your privacy matters to us. This Privacy Policy explains how
            Boi Para collects, uses, and protects your information when
            you use our platform.
          </p>
        </div>

        <div className="policy-card">
          <h2><FaDatabase /> Information We Collect</h2>

          <p>We may collect information such as:</p>

          <ul>
            <li>Name and email address during registration.</li>
            <li>Profile information you choose to provide.</li>
            <li>Book listing details and uploaded images.</li>
            <li>Communication details submitted through the platform.</li>
          </ul>
        </div>

        <div className="policy-card">
          <h2><FaExchangeAlt /> How We Use Your Information</h2>

          <ul>
            <li>To create and manage your account.</li>
            <li>To display and manage book listings.</li>
            <li>To improve our services and user experience.</li>
            <li>To respond to support requests.</li>
            <li>To maintain the safety and integrity of Boi Para.</li>
          </ul>
        </div>

        <div className="policy-card">
          <h2><FaLock /> Data Security</h2>

          <p>
            We take reasonable measures to protect your information.
            However, no method of electronic transmission or storage
            is completely secure.
          </p>
        </div>

        <div className="policy-card">
          <h2><FaCookieBite /> Cookies and Analytics</h2>

          <p>
            Boi Para may use cookies or similar technologies to enhance
            your experience, remember preferences, and analyze website
            usage.
          </p>
        </div>

        <div className="policy-card">
          <h2><FaEnvelope /> Contact Us</h2>

          <p>
            If you have questions about this Privacy Policy, please
            contact us through the Contact Us page.
          </p>
        </div>

        <div className="policy-footer">
          <span>Last Updated: June 2026</span>
        </div>

      </div>
    </div>
  );
}

export default PrivacyPolicy;