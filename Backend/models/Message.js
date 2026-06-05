const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    required: [true, "Message content cannot be empty"],
    trim: true,
    maxLength: [2000, "Message cannot exceed 2000 characters"]
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Indexes for query optimization
messageSchema.index({ conversation: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
