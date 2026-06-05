import React from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToHash from "./components/ScrollToHash";
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
import Chat from "./pages/Chat";
import Footer from "./components/Footer";


function App() {
  return (
    <>
    <Navbar />
    
     <ScrollToHash />

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
        <Route path="/chat" element={<Chat />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;