const express = require("express");
const mongoose = require("mongoose");
const Review = require("../models/Review");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

// Validation & Error Helpers
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const validate = require("../middleware/validate");
const { reviewSchema, updateReviewSchema } = require("../utils/validators/reviewValidator");

const router = express.Router();

// Helper function to calculate average ratings and update User profile
const calcAverageRatings = async (sellerId) => {
  const stats = await Review.aggregate([
    { $match: { seller: new mongoose.Types.ObjectId(sellerId) } },
    {
      $group: {
        _id: "$seller",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" }
      }
    }
  ]);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(sellerId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: Math.round(stats[0].avgRating * 10) / 10
    });
  } else {
    await User.findByIdAndUpdate(sellerId, {
      ratingsQuantity: 0,
      ratingsAverage: 0
    });
  }
};


// ==============================
// ➕ CREATE REVIEW (BUYER -> SELLER)
// ==============================
router.post("/", verifyToken, validate(reviewSchema), asyncHandler(async (req, res, next) => {
  const { seller, rating, review } = req.body;
  const reviewer = req.userId;

  // 1. Prevent self-reviewing
  if (seller === reviewer) {
    throw new AppError("You cannot submit a review for yourself", 400);
  }

  // 2. Check if seller user exists
  const targetSeller = await User.findById(seller);
  if (!targetSeller) {
    throw new AppError("Seller not found", 404);
  }

  // 3. Prevent duplicate reviews (one review per seller from a buyer)
  const existingReview = await Review.findOne({ seller, reviewer });
  if (existingReview) {
    throw new AppError("You have already reviewed this seller. You can update your existing review instead.", 400);
  }

  // 4. Create review
  const newReview = new Review({
    review,
    rating,
    seller,
    reviewer
  });

  await newReview.save();

  // 5. Recalculate average ratings
  await calcAverageRatings(seller);

  // Return full review populated with reviewer's name
  const populatedReview = await Review.findById(newReview._id)
    .populate("reviewer", "name profileImage");

  res.status(201).json({
    message: "Review submitted successfully",
    review: populatedReview
  });
}));


// ==============================
// ✏️ UPDATE REVIEW
// ==============================
router.put("/:id", verifyToken, validate(updateReviewSchema), asyncHandler(async (req, res, next) => {
  const { rating, review } = req.body;
  const reviewId = req.params.id;
  const reviewer = req.userId;

  const targetReview = await Review.findById(reviewId);
  if (!targetReview) {
    throw new AppError("Review not found", 404);
  }

  // Authorization check: only reviewer can edit their own review
  if (targetReview.reviewer.toString() !== reviewer) {
    throw new AppError("You are not authorized to edit this review", 403);
  }

  targetReview.rating = rating;
  targetReview.review = review;

  await targetReview.save();

  // Recalculate average ratings
  await calcAverageRatings(targetReview.seller);

  const populatedReview = await Review.findById(targetReview._id)
    .populate("reviewer", "name profileImage");

  res.json({
    message: "Review updated successfully",
    review: populatedReview
  });
}));


// ==============================
// 🗑 DELETE REVIEW
// ==============================
router.delete("/:id", verifyToken, asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;
  const reviewer = req.userId;

  const targetReview = await Review.findById(reviewId);
  if (!targetReview) {
    throw new AppError("Review not found", 404);
  }

  // Authorization check: only reviewer can delete their own review
  if (targetReview.reviewer.toString() !== reviewer) {
    throw new AppError("You are not authorized to delete this review", 403);
  }

  const sellerId = targetReview.seller;

  await targetReview.deleteOne();

  // Recalculate average ratings
  await calcAverageRatings(sellerId);

  res.json({
    message: "Review deleted successfully"
  });
}));


// ==============================
// 📖 GET REVIEWS BY SELLER ID
// ==============================
router.get("/seller/:sellerId", asyncHandler(async (req, res, next) => {
  const sellerId = req.params.sellerId;

  const reviews = await Review.find({ seller: sellerId })
    .populate("reviewer", "name profileImage")
    .sort({ createdAt: -1 });

  res.json(reviews);
}));

module.exports = router;
