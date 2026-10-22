// src/components/Payment/PaymentModule.jsx
import React, { useState, useEffect } from 'react';
import { useRation } from '../../contexts/RationContext';
import './PaymentModule.css';

export const PaymentModule = () => {
  const { 
    userTransactions,
    setCurrentModule,
    completeTransaction,
    loading,
    cart,
    currentMember,
    currentCard,
    products,
    setSelectedPayment
  } = useRation();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: currentMember?.name?.toUpperCase() || ''
  });
  const [saveCard, setSaveCard] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [eligibility, setEligibility] = useState({ canPurchase: true, message: '' });

  // Check monthly purchase eligibility
  useEffect(() => {
    if (!userTransactions) {
      setEligibility({ canPurchase: true, message: '' });
      return;
    }
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const hasTransactionThisMonth = userTransactions.some(tx => {
      const txDate = new Date(tx.created_at || tx.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });

    if (hasTransactionThisMonth) {
      setEligibility({
        canPurchase: false,
        message: '⏳ You have already made a purchase this month. Please wait until next month to shop again.'
      });
    } else {
      setEligibility({ canPurchase: true, message: '' });
    }
  }, [userTransactions]);

  const cartItems = Object.entries(cart).map(([id, quantity]) => {
    const product = products.find(p => p.id.toString() === id.toString());
    return {
      id,
      name: product?.name || 'Unknown',
      price: product?.price || 0,
      unit: product?.unit || '',
      quantity
    };
  }).filter(item => item.quantity > 0);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subsidy = 50;
  const total = subtotal - subsidy;

  const handlePayment = async () => {
    if (isProcessing || loading) return;
    setErrorMessage('');

    // Client‑side validation
    if (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name)) {
      setErrorMessage('Please fill all card details');
      return;
    }
    if (paymentMethod === 'upi' && !upiId) {
      setErrorMessage('Please enter UPI ID');
      return;
    }

    setIsProcessing(true);
    setSelectedPayment(paymentMethod);

    try {
      const result = await completeTransaction();
      if (result?.success) {
        setCurrentModule(7); // Go to receipt
      } else {
        setErrorMessage(result?.message || 'Transaction failed');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error.message || 'Network error');
      setIsProcessing(false);
    }
  };

  // If not eligible to purchase, show message and redirect button
  if (!eligibility.canPurchase) {
    return (
      <div className="payment-module">
        <div className="payment-glass">
          <div className="payment-header">
            <h1 className="payment-title">✨ Secure Checkout</h1>
            <button className="back-link" onClick={() => setCurrentModule(5)}>← Back to Cart</button>
          </div>
          <div className="info-banner" style={{ background: '#FFF3CD', color: '#856404', borderColor: '#FFE58F' }}>
            {eligibility.message}
          </div>
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              className="pay-button"
              onClick={() => setCurrentModule(8)}
              style={{ width: 'auto', padding: '12px 30px' }}
            >
              View Transaction Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Eligible – show full payment form
  return (
    <div className="payment-module">
      <div className="payment-glass">
        <div className="payment-header">
          <h1 className="payment-title">✨ Secure Checkout</h1>
          <button className="back-link" onClick={() => setCurrentModule(5)}>← Back to Cart</button>
        </div>

        {errorMessage && (
          <div className="error-banner">
            ❌ {errorMessage}
          </div>
        )}

        <div className="payment-grid">
          {/* Order Summary */}
          <div className="summary-card">
            <h2 className="section-title">Order Summary</h2>
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-row">
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">{item.quantity} {item.unit}</span>
                  <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="total-line">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="total-line subsidy">
                <span>Subsidy</span>
                <span>-₹{subsidy.toFixed(2)}</span>
              </div>
              <div className="total-line grand">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="payment-card">
            <h2 className="section-title">Payment Method</h2>
            <div className="method-tabs">
              <button
                className={`method-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
                disabled={isProcessing}
              >
                <span className="method-icon">💳</span> Card
              </button>
              <button
                className={`method-tab ${paymentMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('upi')}
                disabled={isProcessing}
              >
                <span className="method-icon">📱</span> UPI
              </button>
              <button
                className={`method-tab ${paymentMethod === 'cash' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cash')}
                disabled={isProcessing}
              >
                <span className="method-icon">💵</span> Cash
              </button>
            </div>

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <div className="payment-form">
                <div className="input-group">
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    placeholder=" "
                    disabled={isProcessing}
                  />
                  <label>Card Number</label>
                </div>
                <div className="form-row">
                  <div className="input-group half">
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      placeholder=" "
                      disabled={isProcessing}
                    />
                    <label>MM/YY</label>
                  </div>
                  <div className="input-group half">
                    <input
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      placeholder=" "
                      disabled={isProcessing}
                    />
                    <label>CVV</label>
                  </div>
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value.toUpperCase()})}
                    placeholder=" "
                    disabled={isProcessing}
                  />
                  <label>Cardholder Name</label>
                </div>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    disabled={isProcessing}
                  />
                  <span>Save card for next time</span>
                </label>
              </div>
            )}

            {/* UPI Form */}
            {paymentMethod === 'upi' && (
              <div className="payment-form">
                <div className="input-group">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder=" "
                    disabled={isProcessing}
                  />
                  <label>UPI ID</label>
                </div>
              </div>
            )}

            {/* Cash */}
            {paymentMethod === 'cash' && (
              <div className="payment-form cash-note">
                <p>Pay <strong>₹{total.toFixed(2)}</strong> in cash at the counter.</p>
              </div>
            )}

            <button
              className="pay-button"
              onClick={handlePayment}
              disabled={isProcessing || loading}
            >
              {isProcessing || loading ? '⏳ Processing...' : `Pay ₹${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};