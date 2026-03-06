const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const verifyToken = require("../middleware/authMiddleware");
const multer = require("multer"); //import multer for handling file uploads

//Book image uploading

// configure how images will be stored
const storage = multer.diskStorage({

  // folder where images will be saved
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  // generate unique filename
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }

});

// create upload instance
const upload = multer({ storage });

//add book ------------------------------------------------------------

router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {

    //  console.log(req.body); 
    //  console.log(req.file);

    const { title, author, price, category, condition, description, location } = req.body;

      const newBook = new Book({
          title,
          author,
          price,
          category,
          condition,
          description,
          location,

          image: req.file ? req.file.filename : null, // safe check

          seller: req.userId
      });

    await newBook.save();

    res.status(201).json({
      message: "Book added successfully",
      book: newBook
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});

//all books -------------------------------------------------------------

router.get("/", async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const books = await Book.find({ isSold: false })
      .populate("seller", "name email")
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(books);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//search book ---------------------------------------------------------------------------

router.get("/search", async (req, res) => {
  try {

    const { q } = req.query;

    const books = await Book.find({
      title: { $regex: q, $options: "i" },
      isSold: false
    }).populate("seller", "name email");

    res.json(books);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ===== GET MY BOOKS (SELLER DASHBOARD) =====

router.get("/my-books", verifyToken, async (req, res) => {
  try {

    // find books where seller is the logged-in user
    const books = await Book.find({ seller: req.userId })
      .populate("seller", "name email");

    res.json(books);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//single book -------------------------------------------------------------------

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
        .populate("seller", "name email");

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//delete book ------------------------------------------------------------------

router.delete("/:id", verifyToken, async (req, res) => {
  try {

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.seller.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===== GET BOOKS BY LOCATION =====

router.get("/location/:city", async (req, res) => {
  try {

    // get city from URL
    const city = req.params.city;

    // search books where location matches city
    const books = await Book.find({
      location: { $regex: city, $options: "i" }, // case-insensitive search
      isSold: false
    })
    .populate("seller", "name email");

    res.json(books);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;