import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import AnalyticsReports from './AnalyticsReports';

export const AnalyticsDashboard = () => {
  const { analytics, transactions, products } = useAdmin();

  // Calculate additional metrics
  const totalRevenue = transactions
    .filter(t => t.deliveryStatus === 'delivered')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const monthlyRevenue = transactions
    .filter(t => {
      const date = new Date(t.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear() &&
             t.deliveryStatus === 'delivered';
    })
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const topProducts = {};
  transactions.forEach(t => {
    Object.entries(t.items).forEach(([id, qty]) => {
      topProducts[id] = (topProducts[id] || 0) + qty;
    });
  });

  const sortedProducts = Object.entries(topProducts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([id, qty]) => ({
      product: products.find(p => p.id === id),
      quantity: qty
    }));

  return (
    <div className="admin-dashboard-section">
      <h2>📊 Analytics Dashboard</h2>

      {/* Key Metrics */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="dashboard-card-icon">💰</div>
          <h3>Total Revenue (All Time)</h3>
          <div className="value">₹{totalRevenue.toFixed(2)}</div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-icon">📅</div>
          <h3>Monthly Revenue</h3>
          <div className="value">₹{monthlyRevenue.toFixed(2)}</div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-icon">📦</div>
          <h3>Total Transactions</h3>
          <div className="value">{analytics.totalTransactions || 0}</div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-icon">⏳</div>
          <h3>Pending Deliveries</h3>
          <div className="value">{analytics.pendingDeliveries || 0}</div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-icon">👨‍👩‍👧‍👦</div>
          <h3>Registered Families</h3>
          <div className="value">{analytics.totalFamilies || 0}</div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-icon">⚠️</div>
          <h3>Low Stock Products</h3>
          <div className="value">{analytics.lowStockProducts || 0}</div>
        </div>
      </div>

      {/* Today's Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '25px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '25px', 
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow)'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Today's Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span>Transactions Today:</span>
            <strong>{analytics.todayTransactions || 0}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span>Revenue Today:</span>
            <strong style={{ color: 'var(--green-primary)' }}>
              ₹{transactions
                .filter(t => {
                  const today = new Date().toDateString();
                  return new Date(t.date).toDateString() === today;
                })
                .reduce((sum, t) => sum + (t.amount || 0), 0).toFixed(2)}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Completed Deliveries:</span>
            <strong>
              {transactions.filter(t => {
                const today = new Date().toDateString();
                return new Date(t.deliveredAt || '').toDateString() === today;
              }).length}
            </strong>
          </div>
        </div>

        {/* Top Products */}
        <div style={{ 
          background: 'white', 
          padding: '25px', 
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow)'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Top Selling Products</h3>
          {sortedProducts.length > 0 ? (
            sortedProducts.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '15px',
                paddingBottom: '10px',
                borderBottom: '1px solid #eee'
              }}>
                <span>
                  {index + 1}. {item.product?.name || 'Unknown'}
                </span>
                <strong>{item.quantity} {item.product?.unit}</strong>
              </div>
            ))
          ) : (
            <p style={{ color: '#666', textAlign: 'center' }}>No sales data yet</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-table-container">
        <h3 style={{ marginBottom: '20px' }}>Recent Transactions</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Smart Card</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.card}</td>
                <td style={{ color: 'var(--green-primary)', fontWeight: '600' }}>
                  {t.total}
                </td>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge status-${t.deliveryStatus}`}>
                    {t.deliveryStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AnalyticsReports;