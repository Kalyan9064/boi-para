const axios = require("axios");

const sendVerificationEmail = async (email, token) => {
  console.log("📧 STEP 1: Function called");

  try {
    const verificationLink =
      `${process.env.CLIENT_URL}/verify-email/${token}`;

    console.log("🔗 STEP 2: Link created:", verificationLink);

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
          "api-key": process.env.EMAIL_PASS,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ STEP 3: Email sent");
    console.log(response.data);

  } catch (error) {
    console.log("❌ EMAIL ERROR:");
    console.log(error.response?.data || error.message);
  }
};

module.exports = sendVerificationEmail;