// controllers/transactionController.js
const db = require('../config/db');

// Helper to check if a card can purchase this month
const canPurchaseThisMonth = async (cardNumber) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const [rows] = await db.query(
    `SELECT COUNT(*) as count FROM transactions 
     WHERE card_number = ? AND approval_status = 'approved' 
     AND YEAR(created_at) = ? AND MONTH(created_at) = ?`,
    [cardNumber, year, month]
  );
  return rows[0].count === 0;
};

// @desc    Create a new transaction (user purchase)
exports.createTransaction = async (req, res) => {
  const { cardNumber, memberName, items, total, paymentMethod, biometricType } = req.body;
  const transactionId = `TXN${Date.now()}`;
  try {
    const canPurchase = await canPurchaseThisMonth(cardNumber);
    if (!canPurchase) {
      return res.status(400).json({ success: false, message: 'Monthly purchase limit reached' });
    }

    await db.query(
      `INSERT INTO transactions 
       (transaction_id, card_number, member_name, items, total, payment_method, biometric_type, approval_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [transactionId, cardNumber, memberName, JSON.stringify(items), total, paymentMethod, biometricType]
    );
    const [newTx] = await db.query('SELECT * FROM transactions WHERE transaction_id = ?', [transactionId]);
    // MySQL JSON columns are automatically parsed – no need for JSON.parse
    res.status(201).json(newTx[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all transactions (admin)
exports.getAllTransactions = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM transactions ORDER BY created_at DESC');
    // No JSON.parse needed – MySQL returns parsed objects
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get transactions for a specific card (user)
exports.getTransactionsByCard = async (req, res) => {
  const { cardNumber } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM transactions WHERE card_number = ? ORDER BY created_at DESC', [cardNumber]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Approve transaction (admin)
exports.approveTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      'UPDATE transactions SET approval_status = ?, approved_at = NOW() WHERE id = ?',
      ['approved', id]
    );
    const [updated] = await db.query('SELECT * FROM transactions WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Cancel transaction (admin)
exports.cancelTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE transactions SET approval_status = ? WHERE id = ?', ['cancelled', id]);
    const [updated] = await db.query('SELECT * FROM transactions WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update delivery status (admin)
exports.updateDeliveryStatus = async (req, res) => {
  const { id } = req.params;
  const { deliveryStatus } = req.body;
  try {
    await db.query(
      'UPDATE transactions SET delivery_status = ?, delivered_at = IF(? = "delivered", NOW(), NULL) WHERE id = ?',
      [deliveryStatus, deliveryStatus, id]
    );
    const [updated] = await db.query('SELECT * FROM transactions WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};