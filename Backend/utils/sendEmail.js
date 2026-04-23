const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const verificationLink =
    `${process.env.CLIENT_URL}/verify-email/${token}`;

  await transporter.sendMail({
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
};

module.exports = sendVerificationEmail;