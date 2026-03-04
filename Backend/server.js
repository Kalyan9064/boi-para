const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth"); // import routes

const app = express();   // ✅ create app FIRST

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("Old Book API running");
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});