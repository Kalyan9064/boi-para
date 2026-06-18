const axios = require("axios");

const sendVerificationEmail = async (email, token) => {
  try {
    const verificationLink =
      `${process.env.CLIENT_URL}/verify-email/${token}`;

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Boi Para",
          email: process.env.EMAIL_USER,
        },
        to: [{ email }],
        subject: "Verify Your Email",
        htmlContent: `
          <h2>Email Verification</h2>
          <p>Click below to verify your account:</p>
          <a href="${verificationLink}">Verify Email</a>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent:", response.data);
  } catch (error) {
  console.log("❌ EMAIL ERROR");

  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Data:", error.response.data);
  } else {
    console.log(error.message);
  }
}
};

module.exports = sendVerificationEmail;