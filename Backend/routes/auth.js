const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authMiddleware");
const multer = require("multer");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/sendEmail");

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
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
       message: "User already exists, please login"

      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      verificationToken
    });

    await newUser.save();

    await sendVerificationEmail(
      email,
      verificationToken
    );

    res.status(201).json({
      message:
        "Registered successfully. Please verify your email."
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});


// ==============================
// 📧 VERIFY EMAIL
// ==============================
router.get("/verify-email/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token
    });

    if (!user) {
      return res.status(400).send("Invalid verification token");
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

  } catch (error) {
    res.status(500).send("Server error");
  }
});


// ==============================
// 🔐 LOGIN
// ==============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message:
          "Please verify your email before login"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
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

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});


// ==============================
// 👤 GET PROFILE
// ==============================
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});


// ==============================
// 🖼️ UPLOAD PROFILE IMAGE
// ==============================
router.post(
  "/upload-profile",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      user.profileImage = req.file.filename;

      await user.save();

      res.json({
        message: "Profile image updated",
        image: user.profileImage
      });

    } catch (error) {
      res.status(500).json({
        message: "Server error"
      });
    }
  }
);


// ==============================
// ❤️ ADD TO WISHLIST
// ==============================
router.post("/wishlist/:bookId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user.savedBooks.includes(req.params.bookId)) {
      user.savedBooks.push(req.params.bookId);
      await user.save();
    }

    res.json({ message: "Added to wishlist" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ==============================
// 💔 REMOVE FROM WISHLIST
// ==============================
router.delete("/wishlist/:bookId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    user.savedBooks = user.savedBooks.filter(
      id => id.toString() !== req.params.bookId
    );

    await user.save();

    res.json({ message: "Removed from wishlist" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ==============================
// 📄 GET WISHLIST
// ==============================
router.get("/wishlist", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("savedBooks");

    res.json(user.savedBooks);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==============================
// 🔑 GOOGLE OAUTH
// ==============================

const passport = require("../config/passport");

// Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google redirects back here
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  (req, res) => {
    const token = require("jsonwebtoken").sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.redirect(
      `${process.env.CLIENT_URL}/auth/google/success?token=${token}`
    );
  }
);


module.exports = router;

