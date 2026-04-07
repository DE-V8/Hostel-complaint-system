const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (to, otp, type = 'verify') => {
  const isReset = type === 'reset';
  const subject = isReset ? 'KJEI Hostel — Password Reset Code' : 'KJEI Hostel — Verify Your Account';
  const title   = isReset ? 'Reset Your Password' : 'Verify Your Account';
  const message = isReset
    ? 'You requested a password reset. Use the OTP below to proceed.'
    : 'Welcome to KJEI Hostel Tracker! Use the OTP below to verify your account.';

  const html = `
    <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #4a69bd, #6a89cc); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 600;">KJEI Hostel Tracker</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">${title}</p>
      </div>
      <div style="padding: 36px 32px;">
        <p style="color: #343a40; font-size: 15px;">${message}</p>
        <div style="background: white; border: 2px dashed #4a69bd; border-radius: 12px; padding: 28px; text-align: center; margin: 24px 0;">
          <p style="margin: 0 0 8px; color: #6c757d; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
          <h2 style="margin: 0; color: #4a69bd; font-size: 42px; letter-spacing: 10px; font-weight: 700;">${otp}</h2>
        </div>
        <p style="color: #6c757d; font-size: 13px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>
      <div style="background: #dee2e6; padding: 16px; text-align: center;">
        <p style="margin: 0; color: #6c757d; font-size: 12px;">© ${new Date().getFullYear()} KJEI Hostel Management. All rights reserved.</p>
      </div>
    </div>
  `;

  if (process.env.EMAIL_USER === 'your_gmail@gmail.com') {
    console.log('\n=============================================');
    console.log(`✉️ EMAIL SKIPPED: (Please configure .env)`);
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`OTP CODE: ${otp}`);
    console.log('=============================================\n');
    return; // Skip actual email sending
  }

  await transporter.sendMail({ from: `"KJEI Hostel" <${process.env.EMAIL_USER}>`, to, subject, html });
};

module.exports = { sendOtpEmail };
