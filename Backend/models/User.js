const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true
  },

  phone: {
    type: String
  },

  password: String,

  profileImage: {
    type: String,
    default: ""
  },

  role: {
    type: String,
    default: "user"
  },

  // ✅ Email verification
  isVerified: {
    type: Boolean,
    default: false
  },

  verificationToken: {
    type: String,
    default: null
  },

  // ❤️ Wishlist (FIXED)
  savedBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book"
    }
  ],

  // ⭐ Reputation System
  ratingsAverage: {
    type: Number,
    default: 0
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);