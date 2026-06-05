const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  console.error("Error encountered:", err.message || err);
  if (err.stack) {
    console.error(err.stack);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || null;

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your token has expired. Please log in again.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

module.exports = errorHandler;
