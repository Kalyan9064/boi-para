require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const passport = require("./config/passport");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/book");
const bookRequestRoutes = require("./routes/bookRequest");

const app = express();

/*SECURE CORS CONFIG*/

const allowedOrigins = [
  "http://localhost:5173",        // local frontend
  "https://boi-para.vercel.app"   // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

/* =========================
   MIDDLEWARE
   ========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

/* =========================
   ROUTES
   ========================= */

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/requests", bookRequestRoutes);

/* =========================
   STATIC FILES
   ========================= */

app.use("/uploads", express.static("uploads"));

/* =========================
   DATABASE
   ========================= */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("MongoDB error:", err.message));

/* =========================
   TEST ROUTE
   ========================= */

app.get("/", (req, res) => {
  res.send("BoiPara API running 🚀");
});

/* =========================
   SERVER START
   ========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});