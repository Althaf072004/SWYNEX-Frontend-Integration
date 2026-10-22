// src/components/Admin/TransactionMonitoring.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

export const TransactionMonitoring = () => {
  const { transactions, approveTransaction, cancelTransaction, updateDeliveryStatus } = useAdmin();
  const [filter, setFilter] = useState('all');
  const [searchCard, setSearchCard] = useState('');

  // Ensure transactions is an array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const filtered = safeTransactions.filter(t => {
    if (filter !== 'all' && t.approval_status !== filter) return false;
    if (searchCard && t.card_number && !t.card_number.includes(searchCard)) return false;
    return true;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return 'status-badge status-approved';
      case 'cancelled': return 'status-badge status-cancelled';
      case 'pending': return 'status-badge status-pending';
      default: return 'status-badge';
    }
  };

  const getDeliveryBadge = (deliveryStatus) => {
    switch(deliveryStatus) {
      case 'delivered': return 'status-badge status-delivered';
      case 'dispatched': return 'status-badge status-dispatched';
      case 'processing': return 'status-badge status-processing';
      default: return 'status-badge status-pending';
    }
  };

  const deliveryOptions = ['pending', 'processing', 'dispatched', 'delivered'];

  return (
    <div className="admin-dashboard-section">
      <h2>💰 Transaction Monitoring</h2>
      <div style={{ display: 'flex', gap: 20, marginBottom: 30, padding: 20, background: 'white', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)' }}>
        <div style={{ flex: 1 }}>
          <label>Filter by Status</label>
          <select className="admin-form-select" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div style={{ flex: 2 }}>
          <label>Search by Smart Card</label>
          <input className="admin-form-control" placeholder="Card number" value={searchCard} onChange={e => setSearchCard(e.target.value)} />
        </div>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Card</th>
              <th>Member</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Approval</th>
              <th>Delivery</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  No transactions found
                </td>
              </tr>
            ) : (
              filtered.map(tx => (
                <tr key={tx.id}>
                  <td><strong>{tx.transaction_id || tx.id}</strong></td>
                  <td>{tx.card_number || tx.card}</td>
                  <td>{tx.member_name || tx.member}</td>
                  <td>
                    {tx.items && Object.entries(tx.items).map(([id, q]) => (
                      <div key={id}>Item {id}: {q}</div>
                    ))}
                  </td>
                  <td><strong>₹{tx.total}</strong></td>
                  <td>{new Date(tx.created_at || tx.date).toLocaleString()}</td>
                  <td>{tx.payment_method || tx.payment}</td>
                  <td><span className={getStatusBadge(tx.approval_status)}>{tx.approval_status}</span></td>
                  <td><span className={getDeliveryBadge(tx.delivery_status)}>{tx.delivery_status}</span></td>
                  <td>
                    {tx.approval_status === 'pending' && (
                      <>
                        <button className="admin-btn admin-btn-success" onClick={() => approveTransaction(tx.id)}>Approve</button>
                        <button className="admin-btn admin-btn-danger" onClick={() => cancelTransaction(tx.id)}>Cancel</button>
                      </>
                    )}
                    {tx.approval_status === 'approved' && (
                      <select
                        value={tx.delivery_status || 'pending'}
                        onChange={(e) => updateDeliveryStatus(tx.id, e.target.value)}
                        className="admin-form-select"
                        style={{ width: '120px' }}
                      >
                        {deliveryOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};