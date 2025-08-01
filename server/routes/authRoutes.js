const express = require('express');
const router = express.Router();
const authController = require('../api/authController');

// Register
router.post('/register', authController.register);
// Login
router.post('/login', authController.login);
// Logout
router.post('/logout', authController.logout);
// Forgot Password
router.post('/forgot-password', authController.forgotPassword);
// Verify Reset Code
router.post('/verify-reset-code', authController.verifyResetCode);
// Reset Password
router.post('/reset-password', authController.resetPassword);

module.exports = router;