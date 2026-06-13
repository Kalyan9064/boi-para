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


//For all requests

router.get("/all-requests", async (req, res) => {
  try {
    const requests = await BookRequest.find({})
      .populate("requestedBy", "name phone")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET MY REQUESTS

router.get("/my-requests", verifyToken, async (req, res) => {
  try {
    const requests = await BookRequest.find({ requestedBy: req.userId })
      .populate("requestedBy", "name phone")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// DELETE REQUEST

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const request = await BookRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.requestedBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this request" });
    }

    await request.deleteOne();
    res.json({ message: "Request deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;