const nodemailer = require("nodemailer");

const sendPasswordResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const resetLink = `${process.env.CLIENT_URL}/reset_password?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
  }
}