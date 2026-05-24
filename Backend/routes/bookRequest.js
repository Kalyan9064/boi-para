const express = require("express");
const router = express.Router();
const BookRequest = require("../models/BookRequest");
const verifyToken = require("../middleware/authMiddleware");


router.post("/", verifyToken, async (req, res) => {
  try {
    const { bookName, author, message, location  } = req.body;

    const requestBook = new BookRequest({
      bookName,
      author,
      message,
      location,
      requestedBy: req.userId,
    });

    await requestBook.save();
    res.status(201).json({ message: "Book requested successfully", RequestedBook: requestBook });

  } catch (error) {
    console.log("REAL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const requests = await BookRequest.find({})
      .populate("requestedBy", "name phone")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;