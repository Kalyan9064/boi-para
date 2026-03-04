const mongoose = require("mongoose");

//Define the user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);