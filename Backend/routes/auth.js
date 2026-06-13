const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authMiddleware");
const multer = require("multer");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/sendEmail");

// Centralized Validation & Error Helpers
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../utils/validators/authValidator");

const router = express.Router();


// ==============================
// 📦 MULTER CONFIG (IMAGE UPLOAD)
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
// 🧾 REGISTER
// ==============================
router.post("/register", validate(registerSchema), asyncHandler(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists, please login", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    phone,
    verificationToken
  });

  await newUser.save();

  await sendVerificationEmail(email, verificationToken);

  res.status(201).json({
    message: "Registered successfully. Please verify your email."
  });
}));


// ==============================
// 📧 VERIFY EMAIL
// ==============================
router.get("/verify-email/:token", asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    verificationToken: req.params.token
  });

  if (!user) {
    throw new AppError("Invalid verification token", 400);
  }

  user.isVerified = true;
  user.verificationToken = null;

  await user.save();

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Email verified successfully",
    token
  });
}));


// ==============================
// 🔐 LOGIN
// ==============================
router.post("/login", validate(loginSchema), asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 400);
  }

  if (!user.isVerified) {
    throw new AppError("Please verify your email before login", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 400);
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({
    message: "Login successful",
    token
  });
}));


// ==============================
// 👤 GET PROFILE
// ==============================
router.get("/profile", verifyToken, asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.json(user);
}));


// ==============================
// 🖼️ UPLOAD PROFILE IMAGE
// ==============================
router.post(
  "/upload-profile",
  verifyToken,
  upload.single("image"),
  asyncHandler(async (req, res, next) => {
    if (!req.file) {
      throw new AppError("Please upload an image file", 400);
    }

    const user = await User.findById(req.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.profileImage = req.file.filename;

    await user.save();

    res.json({
      message: "Profile image updated",
      image: user.profileImage
    });
  })
);


// ==============================
// ❤️ ADD TO WISHLIST
// ==============================
router.post("/wishlist/:bookId", verifyToken, asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.savedBooks.includes(req.params.bookId)) {
    user.savedBooks.push(req.params.bookId);
    await user.save();
  }

  res.json({ message: "Added to wishlist" });
}));


// ==============================
// 💔 REMOVE FROM WISHLIST
// ==============================
router.delete("/wishlist/:bookId", verifyToken, asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.savedBooks = user.savedBooks.filter(
    id => id.toString() !== req.params.bookId
  );

  await user.save();

  res.json({ message: "Removed from wishlist" });
}));


// ==============================
// 📄 GET WISHLIST
// ==============================
router.get("/wishlist", verifyToken, asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId).populate("savedBooks");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.json(user.savedBooks);
}));


module.exports = router;