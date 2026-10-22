// src/components/Payment/PaymentMethods.jsx
import React from 'react';
import './PaymentMethods.css';

export const PaymentMethods = ({ selected, onSelect, loading }) => {
  const methods = [
    { id: 'card', icon: '💳', label: 'Credit / Debit Card' },
    { id: 'upi', icon: '📱', label: 'UPI' },
    { id: 'cash', icon: '💵', label: 'Cash' },
  ];

  return (
    <div className="payment-methods">
      <h3>Payment Method</h3>
      <div className="methods-grid">
        {methods.map(method => (
          <div
            key={method.id}
            className={`method-card ${selected === method.id ? 'selected' : ''} ${loading ? 'disabled' : ''}`}
            onClick={() => !loading && onSelect(method.id)}
          >
            <span className="method-icon">{method.icon}</span>
            <span className="method-label">{method.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;