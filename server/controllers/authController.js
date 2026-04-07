const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const User   = require('../models/User');
const { sendOtpEmail } = require('../utils/sendEmail');

const generateOtp = () => crypto.randomInt(100000, 999999).toString();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─── REGISTER ─────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email)
      return res.status(400).json({ message: 'All fields are required.' });

    const existing = await User.findOne({ email });
    if (existing && existing.isVerified)
      return res.status(409).json({ message: 'Email already registered. Please login.' });

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    if (existing) {
      existing.firstName = firstName;
      existing.lastName  = lastName;
      existing.otp       = otp;
      existing.otpExpiry = otpExpiry;
      await existing.save();
    } else {
      await User.create({ firstName, lastName, email, otp, otpExpiry });
    }

    await sendOtpEmail(email, otp, 'verify');
    res.status(200).json({ message: `OTP sent to ${email}. Please verify.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// ─── VERIFY OTP ───────────────────────────────────────────────────────────────
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP.' });
    if (new Date() > user.otpExpiry) return res.status(400).json({ message: 'OTP has expired. Please register again.' });

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error during OTP verification.' });
  }
};

// ─── SET PASSWORD ─────────────────────────────────────────────────────────────
exports.setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.password   = await bcrypt.hash(password, 12);
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Password set! You can now login.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error while setting password.' });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email });
    if (!user || !user.isVerified)
      return res.status(401).json({ message: 'Invalid credentials or account not verified.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = generateToken(user._id);
    res.status(200).json({
      token,
      user: {
        id:        user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        role:      user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, isVerified: true });
    if (!user) return res.status(404).json({ message: 'No verified account found with this email.' });

    const otp = generateOtp();
    user.otp       = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp, 'reset');
    res.status(200).json({ message: `Reset code sent to ${email}.` });
  } catch (err) {
    res.status(500).json({ message: 'Server error during forgot password.' });
  }
};

// ─── VERIFY RESET OTP ─────────────────────────────────────────────────────────
exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid reset code.' });
    if (new Date() > user.otpExpiry) return res.status(400).json({ message: 'Reset code has expired.' });

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Code verified.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error during OTP verification.' });
  }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const user = await User.findOne({ email, isVerified: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.password = await bcrypt.hash(password, 12);
    await user.save();

    res.status(200).json({ message: 'Password reset successfully. Please login.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error during password reset.' });
  }
};

// ─── GET PROFILE ──────────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  res.status(200).json(req.user);
};
