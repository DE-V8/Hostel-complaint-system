const express = require('express');
const router  = express.Router();
const {
  register, verifyOtp, setPassword, login,
  forgotPassword, verifyResetOtp, resetPassword, getProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register',          register);
router.post('/verify-otp',        verifyOtp);
router.post('/set-password',      setPassword);
router.post('/login',             login);
router.post('/forgot-password',   forgotPassword);
router.post('/verify-reset-otp',  verifyResetOtp);
router.post('/reset-password',    resetPassword);
router.get('/profile',            protect, getProfile);

module.exports = router;
