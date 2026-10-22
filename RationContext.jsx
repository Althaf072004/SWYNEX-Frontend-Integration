// src/contexts/RationContext.jsx
import React, { createContext, useContext, useEffect } from 'react';
import { useRationSystem } from '../hooks/useRationSystem';

const RationContext = createContext();

export const useRation = () => {
  const context = useContext(RationContext);
  if (!context) {
    throw new Error('useRation must be used within RationProvider');
  }
  return context;
};

export const RationProvider = ({ children }) => {
  console.log('🔥 RationProvider rendering...');
  
  // Get the entire ration system
  const rationSystem = useRationSystem();
  
  // Log the complete system
  useEffect(() => {
    console.log('📦 RationSystem initialized:', {
      currentCard: rationSystem.currentCard,
      currentModule: rationSystem.currentModule,
      familiesKeys: Object.keys(rationSystem.families || {}),
      familiesData: rationSystem.families,
      loading: rationSystem.loading
    });
  }, []);

  // Log when currentCard changes
  useEffect(() => {
    console.log('🔄 Current Card changed in RationProvider:', rationSystem.currentCard);
    if (rationSystem.currentCard) {
      console.log('👨‍👩‍👧 Family data for card:', rationSystem.families?.[rationSystem.currentCard]);
    }
  }, [rationSystem.currentCard, rationSystem.families]);

  // Create a wrapped version of completeTransaction that dispatches events
  const originalCompleteTransaction = rationSystem.completeTransaction;
  
  const wrappedCompleteTransaction = async () => {
    console.log('💰 Wrapped completeTransaction called');
    const result = await originalCompleteTransaction();
    console.log('📝 Transaction result:', result);
    
    if (result?.success) {
      // Create transaction record
      const transaction = {
        id: result.transactionId,
        card: rationSystem.currentCard,
        member: rationSystem.currentMember?.name,
        items: rationSystem.cart,
        total: `₹${rationSystem.totalAmount?.toFixed(2)}`,
        amount: rationSystem.totalAmount,
        date: new Date().toISOString(),
        payment: rationSystem.selectedPayment,
        biometric: rationSystem.selectedBiometric,
        deliveryStatus: 'pending'
      };
      
      console.log('📨 Dispatching transaction event:', transaction);
      
      // Dispatch event for AdminContext
      const event = new CustomEvent('newTransaction', { detail: transaction });
      window.dispatchEvent(event);
    }
    
    return result;
  };

  // Create enhanced system with wrapped methods
  const enhancedSystem = {
    ...rationSystem,
    completeTransaction: wrappedCompleteTransaction
  };

  console.log('✅ RationProvider providing value with families:', Object.keys(enhancedSystem.families || {}));

  return (
    <RationContext.Provider value={enhancedSystem}>
      {children}
    </RationContext.Provider>
  );
};