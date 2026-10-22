// src/services/adminData.js
import api from './api';

export const adminService = {
  // 🔐 Authentication
  authenticateAdmin: async (username, password) => {
    try {
      const response = await api.post('/auth/admin/login', { email: username, password });
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  },

  // 📦 Product Management
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  addProduct: async (product) => {
    const response = await api.post('/products', product);
    return response.data;
  },

  updateProduct: async (id, updates) => {
    const response = await api.put(`/products/${id}`, updates);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  updateProductLimit: async (id, newLimit) => {
    const product = await adminService.getProductById(id);
    const updated = { ...product, limit: newLimit };
    return adminService.updateProduct(id, updated);
  },

  updateProductPrice: async (id, newPrice) => {
    const product = await adminService.getProductById(id);
    const updated = { ...product, price: newPrice };
    return adminService.updateProduct(id, updated);
  },

  updateProductStock: async (id, newStock) => {
    const product = await adminService.getProductById(id);
    const updated = { ...product, stock: newStock };
    return adminService.updateProduct(id, updated);
  },

  updateProductImage: async (id, imageUrl) => {
    const product = await adminService.getProductById(id);
    const updated = { ...product, image: imageUrl };
    return adminService.updateProduct(id, updated);
  },

  // 👨‍👩‍👧 Family Management
  getFamilies: async () => {
    const response = await api.get('/families');
    return response.data;
  },

  getFamilyByCard: async (cardNumber) => {
    const response = await api.get(`/families/${cardNumber}`);
    return response.data;
  },

  addFamily: async (cardNumber, familyData) => {
    const response = await api.post('/families', { cardNumber, ...familyData });
    return response.data;
  },

  updateFamily: async (cardNumber, updates) => {
    const response = await api.put(`/families/${cardNumber}`, updates);
    return response.data;
  },

  deleteFamily: async (cardNumber) => {
    const response = await api.delete(`/families/${cardNumber}`);
    return response.data;
  },

  addFamilyMember: async (cardNumber, member) => {
    const family = await adminService.getFamilyByCard(cardNumber);
    const updatedMembers = [...(family.members || []), member];
    return adminService.updateFamily(cardNumber, { members: updatedMembers });
  },

  updateFamilyMember: async (cardNumber, memberId, updates) => {
    const family = await adminService.getFamilyByCard(cardNumber);
    const updatedMembers = family.members.map(m => 
      m.id === memberId ? { ...m, ...updates } : m
    );
    return adminService.updateFamily(cardNumber, { members: updatedMembers });
  },

  deleteFamilyMember: async (cardNumber, memberId) => {
    const family = await adminService.getFamilyByCard(cardNumber);
    const updatedMembers = family.members.filter(m => m.id !== memberId);
    return adminService.updateFamily(cardNumber, { members: updatedMembers });
  },

  // 💳 Transaction Management
  getTransactions: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },

  getTransactionsByCard: async (cardNumber) => {
    const response = await api.get(`/transactions/card/${cardNumber}`);
    return response.data;
  },

  approveTransaction: async (transactionId) => {
    const response = await api.put(`/transactions/${transactionId}/approve`);
    return response.data;
  },

  cancelTransaction: async (transactionId) => {
    const response = await api.put(`/transactions/${transactionId}/cancel`);
    return response.data;
  },

  updateDeliveryStatus: async (transactionId, deliveryStatus) => {
    const response = await api.put(`/transactions/${transactionId}/delivery`, { deliveryStatus });
    return response.data;
  },

  // 📊 Analytics
  getAnalytics: async () => {
    const [families, products, transactions] = await Promise.all([
      adminService.getFamilies(),
      adminService.getProducts(),
      adminService.getTransactions()
    ]);
    return {
      totalCards: families.length,
      totalProducts: products.length,
      totalTransactions: transactions.length,
      revenue: transactions.reduce((sum, t) => sum + t.total, 0),
      pendingTransactions: transactions.filter(t => t.approval_status === 'pending').length,
    };
  },

  // ⚙️ Settings (mock – extend as needed)
  getSettings: async () => ({
    systemName: 'TN-PDS',
    maintenanceMode: false,
    backupTime: '02:00',
    smsAlerts: true,
    emailNotifications: true,
    sessionTimeout: 30
  }),

  updateSettings: async (updates) => updates,

  // 🔄 Sync (for compatibility – actual sync is via API)
  syncUserTransaction: (transaction) => transaction,
  syncUserFamily: (cardNumber, familyData) => familyData
};