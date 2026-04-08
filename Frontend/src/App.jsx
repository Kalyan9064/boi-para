import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import BookDetails from "./pages/BookDetails";
import SellBook from "./pages/SellBook";
import MyBooks from "./pages/MyBooks";
import Browse from "./pages/Browse";
import Register from "./pages/Register";
import Account from "./pages/Account";
import EditBook from "./pages/EditBook";

function App() {
  return (
    <>
    <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sell-book" element={<SellBook />} />
        <Route path="/my-books" element={<MyBooks />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/account" element={<Account />} />
        <Route path="/edit-book/:id" element={<EditBook />} />
      </Routes>
    </>
  );
}

export default App;