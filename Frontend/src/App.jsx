import React from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Search from "./pages/Search";
import BookDetails from "./pages/BookDetails";
import SellBook from "./pages/SellBook";
import MyBooks from "./pages/MyBooks";
import Browse from "./pages/Browse";
import Register from "./pages/Register";
import Account from "./pages/Account";
import EditBook from "./pages/EditBook";
import Wishlist from "./pages/Wishlist";
import Footer from "./components/Footer";
import AllRequests from "./pages/AllRequests";
import SafetyGuidelines from "./pages/SafetyGuidelines";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";


function App() {
  return (
    <>
    <Navbar />
    
     <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/sell-book" element={<SellBook />} />
        <Route path="/my-books" element={<MyBooks />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/account" element={<Account />} />
        <Route path="/edit-book/:id" element={<EditBook />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/book-requests" element={<AllRequests />} />
        <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;