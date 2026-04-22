const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const verifyToken = require("../middleware/authMiddleware");
const multer = require("multer");

// ==============================
// 📦 MULTER CONFIG
// ==============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ==============================
// ➕ ADD BOOK
// ==============================
router.post(
  "/",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        author,
        price,
        category,
        condition,
        description,
        location
      } = req.body;

      const newBook = new Book({
        title,
        author,
        price,
        category,
        condition,
        description,
        location,
        image: req.file ? req.file.filename : null,
        seller: req.userId,
        isSold: false
      });

      await newBook.save();

      res.status(201).json({
        message: "Book added successfully",
        book: newBook
      });

    } catch (error) {
      console.log("REAL ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// ==============================
// 📚 GET ALL BOOKS
// ==============================
router.get("/", async (req, res) => {
  try {
    const books = await Book.find({ isSold: false })
      .populate("seller", "name email phone")
      .sort({ createdAt: -1 });

    res.json(books);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==============================
// 🔍 GLOBAL SEARCH (IMPORTANT)
// ==============================
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const books = await Book.find({
      isSold: false,
      $or: [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } }
      ]
    }).populate("seller", "name email phone");

    res.json(books);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==============================
// 👤 GET MY BOOKS
// ==============================
router.get("/my-books", verifyToken, async (req, res) => {
  try {
    const books = await Book.find({ seller: req.userId })
      .populate("seller", "name email phone");

    res.json(books);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==============================
// 👤 GET BOOKS BY SELLER
// ==============================
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const books = await Book.find({
      seller: req.params.sellerId,
      isSold: false
    })
      .populate("seller", "name email phone")
      .sort({ createdAt: -1 });

    res.json(books);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==============================
// ✏️ UPDATE BOOK
// ==============================
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.seller.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const {
      title,
      author,
      price,
      category,
      condition,
      description,
      location
    } = req.body;

    book.title = title;
    book.author = author;
    book.price = price;
    book.category = category;
    book.condition = condition;
    book.description = description;
    book.location = location;

    await book.save();

    res.json({
      message: "Book updated successfully",
      book
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==============================
// 📖 GET SINGLE BOOK
// ==============================
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("seller", "name email phone");

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==============================
// 🗑 DELETE BOOK
// ==============================
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

// ==============================
// 🟢 MARK AS SOLD
// ==============================
router.put("/:id/sold", verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.seller.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    book.isSold = true;
    await book.save();

    res.json({ message: "Book marked as sold" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==============================
// 📍 GET BOOKS BY LOCATION
// ==============================
router.get("/location/:city", async (req, res) => {
  try {
    const city = req.params.city;

    const books = await Book.find({
      location: { $regex: city, $options: "i" },
      isSold: false
    }).populate("seller", "name email phone");

    res.json(books);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;