const cloudinary = require("cloudinary");
const CloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

// Load environment variables
require("dotenv").config();

// Connect to Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "boipara-books",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 800, height: 600, crop: "limit" }
    ],
  },
});

// Multer upload
const upload = multer({ storage });

module.exports = { cloudinary, upload };