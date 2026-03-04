const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed",
    userId: req.userId
  });
});

module.exports = router;


router.post("/login", async (req, res) => {
  try {
    // 1️⃣ Get data from frontend
    const { email, password } = req.body;

    // 2️⃣ Check if user exists in database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 3️⃣ Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user._id },            // payload
      process.env.JWT_SECRET,      // secret key
      { expiresIn: "1d" }          // token expiry
    );

    // 5️⃣ Send response back to frontend
    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});