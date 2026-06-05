const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: Number,
  category: String,
  condition: String,
  description: String,
  location: String,
  images: [String],

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  isSold: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

bookSchema.index({ isSold: 1, createdAt: -1 });
bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ category: 1 });
bookSchema.index({ condition: 1 });
bookSchema.index({ price: 1 });

module.exports = mongoose.model("Book", bookSchema);