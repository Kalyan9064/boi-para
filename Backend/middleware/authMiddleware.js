const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const verifyToken = (req, res, next) => {
  // 1️⃣ Get Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError("No token provided", 401));
  }

  // 2️⃣ Extract token (remove "Bearer ")
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return next(new AppError("Invalid token format", 401));
  }
  const token = parts[1];

  try {
    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attach user ID to request
    req.userId = decoded.id;

    // 5️⃣ Continue to next function
    next();

  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
};

module.exports = verifyToken;