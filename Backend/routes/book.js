const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const verifyToken = require("../middleware/authMiddleware");
const { cloudinary, upload } = require("../config/cloudinary");

// Centralized Validation & Error Helpers
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const validate = require("../middleware/validate");
const { bookSchema } = require("../utils/validators/bookValidator");

// Regex escaping helper to prevent ReDoS
const escapeRegex = (string) => {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};


// ==============================
// ➕ ADD BOOK
// ==============================
router.post("/", verifyToken, upload.array("images", 5), validate(bookSchema), asyncHandler(async (req, res, next) => {
  const { title, author, price, category, condition, description, location } = req.body;

  const newBook = new Book({
    title,
    author,
    price,
    category,
    condition,
    description,
    location,
    images: req.files ? req.files.map(f => f.path) : [],
    seller: req.userId,
    isSold: false
  });

  try {
    await newBook.save();
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (saveError) {
    // Clean up uploaded files since DB save failed
    if (req.files) {
      try {
        for (const file of req.files) {
          const publicId = file.filename || `boipara-books/${file.path.split("/").pop().split(".")[0]}`;
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cleanupErr) {
        console.error("Cloudinary cleanup error during save failure:", cleanupErr.message);
      }
    }
    throw saveError;
  }
}));


// ==============================
// 📚 GET ALL BOOKS
// ==============================
router.get("/", asyncHandler(async (req, res, next) => {
  const books = await Book.find({ isSold: false })
    .populate("seller", "name email phone")
    .sort({ createdAt: -1 });
  res.json(books);
}));


// ==============================
// 🔍 GLOBAL SEARCH
// ==============================
router.get("/search", asyncHandler(async (req, res, next) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  const escapedQ = escapeRegex(q);

  const books = await Book.find({
    isSold: false,
    $or: [
      { title: { $regex: escapedQ, $options: "i" } },
      { author: { $regex: escapedQ, $options: "i" } },
      { category: { $regex: escapedQ, $options: "i" } },
      { location: { $regex: escapedQ, $options: "i" } }
    ]
  }).populate("seller", "name email phone");

  res.json(books);
}));


// ==============================
// 👤 GET MY BOOKS
// ==============================
router.get("/my-books", verifyToken, asyncHandler(async (req, res, next) => {
  const books = await Book.find({ seller: req.userId })
    .populate("seller", "name email phone");
  res.json(books);
}));


// ==============================
// 👤 GET BOOKS BY SELLER
// ==============================
router.get("/seller/:sellerId", asyncHandler(async (req, res, next) => {
  const books = await Book.find({ seller: req.params.sellerId, isSold: false })
    .populate("seller", "name email phone")
    .sort({ createdAt: -1 });
  res.json(books);
}));


// ==============================
// ✏️ UPDATE BOOK
// ==============================
router.put("/:id", verifyToken, validate(bookSchema), asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new AppError("Book not found", 404);
  }
  if (book.seller.toString() !== req.userId) {
    throw new AppError("Not authorized", 403);
  }

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
}));


// ==============================
// 📖 GET SINGLE BOOK
// ==============================
router.get("/:id", asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id)
    .populate("seller", "name email phone");

  if (!book) {
    throw new AppError("Book not found", 404);
  }
  res.json(book);
}));


// ==============================
// 🗑 DELETE BOOK
// ==============================
router.delete("/:id", verifyToken, asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new AppError("Book not found", 404);
  }
  if (book.seller.toString() !== req.userId) {
    throw new AppError("Not authorized", 403);
  }

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
}));


// ==============================
// 🟢 MARK AS SOLD
// ==============================
router.put("/:id/sold", verifyToken, asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new AppError("Book not found", 404);
  }
  if (book.seller.toString() !== req.userId) {
    throw new AppError("Not authorized", 403);
  }

  book.isSold = true;
  await book.save();
  res.json({ message: "Book marked as sold" });
}));


// ==============================
// 📍 GET BOOKS BY LOCATION
// ==============================
router.get("/location/:city", asyncHandler(async (req, res, next) => {
  const escapedCity = escapeRegex(req.params.city);
  const books = await Book.find({
    location: { $regex: escapedCity, $options: "i" },
    isSold: false
  }).populate("seller", "name email phone");
  res.json(books);
}));


module.exports = router;