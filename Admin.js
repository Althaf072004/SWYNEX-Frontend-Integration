// models/Admin.js
const db = require('../config/db');

const Admin = {
  // Find admin by email
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    return rows[0];
  },

  // Create a new admin (useful for seeding)
  create: async (name, email, hashedPassword, role = 'admin') => {
    const [result] = await db.query(
      'INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    return result.insertId;
  },

  // Update admin (e.g., password)
  update: async (id, updates) => {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(id);
    await db.query(`UPDATE admins SET ${fields.join(', ')} WHERE id = ?`, values);
    const [rows] = await db.query('SELECT * FROM admins WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = Admin;