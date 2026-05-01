const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
  console.log("📧 STEP 1: Function called");

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,   // Brevo email
        pass: process.env.EMAIL_PASS,   // Brevo API key
      },
    });

    console.log("📧 STEP 2: Transport created");

    const verificationLink =
      `${process.env.CLIENT_URL}/verify-email/${token}`;

    console.log("🔗 STEP 3: Link created:", verificationLink);

    const info = await transporter.sendMail({
      from: `"Boi Para" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Email Verification</h2>
        <p>Click below to verify your account:</p>
        <a href="${verificationLink}" 
           style="
             display:inline-block;
             padding:12px 20px;
             background:#16a34a;
             color:white;
             text-decoration:none;
             border-radius:6px;
             font-weight:bold;
           ">
           Verify Email
        </a>
      `,
    });

    console.log("✅ STEP 4: Email sent");
    console.log("Message ID:", info.messageId);

  } catch (error) {
    console.log("❌ EMAIL ERROR:");
    console.log(error.message);
  }
};

module.exports = sendVerificationEmail;