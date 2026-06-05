const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  },
  unreadCounts: {
    type: Map,
    of: Number,
    default: {}
  }
}, { timestamps: true });

// Index for query optimization
conversationSchema.index({ participants: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);
