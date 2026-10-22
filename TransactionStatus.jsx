// src/components/Status/TransactionStatus.jsx
import React from 'react';
import { useRation } from '../../contexts/RationContext';
import './TransactionStatus.css';

export const TransactionStatus = () => {
  const { 
    userTransactions, 
    setCurrentModule,
    products 
  } = useRation();

  const latestTx = userTransactions?.length > 0 
    ? [...userTransactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] 
    : null;

  const canPurchase = (() => {
    if (!latestTx) return true;
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const approved = userTransactions?.filter(t => t.approval_status === 'approved') || [];
    const lastApproved = approved.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    if (!lastApproved) return true;
    return lastApproved.createdAt?.slice(0, 7) !== currentMonth;
  })();

  const getApprovalIcon = (status) => {
    if (!status) return '⏳';
    switch(status) {
      case 'approved': return '✅';
      case 'cancelled': return '❌';
      default: return '⏳';
    }
  };

  const getApprovalColor = (status) => {
    if (!status) return '#ff9800';
    switch(status) {
      case 'approved': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#ff9800';
    }
  };

  const getDeliveryIcon = (deliveryStatus) => {
    if (!deliveryStatus) return '⏳';
    switch(deliveryStatus) {
      case 'delivered': return '📦✅';
      case 'dispatched': return '🚚';
      case 'processing': return '⚙️';
      default: return '⏳';
    }
  };

  const getProductName = (id) => {
    const product = products?.find(p => p.id == id);
    return product ? product.name : `Item ${id}`;
  };

  if (!latestTx) {
    return (
      <div className="transaction-fullscreen">
        <div className="transaction-content">
          <p className="no-transaction">No transaction found.</p>
          <button className="btn-home" onClick={() => setCurrentModule(1)}>🏠 Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-fullscreen">
      <div className="transaction-content">
        {/* Two‑column grid */}
        <div className="transaction-grid">
          {/* Left column – transaction details */}
          <div className="transaction-left">
            <div className="status-badge" style={{ backgroundColor: getApprovalColor(latestTx.approval_status) }}>
              {getApprovalIcon(latestTx.approval_status)} {latestTx.approval_status?.toUpperCase() || 'PENDING'}
            </div>
            <div className="info-item">
              <span className="info-label">Transaction ID</span>
              <span className="info-value">{latestTx.transaction_id || latestTx.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Smart Card</span>
              <span className="info-value">{latestTx.card_number || latestTx.card}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Member</span>
              <span className="info-value">{latestTx.member_name || latestTx.member}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Amount</span>
              <span className="info-value">₹{latestTx.total}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Payment Method</span>
              <span className="info-value">{latestTx.payment_method || latestTx.payment}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Delivery Status</span>
              <span className="info-value">{getDeliveryIcon(latestTx.delivery_status)} {latestTx.delivery_status || 'pending'}</span>
            </div>
          </div>

          {/* Right column – Bill details */}
          <div className="transaction-right">
            <h3>🧾 Bill Details</h3>
            <table className="bill-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {latestTx.items && Object.entries(latestTx.items).map(([id, qty]) => {
                  const product = products?.find(p => p.id == id);
                  const price = product?.price || 0;
                  return (
                    <tr key={id}>
                      <td>{getProductName(id)}</td>
                      <td>{qty} {product?.unit || ''}</td>
                      <td>₹{price}</td>
                      <td>₹{price * qty}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" style={{ textAlign: 'right' }}><strong>Total:</strong></td>
                  <td><strong>₹{latestTx.total}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Bottom section – monthly eligibility & buttons */}
        <div className="transaction-bottom">
          <div className="eligibility-section">
            <h4>Monthly Purchase Eligibility</h4>
            {canPurchase ? 
              <div className="eligible">✅ You can make a new purchase this month.</div> : 
              <div className="not-eligible">⏳ You have already made a purchase this month. Next purchase allowed from next month.</div>
            }
          </div>

          <div className="status-actions">
            <button className="btn-home" onClick={() => setCurrentModule(1)}>🏠 Home</button>
            {latestTx?.approval_status === 'approved' && canPurchase && (
              <button className="btn-new" onClick={() => setCurrentModule(2)}>➕ New Purchase</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};