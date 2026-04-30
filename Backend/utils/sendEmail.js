const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
  console.log("📧 STEP 1: Function called");

  try {
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // important
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

    console.log("📧 STEP 2: Transport created");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

    const verificationLink =
      `${process.env.CLIENT_URL}/verify-email/${token}`;

    console.log("🔗 STEP 3: Link created:", verificationLink);

    await transporter.verify();
    console.log("✅ STEP 4: SMTP verified");

    const info = await transporter.sendMail({
      from: `"Boi Para" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Verify:</p><a href="${verificationLink}">${verificationLink}</a>`
    });

    console.log("✅ STEP 5: Email sent");
    console.log("Message ID:", info.messageId);

  } catch (error) {
    console.log("❌ EMAIL ERROR:");
    console.log(error);
  }
};

module.exports = sendVerificationEmail;