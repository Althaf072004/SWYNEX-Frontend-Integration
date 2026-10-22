// controllers/familyController.js
const db = require('../config/db');

// @desc    Get all families (admin only)
exports.getAllFamilies = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM families WHERE is_active = 1');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get family by card number (public)
exports.getFamilyByCard = async (req, res) => {
  const { cardNumber } = req.params;
  console.log(`🔍 Fetching family with card number: ${cardNumber}`); // Debug log
  try {
    const [rows] = await db.query('SELECT * FROM families WHERE card_number = ? AND is_active = 1', [cardNumber]);
    if (rows.length === 0) {
      console.log(`❌ Family not found for card: ${cardNumber}`);
      return res.status(404).json({ success: false, message: 'Family not found' });
    }
    console.log(`✅ Family found:`, rows[0]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add new family (admin)
exports.addFamily = async (req, res) => {
  const { cardNumber, headName, headAadhar, headPhone, address, rationType, monthlyQuota, members } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO families 
       (card_number, head_name, head_aadhar, head_phone, address, ration_type, monthly_quota, members) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [cardNumber, headName, headAadhar, headPhone, address, rationType, JSON.stringify(monthlyQuota), JSON.stringify(members)]
    );
    const [newFamily] = await db.query('SELECT * FROM families WHERE id = ?', [result.insertId]);
    res.status(201).json(newFamily[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update family (admin)
exports.updateFamily = async (req, res) => {
  const { cardNumber } = req.params;
  const updates = req.body;
  const fields = [];
  const values = [];
  for (const [key, value] of Object.entries(updates)) {
    let dbKey;
    if (key === 'headName') dbKey = 'head_name';
    else if (key === 'headAadhar') dbKey = 'head_aadhar';
    else if (key === 'headPhone') dbKey = 'head_phone';
    else if (key === 'rationType') dbKey = 'ration_type';
    else if (key === 'monthlyQuota') dbKey = 'monthly_quota';
    else if (key === 'members') dbKey = 'members';
    else dbKey = key;

    fields.push(`${dbKey} = ?`);
    if (key === 'monthlyQuota' || key === 'members') {
      values.push(JSON.stringify(value));
    } else {
      values.push(value);
    }
  }
  values.push(cardNumber);
  try {
    await db.query(`UPDATE families SET ${fields.join(', ')} WHERE card_number = ?`, values);
    const [updated] = await db.query('SELECT * FROM families WHERE card_number = ?', [cardNumber]);
    if (updated.length === 0) return res.status(404).json({ success: false, message: 'Family not found' });
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete family (soft delete) (admin)
exports.deleteFamily = async (req, res) => {
  const { cardNumber } = req.params;
  try {
    await db.query('UPDATE families SET is_active = 0 WHERE card_number = ?', [cardNumber]);
    res.json({ success: true, message: 'Family deactivated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};