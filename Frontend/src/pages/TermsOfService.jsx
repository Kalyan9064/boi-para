import React from "react";
import {
  FaFileContract,
  FaUserCheck,
  FaBook,
  FaBan,
  FaExclamationCircle,
  FaGavel,
  FaEnvelope,
} from "react-icons/fa";
import "../styles/termsOfService.css";

function TermsOfService() {
  return (
    <div className="service-page">
      <div className="service-wrapper">

        {/* Hero Section */}
        <div className="service-hero">
          <div className="service-icon">
            <FaFileContract />
          </div>

          <h1>Terms of Service</h1>

          <p>
            By accessing or using Boi Para, you agree to comply with these
            Terms of Service. Please read them carefully before using our
            platform.
          </p>
        </div>

        {/* Acceptance */}
        <div className="service-card">
          <h2>
            <FaUserCheck /> Acceptance of Terms
          </h2>

          <p>
            By creating an account, browsing listings, or using any feature
            of Boi Para, you acknowledge that you have read, understood,
            and agreed to these Terms of Service.
          </p>
        </div>

        {/* Platform Usage */}
        <div className="service-card">
          <h2>
            <FaBook /> Use of the Platform
          </h2>

          <ul>
            <li>You must provide accurate information when registering.</li>
            <li>You are responsible for maintaining your account security.</li>
            <li>You agree to use Boi Para only for lawful purposes.</li>
            <li>You must not impersonate another person or organization.</li>
          </ul>
        </div>

        {/* User Listings */}
        <div className="service-card">
          <h2>
            <FaBook /> Book Listings
          </h2>

          <ul>
            <li>
              Sellers are responsible for the accuracy of their listings.
            </li>

            <li>
              Books listed must be genuine and legally owned by the seller.
            </li>

            <li>
              Sellers must disclose the actual condition of books.
            </li>

            <li>
              Boi Para reserves the right to remove listings that violate
              these terms.
            </li>
          </ul>
        </div>

        {/* Prohibited Conduct */}
        <div className="service-card">
          <h2>
            <FaBan /> Prohibited Conduct
          </h2>

          <ul>
            <li>Posting false, misleading, or duplicate listings.</li>

            <li>Using abusive, threatening, or offensive language.</li>

            <li>Attempting scams or fraudulent activities.</li>

            <li>Violating applicable laws and regulations.</li>

            <li>Misusing another user's personal information.</li>
          </ul>
        </div>

        {/* Transactions */}
        <div className="service-card">
          <h2>
            <FaExclamationCircle /> Transactions and Responsibility
          </h2>

          <p>
            Boi Para acts solely as a platform connecting buyers and sellers.
            We do not inspect, verify, own, store, package, ship, or deliver
            books listed on the platform.
          </p>

          <p>
            Buyers and sellers are solely responsible for their interactions,
            negotiations, payments, and exchanges.
          </p>
        </div>

        {/* Limitation of Liability */}
        <div className="service-card">
          <h2>
            <FaGavel /> Limitation of Liability
          </h2>

          <p>
            To the fullest extent permitted by law, Boi Para shall not be
            liable for any direct, indirect, incidental, or consequential
            damages arising from the use of the platform or transactions
            between users.
          </p>
        </div>

        {/* Changes */}
        <div className="service-card">
          <h2>
            <FaFileContract /> Changes to These Terms
          </h2>

          <p>
            We may update these Terms of Service from time to time.
            Continued use of Boi Para after changes become effective
            constitutes acceptance of the revised terms.
          </p>
        </div>

        {/* Contact */}
        <div className="service-card">
          <h2>
            <FaEnvelope /> Contact Us
          </h2>

          <p>
            If you have any questions regarding these Terms of Service,
            please contact us through our Contact Us page.
          </p>
        </div>

        {/* Footer */}
        <div className="service-footer">
          <p>
            Thank you for using <strong>Boi Para</strong> responsibly.
          </p>

          <span>Last Updated: June 2026</span>
        </div>

      </div>
    </div>
  );
}

export default TermsOfService;