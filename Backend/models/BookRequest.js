const mongoose = require("mongoose");

const bookrequestSchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  author: { type: String, required: true },
  location: { type: String, required: true },
  message: String,

  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

}, { timestamps: true });

module.exports = mongoose.model("BookRequest", bookrequestSchema);