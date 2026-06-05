const AppError = require("../utils/AppError");

const validate = (schema) => {
  return async (req, res, next) => {
    const errors = {};
    const locations = ["body", "params", "query"];

    locations.forEach((loc) => {
      if (schema[loc]) {
        const fields = schema[loc];
        for (const [field, rules] of Object.entries(fields)) {
          let value = req[loc][field];

          // 1. Required Check
          if (rules.required && (value === undefined || value === null || value === "")) {
            errors[field] = `${field} is required`;
            continue;
          }

          if (value !== undefined && value !== null && value !== "") {
            // Trim string values if applicable
            if (typeof value === "string") {
              value = value.trim();
              req[loc][field] = value; // Update trimmed value back to request object
            }

            // 2. Type Check
            if (rules.type === "email") {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value)) {
                errors[field] = `${field} must be a valid email address`;
              }
            } else if (rules.type === "number") {
              const num = Number(value);
              if (isNaN(num)) {
                errors[field] = `${field} must be a number`;
              } else {
                req[loc][field] = num; // Update parsed number back to request object
              }
            } else if (rules.type === "string") {
              if (typeof value !== "string") {
                errors[field] = `${field} must be a string`;
              }
            }

            // 3. Min/Max Length/Value Checks
            if (rules.minLength && typeof value === "string" && value.length < rules.minLength) {
              errors[field] = `${field} must be at least ${rules.minLength} characters`;
            }
            if (rules.maxLength && typeof value === "string" && value.length > rules.maxLength) {
              errors[field] = `${field} must be at most ${rules.maxLength} characters`;
            }
            if (rules.min !== undefined && typeof req[loc][field] === "number" && req[loc][field] < rules.min) {
              errors[field] = `${field} must be at least ${rules.min}`;
            }
            if (rules.max !== undefined && typeof req[loc][field] === "number" && req[loc][field] > rules.max) {
              errors[field] = `${field} must be at most ${rules.max}`;
            }

            // 4. Enum validation
            if (rules.enum && !rules.enum.includes(value)) {
              errors[field] = `${field} must be one of: ${rules.enum.join(", ")}`;
            }

            // 5. Custom Regex
            if (rules.regex && !rules.regex.test(value)) {
              errors[field] = rules.message || `${field} format is invalid`;
            }
          }
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      // Automatic Cloudinary file cleanup on validation failure to prevent leaks
      if (req.files || req.file) {
        try {
          const { cloudinary } = require("../config/cloudinary");
          const filesToClean = req.files ? req.files : [req.file];
          for (const file of filesToClean) {
            if (file && (file.filename || file.path)) {
              const publicId = file.filename || `boipara-books/${file.path.split("/").pop().split(".")[0]}`;
              await cloudinary.uploader.destroy(publicId);
            }
          }
        } catch (cleanupErr) {
          console.error("Cloudinary cleanup error:", cleanupErr.message);
        }
      }
      return next(new AppError("Validation failed", 400, errors));
    }

    next();
  };
};

module.exports = validate;
