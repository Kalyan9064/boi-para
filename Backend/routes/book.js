const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const verifyToken = require("../middleware/authMiddleware");
const { cloudinary, upload } = require("../config/cloudinary"); // ✅ NEW

const calculateDistance = require("../utils/calculateDistance");
const User = require("../models/User");

// ==============================
// ➕ ADD BOOK
// ==============================
router.post("/", verifyToken, upload.array("images", 5), async (req, res) => {
  try {
    const seller = await User.findById(req.userId);

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found"
      });
    }
    const { title, author, price, category, condition, description, } = req.body;

    const newBook = new Book({
      title,
      author,
      price,
      category,
      condition,
      description,
      location: seller.location,
      images: req.files ? req.files.map(f => f.secure_url) : [],
      seller: req.userId,
      isSold: false
    });

    await newBook.save();
    res.status(201).json({ message: "Book added successfully", book: newBook });

  } catch (error) {
    console.log("REAL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

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
// 🔍 GLOBAL SEARCH
// ==============================
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

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
    const books = await Book.find({ seller: req.params.sellerId, isSold: false })
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

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.seller.toString() !== req.userId) return res.status(403).json({ message: "Not authorized" });

    const { title, author, price, category, condition, description, location } = req.body;

    book.title = title;
    book.author = author;
    book.price = price;
    book.category = category;
    book.condition = condition;
    book.description = description;
    book.location = location;

    await book.save();
    res.json({ message: "Book updated successfully", book });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ==============================
// 📍 GET NEARBY BOOKS
// ==============================
router.get("/nearby", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || !user.location) {
      return res.status(404).json({
        message: "User location not found"
      });
    }

    const books = await Book.find({
      isSold: false
    }).populate("seller", "name email phone");

    const booksWithDistance = books.map(book => {

      if (
        !book.location ||
        typeof book.location !== "object" ||
        book.location.latitude == null ||
        book.location.longitude == null
      ) {
        return null;
      }

      const distance = calculateDistance(
        user.location.latitude,
        user.location.longitude,

        book.location.latitude,
        book.location.longitude
      );

      return {
        ...book.toObject(),
        distance
      };
    });

    const filteredBooks = booksWithDistance
      .filter(book => book !== null)
      .sort((a, b) => a.distance - b.distance);

    res.json(filteredBooks);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});


// ==============================
// 📖 GET SINGLE BOOK
// ==============================
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("seller", "name email phone");

    if (!book) return res.status(404).json({ message: "Book not found" });
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

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.seller.toString() !== req.userId) return res.status(403).json({ message: "Not authorized" });

    // ✅ Delete ALL images from Cloudinary
    if (book.images && book.images.length > 0) {
      for (const imageUrl of book.images) {
        try {
          const urlParts = imageUrl.split("/");
          const filename = urlParts[urlParts.length - 1].split(".")[0];
          const publicId = `boipara-books/${filename}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudErr) {
          console.log("Cloudinary delete error:", cloudErr.message);
        }
      }
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

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.seller.toString() !== req.userId) return res.status(403).json({ message: "Not authorized" });

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
    const books = await Book.find({
      location: { $regex: req.params.city, $options: "i" },
      isSold: false
    }).populate("seller", "name email phone");
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;