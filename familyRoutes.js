// routes/familyRoutes.js
const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// ✅ Public route – must be before any parameterized routes that might conflict
router.get('/:cardNumber', familyController.getFamilyByCard);

// Admin-only routes
router.get('/', authMiddleware, adminMiddleware, familyController.getAllFamilies);
router.post('/', authMiddleware, adminMiddleware, familyController.addFamily);
router.put('/:cardNumber', authMiddleware, adminMiddleware, familyController.updateFamily);
router.delete('/:cardNumber', authMiddleware, adminMiddleware, familyController.deleteFamily);

module.exports = router;