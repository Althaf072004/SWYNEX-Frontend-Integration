// controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Admin login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    const admin = rows[0];
    if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin.id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    User card verification (public)
exports.verifyCard = async (req, res) => {
  const { cardNumber } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM families WHERE card_number = ? AND is_active = 1', [cardNumber]);
    const family = rows[0];
    if (!family) return res.status(404).json({ success: false, message: 'Invalid card number' });

    // No manual JSON.parse needed – mysql2 already parsed JSON columns
    res.json({
      success: true,
      family: {
        cardNumber: family.card_number,
        headName: family.head_name,
        rationType: family.ration_type,
        address: family.address,
        monthlyQuota: family.monthly_quota, // already object
        members: family.members // already object
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Biometric verification (mock)
exports.verifyBiometric = async (req, res) => {
  res.json({ success: true, message: 'Biometric verified' });
};