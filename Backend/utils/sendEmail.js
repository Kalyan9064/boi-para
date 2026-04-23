const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
  console.log("📧 Sending email to:", email);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 🔗 Verification link (production)
    const verificationLink =
      `${process.env.CLIENT_URL}/verify-email/${token}`;

    console.log("🔗 Verification link:", verificationLink);

    // 🧪 Verify transporter connection (VERY IMPORTANT)
    await transporter.verify();
    console.log("✅ SMTP server is ready");

    // 📤 Send email
    const info = await transporter.sendMail({
      from: `"Boi Para" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Email Verification</h2>
        <p>Click below to verify your account:</p>
        <a 
          href="${verificationLink}"
          style="
            display:inline-block;
            padding:12px 24px;
            background:#16a34a;
            color:white;
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          "
        >
          Click Here to Verify
        </a>
      `
    });

    console.log("✅ Email sent successfully");
    console.log("📨 Message ID:", info.messageId);

  } catch (error) {
    console.log("❌ Email sending failed:");
    console.log(error);
  }
};

module.exports = sendVerificationEmail;