// src/hooks/useAdminSystem.js
import { useState, useEffect } from 'react';
import { adminService } from '../services/adminData';

export const useAdminSystem = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data states
  const [products, setProducts] = useState([]);
  const [families, setFamilies] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [settings, setSettings] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load initial data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Load all data from service
  const loadData = () => {
    try {
      setProducts(adminService.getProducts());
      setFamilies(adminService.getFamilies());
      setTransactions(adminService.getTransactions());
      setAnalytics(adminService.getAnalytics());
      setSettings(adminService.getSettings());
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError(err.message);
    }
  };

  // 🔐 Authentication
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.authenticateAdmin(username, password);
      setIsAuthenticated(true);
      setAdminUser(response.admin);
      return { success: true, admin: response.admin };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    setActiveTab('dashboard');
    // Clear data
    setProducts([]);
    setFamilies({});
    setTransactions([]);
    setAnalytics({});
    setSettings({});
  };

  // 📦 Product Management
  const getProducts = () => {
    const data = adminService.getProducts();
    setProducts(data);
    return data;
  };

  const getProductById = (id) => {
    return adminService.getProductById(id);
  };

  const addProduct = (product) => {
    const newProduct = adminService.addProduct(product);
    setProducts(adminService.getProducts());
    setAnalytics(adminService.getAnalytics());
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    const updated = adminService.updateProduct(id, updates);
    setProducts(adminService.getProducts());
    return updated;
  };

  const deleteProduct = (id) => {
    adminService.deleteProduct(id);
    setProducts(adminService.getProducts());
    setAnalytics(adminService.getAnalytics());
  };

  const updateProductLimit = (id, limit) => {
    const updated = adminService.updateProductLimit(id, limit);
    setProducts(adminService.getProducts());
    return updated;
  };

  const updateProductPrice = (id, price) => {
    const updated = adminService.updateProductPrice(id, price);
    setProducts(adminService.getProducts());
    return updated;
  };

  const updateProductStock = (id, stock) => {
    const updated = adminService.updateProductStock(id, stock);
    setProducts(adminService.getProducts());
    return updated;
  };

  const updateProductImage = (id, image) => {
    const updated = adminService.updateProductImage(id, image);
    setProducts(adminService.getProducts());
    return updated;
  };

  // 👨‍👩‍👧 Family Management
  const getFamilies = () => {
    const data = adminService.getFamilies();
    setFamilies(data);
    return data;
  };

  const getFamilyByCard = (cardNumber) => {
    return adminService.getFamilyByCard(cardNumber);
  };

  const addFamily = (cardNumber, familyData) => {
    const newFamily = adminService.addFamily(cardNumber, familyData);
    setFamilies(adminService.getFamilies());
    setAnalytics(adminService.getAnalytics());
    return newFamily;
  };

  const updateFamily = (cardNumber, updates) => {
    const updated = adminService.updateFamily(cardNumber, updates);
    setFamilies(adminService.getFamilies());
    return updated;
  };

  const deleteFamily = (cardNumber) => {
    adminService.deleteFamily(cardNumber);
    setFamilies(adminService.getFamilies());
    setAnalytics(adminService.getAnalytics());
  };

  // Family Members
  const getFamilyMembers = (cardNumber) => {
    return adminService.getFamilyMembers(cardNumber);
  };

  const getFamilyMember = (cardNumber, memberId) => {
    return adminService.getFamilyMember(cardNumber, memberId);
  };

  const addFamilyMember = (cardNumber, member) => {
    const newMember = adminService.addFamilyMember(cardNumber, member);
    setFamilies(adminService.getFamilies());
    return newMember;
  };

  const updateFamilyMember = (cardNumber, memberId, updates) => {
    const updated = adminService.updateFamilyMember(cardNumber, memberId, updates);
    setFamilies(adminService.getFamilies());
    return updated;
  };

  const deleteFamilyMember = (cardNumber, memberId) => {
    adminService.deleteFamilyMember(cardNumber, memberId);
    setFamilies(adminService.getFamilies());
  };

  // 💳 Transaction Management
  const getTransactions = () => {
    const data = adminService.getTransactions();
    setTransactions(data);
    return data;
  };

  const getTransactionById = (id) => {
    return adminService.getTransactionById(id);
  };

  const getTransactionsByCard = (cardNumber) => {
    return adminService.getTransactionsByCard(cardNumber);
  };

  const getTransactionsByDate = (startDate, endDate) => {
    return adminService.getTransactionsByDate(startDate, endDate);
  };

  const getTransactionsByStatus = (status) => {
    return adminService.getTransactionsByStatus(status);
  };

  const addTransaction = (transaction) => {
    const newTransaction = adminService.addTransaction(transaction);
    setTransactions(adminService.getTransactions());
    setAnalytics(adminService.getAnalytics());
    return newTransaction;
  };

  const updateTransaction = (id, updates) => {
    const updated = adminService.updateTransaction(id, updates);
    setTransactions(adminService.getTransactions());
    return updated;
  };

  const updateDeliveryStatus = (transactionId, status) => {
    const updated = adminService.updateDeliveryStatus(transactionId, status);
    setTransactions(adminService.getTransactions());
    setAnalytics(adminService.getAnalytics());
    return updated;
  };

  const deleteTransaction = (id) => {
    adminService.deleteTransaction(id);
    setTransactions(adminService.getTransactions());
    setAnalytics(adminService.getAnalytics());
  };

  // 📊 Analytics
  const getAnalytics = () => {
    const data = adminService.getAnalytics();
    setAnalytics(data);
    return data;
  };

  const getSalesReport = (startDate, endDate) => {
    return adminService.getSalesReport(startDate, endDate);
  };

  // ⚙️ Settings
  const getSettings = () => {
    const data = adminService.getSettings();
    setSettings(data);
    return data;
  };

  const updateSettings = (updates) => {
    const updated = adminService.updateSettings(updates);
    setSettings(updated);
    return updated;
  };

  const resetSettings = () => {
    const reset = adminService.resetSettings();
    setSettings(reset);
    return reset;
  };

  // 🔄 Sync Functions
  const syncTransaction = (transaction) => {
    const synced = adminService.syncUserTransaction(transaction);
    setTransactions(adminService.getTransactions());
    setAnalytics(adminService.getAnalytics());
    return synced;
  };

  const syncFamily = (cardNumber, familyData) => {
    const synced = adminService.syncUserFamily(cardNumber, familyData);
    setFamilies(adminService.getFamilies());
    return synced;
  };

  // 📋 Export/Import
  const exportData = () => {
    return adminService.exportData();
  };

  const importData = (data) => {
    const result = adminService.importData(data);
    // Reload all data
    loadData();
    return result;
  };

  // 🔍 Search
  const searchTransactions = (query) => {
    return adminService.searchTransactions(query);
  };

  const searchFamilies = (query) => {
    return adminService.searchFamilies(query);
  };

  // 📈 Dashboard Stats
  const getDashboardStats = () => {
    return {
      totalCards: Object.keys(families).length,
      totalProducts: products.length,
      totalTransactions: transactions.length,
      totalRevenue: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      pendingDeliveries: transactions.filter(t => t.deliveryStatus === 'pending').length,
      recentTransactions: transactions.slice(0, 5),
      lowStockProducts: products.filter(p => p.stock < 50),
      ...analytics
    };
  };

  // 🔄 Refresh Data
  const refreshData = () => {
    loadData();
  };

  return {
    // Auth State
    isAuthenticated,
    adminUser,
    loading,
    error,
    activeTab,
    setActiveTab,
    
    // Data States
    products,
    families,
    transactions,
    analytics,
    settings,
    
    // Auth Methods
    login,
    logout,
    
    // Product Methods
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductLimit,
    updateProductPrice,
    updateProductStock,
    updateProductImage,
    
    // Family Methods
    getFamilies,
    getFamilyByCard,
    addFamily,
    updateFamily,
    deleteFamily,
    getFamilyMembers,
    getFamilyMember,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    
    // Transaction Methods
    getTransactions,
    getTransactionById,
    getTransactionsByCard,
    getTransactionsByDate,
    getTransactionsByStatus,
    addTransaction,
    updateTransaction,
    updateDeliveryStatus,
    deleteTransaction,
    
    // Analytics Methods
    getAnalytics,
    getSalesReport,
    
    // Settings Methods
    getSettings,
    updateSettings,
    resetSettings,
    
    // Sync Methods
    syncTransaction,
    syncFamily,
    
    // Export/Import
    exportData,
    importData,
    
    // Search
    searchTransactions,
    searchFamilies,
    
    // Dashboard
    getDashboardStats,
    
    // Utility
    refreshData
  };
};