const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: Number,
  category: String,
  condition: String,
  description: String,
  location: String,
  image: String,

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  isSold: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);