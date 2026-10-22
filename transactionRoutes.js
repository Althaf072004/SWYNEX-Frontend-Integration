// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', transactionController.createTransaction); // user purchase
router.get('/', authMiddleware, adminMiddleware, transactionController.getAllTransactions);
router.get('/card/:cardNumber', transactionController.getTransactionsByCard); // user can see their own
router.put('/:id/approve', authMiddleware, adminMiddleware, transactionController.approveTransaction);
router.put('/:id/cancel', authMiddleware, adminMiddleware, transactionController.cancelTransaction);
router.put('/:id/delivery', authMiddleware, adminMiddleware, transactionController.updateDeliveryStatus);

module.exports = router;