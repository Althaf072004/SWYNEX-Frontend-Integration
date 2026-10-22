// models/Product.js
const db = require('../config/db');

const Product = {
  // Get all active products
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM products WHERE is_active = 1');
    return rows;
  },

  // Find product by ID
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  },

  // Create a new product
  create: async (productData) => {
    const { name, price, limit, unit, image, stock } = productData;
    const [result] = await db.query(
      'INSERT INTO products (name, price, `limit`, unit, image, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, limit, unit, image, stock]
    );
    return Product.findById(result.insertId);
  },

  // Update product – safely filters out auto‑managed fields
  update: async (id, updates) => {
    // Remove fields that should not be updated manually
    const allowedUpdates = { ...updates };
    delete allowedUpdates.id;
    delete allowedUpdates.created_at;
    delete allowedUpdates.updated_at; // let database handle with ON UPDATE

    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(allowedUpdates)) {
      if (key === 'limit') {
        fields.push('`limit` = ?');
      } else {
        fields.push(`${key} = ?`);
      }
      values.push(value);
    }

    if (fields.length === 0) {
      // Nothing to update – just return current product
      return Product.findById(id);
    }

    values.push(id);
    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    console.log('Executing SQL:', sql, values); // helpful for debugging
    await db.query(sql, values);
    return Product.findById(id);
  },

  // Soft delete
  delete: async (id) => {
    await db.query('UPDATE products SET is_active = 0 WHERE id = ?', [id]);
  },

  // Hard delete (optional)
  hardDelete: async (id) => {
    await db.query('DELETE FROM products WHERE id = ?', [id]);
  }
};

module.exports = Product;