const express = require("express");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const verifyToken = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const validate = require("../middleware/validate");
const { messageSchema } = require("../utils/validators/chatValidator");

const router = express.Router();

// ==============================
// ✉️ SEND A MESSAGE
// ==============================
router.post("/", verifyToken, validate(messageSchema), asyncHandler(async (req, res) => {
  const { conversationId, text } = req.body;
  const senderId = req.userId;

  // Verify conversation exists
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  // Verify sender is participant
  if (!conversation.participants.includes(senderId)) {
    throw new AppError("You are not authorized to send messages to this conversation", 403);
  }

  // Create message
  const message = new Message({
    conversation: conversationId,
    sender: senderId,
    text
  });

  await message.save();

  // Update conversation's lastMessage and increment unread counts for other participants
  conversation.lastMessage = message._id;
  conversation.participants.forEach(participantId => {
    const pStr = participantId.toString();
    if (pStr !== senderId.toString()) {
      const currentVal = conversation.unreadCounts.get(pStr) || 0;
      conversation.unreadCounts.set(pStr, currentVal + 1);
    }
  });

  await conversation.save();

  // Populate sender info for the response and socket broadcast
  const populatedMessage = await Message.findById(message._id)
    .populate("sender", "name profileImage");

  // Broadcast via Socket.IO
  const io = req.app.get("io");
  if (io) {
    conversation.participants.forEach(participantId => {
      const pStr = participantId.toString();
      // Emit to each participant's room (including the sender to sync across multiple tabs/devices)
      io.to(pStr).emit("newMessage", populatedMessage);
    });
  }

  res.status(201).json(populatedMessage);
}));

// ==============================
// 📖 GET MESSAGES IN CONVERSATION
// ==============================
router.get("/:conversationId", verifyToken, asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.userId;

  // Verify conversation exists
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  // Verify user is participant
  if (!conversation.participants.includes(userId)) {
    throw new AppError("You are not authorized to view this conversation's messages", 403);
  }

  // Fetch messages
  const messages = await Message.find({ conversation: conversationId })
    .populate("sender", "name profileImage")
    .sort({ createdAt: 1 });

  res.status(200).json(messages);
}));

module.exports = router;
