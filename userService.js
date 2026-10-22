// src/services/userService.js
import api from './api';

// Public endpoints (no token needed)
export const userService = {
  // 🔐 Verify smart card (login)
  verifyCard: async (cardNumber) => {
    try {
      const response = await api.post('/auth/user/verify', { cardNumber });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // 🔑 Biometric verification
  verifyBiometric: async (cardNumber, memberId, type) => {
    try {
      const response = await api.post('/auth/user/biometric', { cardNumber, memberId, type });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Biometric verification failed' };
    }
  },

  // 📦 Get all products (public)
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  // 👨‍👩‍👧 Get family details by card number (public)
  getFamilyByCard: async (cardNumber) => {
    const response = await api.get(`/families/${cardNumber}`);
    return response.data;
  },

  // 💳 Create a new transaction (purchase)
  createTransaction: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  // 📜 Get transactions for a specific card
  getTransactionsByCard: async (cardNumber) => {
    const response = await api.get(`/transactions/card/${cardNumber}`);
    return response.data;
  }
};