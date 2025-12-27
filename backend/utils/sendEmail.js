const nodemailer = require('nodemailer');

const sendActivationEmail = async (email, activationUrl) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Or use SMTP details
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Paper Trading" <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: 'Activate Your Paper Trading Account',
      html: `
        <h2>Welcome to Paper Trading!</h2>
        <p>Thank you for registering. Please click the button below to activate your account:</p>
        <a href="${activationUrl}" style="background:#007bff;color:white;padding:12px 24px;text-decoration:none;border-radius:5px;display:inline-block;margin:20px 0;">
          Activate Account
        </a>
        <p>Or copy this link: <br> <strong>${activationUrl}</strong></p>
        <p>This link expires in 24 hours.</p>
        <p>If you didn't register, ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
};

module.exports = { sendActivationEmail };