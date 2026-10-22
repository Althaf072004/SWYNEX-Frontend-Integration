// src/hooks/useRationSystem.js
import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

export const useRationSystem = () => {
  const [currentModule, setCurrentModule] = useState(1);
  const [currentCard, setCurrentCard] = useState('');
  const [currentMember, setCurrentMember] = useState(null);
  const [cart, setCart] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedBiometric, setSelectedBiometric] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [transactionId, setTransactionId] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [userTransactions, setUserTransactions] = useState([]);
  
  const [families, setFamilies] = useState({});
  const [products, setProducts] = useState([]);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await userService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  // Verify card (login)
  const verifyCard = async (cardNumber) => {
    setLoading(true);
    try {
      const result = await userService.verifyCard(cardNumber);
      if (result.success) {
        setCurrentCard(cardNumber);
        // Store family data
        setFamilies(prev => ({ ...prev, [cardNumber]: result.family }));
        
        // Check if there are any transactions for this card
        const txs = await userService.getTransactionsByCard(cardNumber);
        setUserTransactions(txs);
        const latest = txs[0];
        if (latest) {
          setTransactionStatus(latest.approval_status);
          setCurrentModule(8); // Go to status page if there's a transaction
        } else {
          setCurrentModule(2); // No transactions – go to family selection
        }
        return { success: true, family: result.family };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Invalid card number' };
    } finally {
      setLoading(false);
    }
  };

  const selectMember = (member) => {
    setCurrentMember(member);
    setCurrentModule(3);
  };

  const verifyBiometric = async (type) => {
    setLoading(true);
    try {
      const result = await userService.verifyBiometric(currentCard, currentMember?.id, type);
      if (result.success) {
        setSelectedBiometric(type);
        setCurrentModule(4);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (productId, quantity = 1) => {
    setCart(prev => {
      const newCart = { ...prev, [productId]: (prev[productId]||0) + quantity };
      const newTotal = Object.entries(newCart).reduce((s, [id, qty]) => {
        const product = products.find(p => p.id == id);
        return s + (product?.price || 0) * qty;
      }, 0);
      setTotalAmount(newTotal);
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[productId];
      const newTotal = Object.entries(newCart).reduce((s, [id, qty]) => {
        const product = products.find(p => p.id == id);
        return s + (product?.price || 0) * qty;
      }, 0);
      setTotalAmount(newTotal);
      return newCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) removeFromCart(productId);
    else {
      setCart(prev => {
        const newCart = { ...prev, [productId]: quantity };
        const newTotal = Object.entries(newCart).reduce((s, [id, qty]) => {
          const product = products.find(p => p.id == id);
          return s + (product?.price || 0) * qty;
        }, 0);
        setTotalAmount(newTotal);
        return newCart;
      });
    }
  };

  const clearCart = () => {
    setCart({});
    setTotalAmount(0);
  };

  const completeTransaction = async () => {
    setLoading(true);
    try {
      const transactionData = {
        cardNumber: currentCard,
        memberName: currentMember?.name,
        items: cart,
        total: totalAmount,
        paymentMethod: selectedPayment,
        biometricType: selectedBiometric
      };
      const result = await userService.createTransaction(transactionData);
      setTransactionId(result.transaction_id);
      setTransactionStatus('pending');
      setCurrentModule(7); // Receipt
      return { success: true, transactionId: result.transaction_id, amount: totalAmount };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCurrentCard('');
    setCurrentMember(null);
    setCart({});
    setTotalAmount(0);
    setSelectedBiometric('');
    setSelectedPayment('');
    setTransactionId(null);
    setTransactionStatus('pending');
    setCurrentModule(1);
  };

  return {
    currentModule, setCurrentModule,
    currentCard, setCurrentCard,
    currentMember, setCurrentMember,
    cart, totalAmount,
    selectedBiometric, setSelectedBiometric,
    selectedPayment, setSelectedPayment,
    transactionId, transactionStatus, loading, userTransactions,
    verifyCard, selectMember, verifyBiometric,
    addToCart, removeFromCart, updateQuantity, clearCart,
    completeTransaction, reset,
    families, products
  };
};