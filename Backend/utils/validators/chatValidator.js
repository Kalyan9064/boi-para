const conversationSchema = {
  body: {
    sellerId: {
      required: true,
      type: "string",
      regex: /^[0-9a-fA-F]{24}$/,
      message: "sellerId must be a valid MongoDB ObjectId"
    }
  }
};

const messageSchema = {
  body: {
    conversationId: {
      required: true,
      type: "string",
      regex: /^[0-9a-fA-F]{24}$/,
      message: "conversationId must be a valid MongoDB ObjectId"
    },
    text: {
      required: true,
      type: "string",
      minLength: 1,
      maxLength: 2000
    }
  }
};

module.exports = {
  conversationSchema,
  messageSchema
};
