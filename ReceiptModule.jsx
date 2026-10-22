// src/components/Receipt/ReceiptModule.jsx
import React, { useRef } from 'react';
import { useRation } from '../../contexts/RationContext';
import './ReceiptModule.css';

export const ReceiptModule = () => {
  const { 
    currentCard, 
    currentMember, 
    cart, 
    totalAmount, 
    transactionId,
    transactionStatus = 'pending',
    setCurrentModule,
  } = useRation();

  const receiptRef = useRef(null);

  // Get cart items
  const cartItems = [];
  const productMap = {
    '1': { name: 'Premium Rice', price: 35, unit: 'kg' },
    '2': { name: 'Whole Wheat', price: 25, unit: 'kg' },
    '3': { name: 'Refined Sugar', price: 40, unit: 'kg' },
    '4': { name: 'Kerosene', price: 15, unit: 'L' }
  };

  if (cart && Object.keys(cart).length > 0) {
    Object.entries(cart).forEach(([id, quantity]) => {
      if (productMap[id] && quantity > 0) {
        cartItems.push({
          id,
          name: productMap[id].name,
          price: productMap[id].price,
          quantity: quantity,
          unit: productMap[id].unit,
          total: productMap[id].price * quantity
        });
      }
    });
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const subsidy = 50;
  const total = subtotal - subsidy;
  const date = new Date();
  const receiptNumber = transactionId || `TXN${date.getTime()}`;

  // Status badge styling
  const getStatusColor = () => {
    switch(transactionStatus) {
      case 'approved': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#ff9800';
    }
  };

  const getStatusIcon = () => {
    switch(transactionStatus) {
      case 'approved': return '✅';
      case 'cancelled': return '❌';
      default: return '⏳';
    }
  };

  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to download receipt');
      return;
    }

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${receiptNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
          .receipt-container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; }
          .header { text-align: center; border-bottom: 2px dashed #1e3c72; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { color: #1e3c72; margin: 10px 0 5px; font-size: 24px; }
          .receipt-id { background: #f0f0f0; padding: 10px; border-radius: 8px; text-align: center; margin-bottom: 20px; font-family: monospace; }
          .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; color: white; font-weight: 600; margin-bottom: 20px; }
          .info-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .info-item { display: flex; flex-direction: column; }
          .info-label { font-size: 12px; color: #666; }
          .info-value { font-size: 16px; font-weight: 600; color: #1e3c72; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #1e3c72; color: white; padding: 10px; text-align: left; }
          td { padding: 8px; border-bottom: 1px solid #eee; }
          .total-section { background: #e8f5e9; padding: 15px; border-radius: 8px; margin-top: 20px; }
          .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
          .grand-total { font-size: 20px; font-weight: 700; color: #2e7d32; border-top: 2px solid #2e7d32; margin-top: 10px; padding-top: 10px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          @media print { body { background: white; } .receipt-container { box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div style="font-size:40px;">🇮🇳</div>
            <h1>PDS Smart Card System</h1>
            <div>Government of Tamil Nadu</div>
          </div>
          <div class="receipt-id">Receipt No: ${receiptNumber}</div>
          <div class="status-badge" style="background-color: ${getStatusColor()}">
            ${getStatusIcon()} ${transactionStatus.toUpperCase()}
          </div>
          <div class="info-grid">
            <div class="info-item"><span class="info-label">Smart Card</span><span class="info-value">${currentCard || 'TN333472120886'}</span></div>
            <div class="info-item"><span class="info-label">Member</span><span class="info-value">${currentMember?.name || 'Mohamed Ali'}</span></div>
            <div class="info-item"><span class="info-label">Date</span><span class="info-value">${date.toLocaleDateString()}</span></div>
            <div class="info-item"><span class="info-label">Time</span><span class="info-value">${date.toLocaleTimeString()}</span></div>
          </div>
          <table>
            <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>
              ${cartItems.map(item => `
                <tr><td>${item.name}</td><td>${item.quantity}${item.unit}</td><td>₹${item.price}</td><td>₹${item.total}</td></tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total-section">
            <div class="total-row"><span>Subtotal:</span><span>₹${subtotal}</span></div>
            <div class="total-row"><span>Subsidy:</span><span style="color:#2e7d32;">-₹${subsidy}</span></div>
            <div class="total-row grand-total"><span>Total:</span><span>₹${total}</span></div>
          </div>
          <div class="footer">
            <p>** Computer generated receipt **</p>
            <p>Helpline: 1967 | support@tnpds.gov.in</p>
          </div>
        </div>
        <div style="text-align:center; margin-top:20px;">
          <button onclick="window.print()" style="padding:10px 20px; background:#1e3c72; color:white; border:none; border-radius:8px; cursor:pointer;">🖨️ Print</button>
          <button onclick="window.close()" style="padding:10px 20px; background:#6c757d; color:white; border:none; border-radius:8px; cursor:pointer; margin-left:10px;">Close</button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  return (
    <div className="receipt-module" ref={receiptRef}>
      <div className="receipt-card">
        <div className="receipt-header">
          <div className="header-icon">🧾</div>
          <h2>Payment Successful!</h2>
          <p>Your transaction has been completed</p>
        </div>

        {/* Status Badge */}
        <div className="status-badge" style={{ 
          backgroundColor: getStatusColor(),
          color: 'white',
          padding: '10px 20px',
          borderRadius: '40px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
          fontWeight: '600'
        }}>
          <span>{getStatusIcon()}</span>
          <span>Transaction Status: {transactionStatus.toUpperCase()}</span>
        </div>

        {/* Receipt Preview */}
        <div className="receipt-preview">
          <div className="preview-header">
            <span className="govt-logo">🇮🇳</span>
            <h3>PDS Smart Card System</h3>
            <p>Government of Tamil Nadu</p>
          </div>

          <div className="receipt-details">
            <div className="detail-row">
              <span>Receipt No:</span>
              <strong>{receiptNumber}</strong>
            </div>
            <div className="detail-row">
              <span>Date:</span>
              <span>{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>
            </div>
            <div className="detail-row">
              <span>Smart Card:</span>
              <span>{currentCard || 'TN333472120886'}</span>
            </div>
            <div className="detail-row">
              <span>Member:</span>
              <span>{currentMember?.name || 'Mohamed Ali'}</span>
            </div>
          </div>

          <div className="receipt-items">
            <h4>Items Purchased</h4>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}{item.unit}</td>
                    <td>₹{item.price}</td>
                    <td>₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="receipt-total">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="total-line subsidy">
              <span>Subsidy:</span>
              <span>-₹{subsidy}</span>
            </div>
            <div className="total-line grand">
              <span>Total Amount:</span>
              <span>₹{total}</span>
            </div>
          </div>

          <div className="receipt-footer">
            <p>** This is a computer generated receipt **</p>
            <p>Helpline: 1967 | support@tnpds.gov.in</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="receipt-actions">
          <button className="btn-download" onClick={handleDownload}>
            <span className="btn-icon">🖨️</span> Print / Save as PDF
          </button>
          <button className="btn-status" onClick={() => setCurrentModule(8)}>
            <span className="btn-icon">📊</span> Track Status
          </button>
          <button className="btn-new" onClick={() => setCurrentModule(1)}>
            <span className="btn-icon">🔄</span> New Transaction
          </button>
        </div>

        <div className="receipt-note">
          <span className="note-icon">ℹ️</span>
          <span>A copy of this receipt has been sent to your registered mobile</span>
        </div>
      </div>
    </div>
  );
};