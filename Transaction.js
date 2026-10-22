// models/Transaction.js
const db = require('../config/db');

const Transaction = {
  // Create a new transaction
  create: async (txData) => {
    const { transactionId, cardNumber, memberName, items, total, paymentMethod, biometricType, approvalStatus = 'pending', deliveryStatus = 'pending' } = txData;
    const [result] = await db.query(
      `INSERT INTO transactions 
       (transaction_id, card_number, member_name, items, total, payment_method, biometric_type, approval_status, delivery_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [transactionId, cardNumber, memberName, JSON.stringify(items), total, paymentMethod, biometricType, approvalStatus, deliveryStatus]
    );
    return Transaction.findById(result.insertId);
  },

  // Find transaction by ID
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM transactions WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    rows[0].items = JSON.parse(rows[0].items);
    return rows[0];
  },

  // Get all transactions (admin)
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM transactions ORDER BY created_at DESC');
    rows.forEach(row => row.items = JSON.parse(row.items));
    return rows;
  },

  // Get transactions by card number (user)
  findByCardNumber: async (cardNumber) => {
    const [rows] = await db.query('SELECT * FROM transactions WHERE card_number = ? ORDER BY created_at DESC', [cardNumber]);
    rows.forEach(row => row.items = JSON.parse(row.items));
    return rows;
  },

  // Approve transaction
  approve: async (id) => {
    await db.query('UPDATE transactions SET approval_status = ?, approved_at = NOW() WHERE id = ?', ['approved', id]);
    return Transaction.findById(id);
  },

  // Cancel transaction
  cancel: async (id) => {
    await db.query('UPDATE transactions SET approval_status = ? WHERE id = ?', ['cancelled', id]);
    return Transaction.findById(id);
  },

  // Update delivery status
  updateDeliveryStatus: async (id, deliveryStatus) => {
    await db.query(
      'UPDATE transactions SET delivery_status = ?, delivered_at = IF(? = "delivered", NOW(), NULL) WHERE id = ?',
      [deliveryStatus, deliveryStatus, id]
    );
    return Transaction.findById(id);
  },

  // Check if card can purchase this month (no approved transactions in current month)
  canPurchaseThisMonth: async (cardNumber) => {
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
  }
};

module.exports = Transaction;