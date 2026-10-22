// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/admin/login', authController.adminLogin);
router.post('/user/verify', authController.verifyCard);
router.post('/user/biometric', authController.verifyBiometric);

module.exports = router;