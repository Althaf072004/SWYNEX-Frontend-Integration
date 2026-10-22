// models/Family.js
const db = require('../config/db');

const Family = {
  // Get all active families
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM families WHERE is_active = 1');
    // Parse JSON fields
    rows.forEach(row => {
      row.monthly_quota = JSON.parse(row.monthly_quota);
      row.members = JSON.parse(row.members);
    });
    return rows;
  },

  // Find family by card number
  findByCardNumber: async (cardNumber) => {
    const [rows] = await db.query('SELECT * FROM families WHERE card_number = ? AND is_active = 1', [cardNumber]);
    if (rows.length === 0) return null;
    const family = rows[0];
    family.monthly_quota = JSON.parse(family.monthly_quota);
    family.members = JSON.parse(family.members);
    return family;
  },

  // Create a new family
  create: async (familyData) => {
    const { cardNumber, headName, headAadhar, headPhone, address, rationType, monthlyQuota, members } = familyData;
    const [result] = await db.query(
      `INSERT INTO families 
       (card_number, head_name, head_aadhar, head_phone, address, ration_type, monthly_quota, members) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [cardNumber, headName, headAadhar, headPhone, address, rationType, JSON.stringify(monthlyQuota), JSON.stringify(members)]
    );
    return Family.findByCardNumber(cardNumber);
  },

  // Update family
  update: async (cardNumber, updates) => {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(updates)) {
      let dbKey;
      if (key === 'monthlyQuota') dbKey = 'monthly_quota';
      else if (key === 'headName') dbKey = 'head_name';
      else if (key === 'headAadhar') dbKey = 'head_aadhar';
      else if (key === 'headPhone') dbKey = 'head_phone';
      else if (key === 'rationType') dbKey = 'ration_type';
      else if (key === 'cardNumber') dbKey = 'card_number';
      else dbKey = key;

      fields.push(`${dbKey} = ?`);
      if (key === 'monthlyQuota' || key === 'members') {
        values.push(JSON.stringify(value));
      } else {
        values.push(value);
      }
    }
    values.push(cardNumber);
    await db.query(`UPDATE families SET ${fields.join(', ')} WHERE card_number = ?`, values);
    return Family.findByCardNumber(cardNumber);
  },

  // Soft delete
  delete: async (cardNumber) => {
    await db.query('UPDATE families SET is_active = 0 WHERE card_number = ?', [cardNumber]);
  },

  // Hard delete (use with caution)
  hardDelete: async (cardNumber) => {
    await db.query('DELETE FROM families WHERE card_number = ?', [cardNumber]);
  }
};

module.exports = Family;