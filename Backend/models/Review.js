const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review text is required"],
    trim: true,
    maxLength: [500, "Review cannot exceed 500 characters"]
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: 1,
    max: 5
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Review must target a seller"]
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Review must have a reviewer"]
  }
}, { timestamps: true });

// Prevent duplicate reviews: reviewer can only review a seller once
reviewSchema.index({ seller: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
