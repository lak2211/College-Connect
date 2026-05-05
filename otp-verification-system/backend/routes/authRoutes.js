const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /send-otp
router.post('/send-otp', authController.sendOTP);

// POST /verify-otp
router.post('/verify-otp', authController.verifyOTP);

// GET /test-email
router.get('/test-email', authController.testEmail);

module.exports = router;
