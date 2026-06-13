const reviewSchema = {
  body: {
    seller: {
      required: true,
      type: "string",
      regex: /^[0-9a-fA-F]{24}$/,
      message: "seller must be a valid MongoDB ObjectId"
    },
    rating: {
      required: true,
      type: "number",
      min: 1,
      max: 5
    },
    review: {
      required: true,
      type: "string",
      minLength: 3,
      maxLength: 500
    }
  }
};

const updateReviewSchema = {
  body: {
    rating: {
      required: true,
      type: "number",
      min: 1,
      max: 5
    },
    review: {
      required: true,
      type: "string",
      minLength: 3,
      maxLength: 500
    }
  }
};

module.exports = {
  reviewSchema,
  updateReviewSchema
};
