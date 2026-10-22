// src/contexts/AdminContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../services/adminData';
import { useRation } from './RationContext';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data states – initialised as empty arrays/objects
  const [products, setProducts] = useState([]);
  const [families, setFamilies] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [settings, setSettings] = useState({});

  const ration = useRation();

  // --- Sync effects (unchanged, but note they use sync methods) ---
  useEffect(() => {
    if (ration?.transactionId && isAdminAuthenticated) {
      const transaction = {
        id: ration.transactionId,
        card: ration.currentCard,
        member: ration.currentMember?.name,
        total: `₹ ${ration.totalAmount?.toFixed(2) || '0.00'}`,
        amount: ration.totalAmount || 0,
        date: new Date().toLocaleString('en-IN'),
        items: ration.cart || {},
        biometric: ration.selectedBiometric,
        payment: ration.selectedPayment
      };
      adminService.syncUserTransaction(transaction);
      // refresh transactions and analytics after sync
      refreshTransactionsAndAnalytics();
    }
  }, [
    ration?.transactionId,
    isAdminAuthenticated,
    ration?.currentCard,
    ration?.currentMember?.name,
    ration?.totalAmount,
    ration?.cart,
    ration?.selectedBiometric,
    ration?.selectedPayment
  ]);

  useEffect(() => {
    if (ration?.currentCard && ration?.currentFamily && isAdminAuthenticated) {
      adminService.syncUserFamily(ration.currentCard, { members: ration.currentFamily });
      refreshFamilies();
    }
  }, [ration?.currentCard, ration?.currentFamily, isAdminAuthenticated]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadData();
    }
  }, [isAdminAuthenticated]);

  // --- Helper to refresh data from the server ---
  const refreshProducts = async () => {
    try {
      const data = await adminService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to refresh products', err);
    }
  };

  const refreshFamilies = async () => {
    try {
      const data = await adminService.getFamilies();
      setFamilies(data);
    } catch (err) {
      console.error('Failed to refresh families', err);
    }
  };

  const refreshTransactions = async () => {
    try {
      const data = await adminService.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to refresh transactions', err);
    }
  };

  const refreshAnalytics = async () => {
    try {
      const data = await adminService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to refresh analytics', err);
    }
  };

  const refreshTransactionsAndAnalytics = async () => {
    await refreshTransactions();
    await refreshAnalytics();
  };

  const loadData = async () => {
    try {
      const [productsData, familiesData, transactionsData, analyticsData, settingsData] = await Promise.all([
        adminService.getProducts(),
        adminService.getFamilies(),
        adminService.getTransactions(),
        adminService.getAnalytics(),
        adminService.getSettings()
      ]);
      setProducts(productsData);
      setFamilies(familiesData);
      setTransactions(transactionsData);
      setAnalytics(analyticsData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  // --- Admin Authentication ---
  const adminLogin = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.authenticateAdmin(username, password);
      setIsAdminAuthenticated(true);
      setAdminUser(response.admin);
      return { success: true, admin: response.admin };
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    setActiveTab('dashboard');
    // Optionally clear data
    setProducts([]);
    setFamilies({});
    setTransactions([]);
    setAnalytics({});
    setSettings({});
  };

  // --- Product Management (async) ---
  const addProduct = async (product) => {
    try {
      const newProduct = await adminService.addProduct(product);
      await refreshProducts();
      await refreshAnalytics();
      return newProduct;
    } catch (err) {
      console.error('Add product failed', err);
      throw err;
    }
  };

  const updateProduct = async (productId, updates) => {
    try {
      const updated = await adminService.updateProduct(productId, updates);
      await refreshProducts();
      return updated;
    } catch (err) {
      console.error('Update product failed', err);
      throw err;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await adminService.deleteProduct(productId);
      await refreshProducts();
      await refreshAnalytics();
    } catch (err) {
      console.error('Delete product failed', err);
      throw err;
    }
  };

  const updateProductLimit = async (productId, newLimit) => {
    try {
      const updated = await adminService.updateProductLimit(productId, newLimit);
      await refreshProducts();
      return updated;
    } catch (err) {
      console.error('Update product limit failed', err);
      throw err;
    }
  };

  const updateProductPrice = async (productId, newPrice) => {
    try {
      const updated = await adminService.updateProductPrice(productId, newPrice);
      await refreshProducts();
      return updated;
    } catch (err) {
      console.error('Update product price failed', err);
      throw err;
    }
  };

  const updateProductStock = async (productId, newStock) => {
    try {
      const updated = await adminService.updateProductStock(productId, newStock);
      await refreshProducts();
      return updated;
    } catch (err) {
      console.error('Update product stock failed', err);
      throw err;
    }
  };

  const updateProductImage = async (productId, imageUrl) => {
    try {
      const updated = await adminService.updateProductImage(productId, imageUrl);
      await refreshProducts();
      return updated;
    } catch (err) {
      console.error('Update product image failed', err);
      throw err;
    }
  };

  // --- Family Management (async) ---
  const addFamily = async (cardNumber, familyData) => {
    try {
      const newFamily = await adminService.addFamily(cardNumber, familyData);
      await refreshFamilies();
      await refreshAnalytics();
      return newFamily;
    } catch (err) {
      console.error('Add family failed', err);
      throw err;
    }
  };

  const updateFamily = async (cardNumber, updates) => {
    try {
      const updated = await adminService.updateFamily(cardNumber, updates);
      await refreshFamilies();
      return updated;
    } catch (err) {
      console.error('Update family failed', err);
      throw err;
    }
  };

  const deleteFamily = async (cardNumber) => {
    try {
      await adminService.deleteFamily(cardNumber);
      await refreshFamilies();
      await refreshAnalytics();
    } catch (err) {
      console.error('Delete family failed', err);
      throw err;
    }
  };

  const addFamilyMember = async (cardNumber, member) => {
    try {
      const newMember = await adminService.addFamilyMember(cardNumber, member);
      await refreshFamilies();
      return newMember;
    } catch (err) {
      console.error('Add family member failed', err);
      throw err;
    }
  };

  const updateFamilyMember = async (cardNumber, memberId, updates) => {
    try {
      const updated = await adminService.updateFamilyMember(cardNumber, memberId, updates);
      await refreshFamilies();
      return updated;
    } catch (err) {
      console.error('Update family member failed', err);
      throw err;
    }
  };

  const deleteFamilyMember = async (cardNumber, memberId) => {
    try {
      await adminService.deleteFamilyMember(cardNumber, memberId);
      await refreshFamilies();
    } catch (err) {
      console.error('Delete family member failed', err);
      throw err;
    }
  };

  // --- Transaction Management (async) ---
  const updateDeliveryStatus = async (transactionId, status) => {
    try {
      const updated = await adminService.updateDeliveryStatus(transactionId, status);
      await refreshTransactions();
      await refreshAnalytics();
      return updated;
    } catch (err) {
      console.error('Update delivery status failed', err);
      throw err;
    }
  };

  const getTransactionsByCard = async (cardNumber) => {
    try {
      return await adminService.getTransactionsByCard(cardNumber);
    } catch (err) {
      console.error('Get transactions by card failed', err);
      return [];
    }
  };

  const approveTransaction = async (transactionId) => {
    try {
      const updated = await adminService.approveTransaction(transactionId);
      await refreshTransactions();
      await refreshAnalytics();
      return updated;
    } catch (err) {
      console.error('Approve transaction failed', err);
      throw err;
    }
  };

  const cancelTransaction = async (transactionId) => {
    try {
      const updated = await adminService.cancelTransaction(transactionId);
      await refreshTransactions();
      await refreshAnalytics();
      return updated;
    } catch (err) {
      console.error('Cancel transaction failed', err);
      throw err;
    }
  };

  // --- Settings ---
  const updateSettings = async (updates) => {
    try {
      const updated = await adminService.updateSettings(updates);
      setSettings(updated);
      return updated;
    } catch (err) {
      console.error('Update settings failed', err);
      throw err;
    }
  };

  // --- Manual sync (can remain synchronous if they are) ---
  const syncTransaction = (transaction) => {
    const synced = adminService.syncUserTransaction(transaction);
    // After sync, you might want to refresh
    refreshTransactionsAndAnalytics();
    return synced;
  };

  const syncFamily = (cardNumber, familyData) => {
    const synced = adminService.syncUserFamily(cardNumber, familyData);
    refreshFamilies();
    return synced;
  };

  // Value object – note that all methods now return Promises
  const value = {
    isAdminAuthenticated,
    adminUser,
    loading,
    error,
    activeTab,
    setActiveTab,

    products,
    families,
    transactions,
    analytics,
    settings,

    adminLogin,
    adminLogout,

    addProduct,
    updateProduct,
    deleteProduct,
    updateProductLimit,
    updateProductPrice,
    updateProductStock,
    updateProductImage,

    addFamily,
    updateFamily,
    deleteFamily,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,

    updateDeliveryStatus,
    getTransactionsByCard,
    approveTransaction,
    cancelTransaction,

    updateSettings,

    syncTransaction,
    syncFamily
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};