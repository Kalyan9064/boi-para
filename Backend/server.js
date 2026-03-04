const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth"); // import routes
const bookRoutes = require("./routes/book");

const app = express();   // ✅ create app FIRST

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/uploads", express.static("uploads"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected ✅"))
.catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("Old Book API running");
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});