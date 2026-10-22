import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';

export const DashboardOverview = () => {
  const { analytics, products, transactions, families } = useAdmin();

  // Ensure transactions is an array before using .slice
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const recentTransactions = safeTransactions.slice(0, 5);

  const stats = [
    {
      title: 'Total Smart Cards',
      value: analytics?.totalCards || Object.keys(families || {}).length || 0,
      icon: '🎫',
      color: '#2e7d32',
      bgColor: '#e8f5e9'
    },
    {
      title: 'Total Products',
      value: products?.length || 0,
      icon: '📦',
      color: '#2e7d32',
      bgColor: '#e8f5e9'
    },
    {
      title: 'Transactions',
      value: safeTransactions.length,
      icon: '💰',
      color: '#2e7d32',
      bgColor: '#e8f5e9'
    },
    {
      title: 'Active Families',
      value: Object.keys(families || {}).length || 0,
      icon: '👨‍👩‍👧',
      color: '#2e7d32',
      bgColor: '#e8f5e9'
    }
  ];

  return (
    <div className="admin-dashboard-overview">
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'white',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.2s',
              hover: { transform: 'translateY(-2px)' }
            }}
          >
            <div>
              <p style={{ color: '#666', marginBottom: '8px', fontSize: '0.95rem' }}>
                {stat.title}
              </p>
              <h2 style={{ margin: 0, fontSize: '2rem', color: stat.color }}>
                {stat.value}
              </h2>
            </div>
            <div style={{
              background: stat.bgColor,
              padding: '15px',
              borderRadius: '12px',
              fontSize: '2rem'
            }}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div style={{
        background: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: 0, color: '#2e7d32' }}>Recent Transactions</h3>
          <span style={{
            background: '#e8f5e9',
            color: '#2e7d32',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            Last 5 transactions
          </span>
        </div>

        {safeTransactions.length > 0 ? (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Card</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px', fontFamily: 'monospace' }}>{t.id}</td>
                  <td style={{ padding: '12px' }}>{t.card_number || t.card}</td>
                  <td style={{ padding: '12px', fontWeight: '600', color: '#2e7d32' }}>₹{t.total}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      background: t.approval_status === 'approved' ? '#e8f5e9' : '#fff3cd',
                      color: t.approval_status === 'approved' ? '#2e7d32' : '#856404',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.85rem'
                    }}>
                      {t.approval_status || 'pending'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#666', fontSize: '0.9rem' }}>
                    {new Date(t.created_at || t.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            No transactions yet
          </div>
        )}
      </div>
    </div>
  );
};