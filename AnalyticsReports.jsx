// src/components/Admin/AnalyticsReports.jsx
import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';

export const AnalyticsReports = () => {
  const { products, families, transactions, analytics } = useAdmin();

  // Ensure we have arrays/objects
  const productsArray = Array.isArray(products) ? products : [];
  const transactionsArray = Array.isArray(transactions) ? transactions : [];
  const familiesObj = families || {};

  // Calculate basic stats safely
  const totalProducts = productsArray.length;
  const totalFamilies = Object.keys(familiesObj).length;
  const totalTransactions = transactionsArray.length;

  // Approved vs pending (safe access)
  const approvedTransactions = transactionsArray.filter(t => t.approval_status === 'approved').length;
  const pendingTransactions = transactionsArray.filter(t => t.approval_status === 'pending').length;
  const cancelledTransactions = transactionsArray.filter(t => t.approval_status === 'cancelled').length;

  // Revenue: sum of totals from approved transactions, ensure numeric
  let totalRevenue = 0;
  try {
    totalRevenue = transactionsArray
      .filter(t => t.approval_status === 'approved')
      .reduce((sum, t) => {
        const amount = typeof t.total === 'number' ? t.total : parseFloat(t.total) || 0;
        return sum + amount;
      }, 0);
  } catch (e) {
    console.error('Error calculating revenue:', e);
    totalRevenue = 0;
  }

  // Monthly purchases count (current month)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyTransactions = transactionsArray.filter(t => {
    const date = new Date(t.created_at || t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  return (
    <div className="admin-dashboard-section">
      <h2>📈 Analytics & Reports</h2>
      
      {/* Summary Cards */}
      <div className="admin-stats-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div className="stat-card">
          <h3>Total Families</h3>
          <p className="stat-number">{totalFamilies}</p>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-number">{totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p className="stat-number">{totalTransactions}</p>
        </div>
        <div className="stat-card">
          <h3>Monthly Transactions</h3>
          <p className="stat-number">{monthlyTransactions}</p>
        </div>
        <div className="stat-card">
          <h3>Approved</h3>
          <p className="stat-number" style={{ color: '#2E7D32' }}>{approvedTransactions}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number" style={{ color: '#F57C00' }}>{pendingTransactions}</p>
        </div>
        <div className="stat-card">
          <h3>Cancelled</h3>
          <p className="stat-number" style={{ color: '#C62828' }}>{cancelledTransactions}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">₹{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#1B5E20' }}>Recent Transactions</h3>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Card</th>
              <th>Member</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactionsArray.length > 0 ? (
              transactionsArray.slice(0, 5).map(tx => {
                const amount = typeof tx.total === 'number' ? tx.total : parseFloat(tx.total) || 0;
                return (
                  <tr key={tx.id}>
                    <td>{tx.transaction_id || tx.id}</td>
                    <td>{tx.card_number || tx.card}</td>
                    <td>{tx.member_name || tx.member}</td>
                    <td>₹{amount.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge status-${tx.approval_status}`}>
                        {tx.approval_status}
                      </span>
                    </td>
                    <td>{new Date(tx.created_at || tx.date).toLocaleDateString()}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No transactions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Additional analytics */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#1B5E20' }}>System Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4>Families by Ration Type</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {Object.keys(familiesObj).length > 0 ? (
                Object.entries(
                  Object.values(familiesObj).reduce((acc, f) => {
                    const type = f.ration_type || f.rationType || 'BPL';
                    acc[type] = (acc[type] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([type, count]) => (
                  <li key={type} style={{ padding: '5px 0' }}>
                    <strong>{type}:</strong> {count}
                  </li>
                ))
              ) : (
                <li>No families</li>
              )}
            </ul>
          </div>
          <div>
            <h4>Products (Stock)</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {productsArray.length > 0 ? (
                productsArray.slice(0, 5).map(p => (
                  <li key={p.id} style={{ padding: '5px 0' }}>
                    <strong>{p.name}:</strong> {p.stock} {p.unit}
                  </li>
                ))
              ) : (
                <li>No products</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;