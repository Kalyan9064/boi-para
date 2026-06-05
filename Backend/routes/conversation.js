const express = require("express");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const validate = require("../middleware/validate");
const { conversationSchema } = require("../utils/validators/chatValidator");

const router = express.Router();

// ==============================
// 💬 GET OR CREATE CONVERSATION
// ==============================
router.post("/", verifyToken, validate(conversationSchema), asyncHandler(async (req, res) => {
  const { sellerId } = req.body;
  const buyerId = req.userId;

  if (sellerId === buyerId) {
    throw new AppError("You cannot start a conversation with yourself", 400);
  }

  // Check if seller exists
  const seller = await User.findById(sellerId);
  if (!seller) {
    throw new AppError("Seller not found", 404);
  }

  // Find existing conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [buyerId, sellerId], $size: 2 }
  });

  if (!conversation) {
    conversation = new Conversation({
      participants: [buyerId, sellerId],
      unreadCounts: {
        [buyerId]: 0,
        [sellerId]: 0
      }
    });
    await conversation.save();
  }

  // Populate participants and lastMessage
  const populated = await Conversation.findById(conversation._id)
    .populate("participants", "name email profileImage")
    .populate("lastMessage");

  res.status(200).json(populated);
}));

// ==============================
// 📋 LIST CONVERSATIONS FOR USER
// ==============================
router.get("/", verifyToken, asyncHandler(async (req, res) => {
  const userId = req.userId;

  // Find all conversations where user is a participant
  const conversations = await Conversation.find({
    participants: userId
  })
    .populate("participants", "name email profileImage")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "name" }
    })
    .sort({ updatedAt: -1 });

  res.status(200).json(conversations);
}));

// ==============================
// 🔕 MARK CONVERSATION AS READ
// ==============================
router.put("/:id/read", verifyToken, asyncHandler(async (req, res) => {
  const conversationId = req.params.id;
  const userId = req.userId;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  // Verify participant
  if (!conversation.participants.includes(userId)) {
    throw new AppError("You are not authorized to access this conversation", 403);
  }

  // Reset unread count for current user
  conversation.unreadCounts.set(userId.toString(), 0);
  await conversation.save();

  // Mark all messages from other participant as read
  await Message.updateMany(
    { conversation: conversationId, sender: { $ne: userId }, isRead: false },
    { $set: { isRead: true } }
  );

  res.status(200).json({ message: "Conversation marked as read" });
}));

module.exports = router;
