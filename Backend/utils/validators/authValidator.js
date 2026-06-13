const registerSchema = {
  body: {
    name: {
      required: true,
      type: "string",
      minLength: 2,
      maxLength: 50
    },
    email: {
      required: true,
      type: "email"
    },
    password: {
      required: true,
      type: "string",
      minLength: 6,
      maxLength: 128
    },
    phone: {
      required: true,
      type: "string",
      regex: /^\+?[1-9]\d{1,14}$/,
      message: "phone must be a valid phone number in E.164 format (e.g. +1234567890 or 1234567890)"
    }
  }
};

const loginSchema = {
  body: {
    email: {
      required: true,
      type: "email"
    },
    password: {
      required: true,
      type: "string"
    }
  }
};

module.exports = {
  registerSchema,
  loginSchema
};
