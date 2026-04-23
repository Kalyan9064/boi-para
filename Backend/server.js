const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ✅ ENV DEBUG - Check if Render is injecting env vars correctly
console.log("🔍 ENV CHECK ON STARTUP:");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("PORT:", process.env.PORT);

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/book");

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// Serve images
app.use("/uploads", express.static("uploads"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("MongoDB error:", err.message));

// Test route
app.get("/", (req, res) => {
  res.send("Old Book API running");
});

// Dynamic port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});