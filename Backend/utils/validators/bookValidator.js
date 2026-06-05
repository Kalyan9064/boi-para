const bookSchema = {
  body: {
    title: {
      required: true,
      type: "string",
      minLength: 1,
      maxLength: 150
    },
    author: {
      required: true,
      type: "string",
      minLength: 1,
      maxLength: 100
    },
    price: {
      required: true,
      type: "number",
      min: 0
    },
    category: {
      required: true,
      type: "string",
      minLength: 1,
      maxLength: 50
    },
    condition: {
      required: true,
      type: "string",
      enum: ["Like New", "Very Good", "Good", "Fair"]
    },
    description: {
      required: false,
      type: "string",
      maxLength: 1000
    },
    location: {
      required: true,
      type: "string",
      minLength: 1,
      maxLength: 100
    }
  }
};

module.exports = {
  bookSchema
};
