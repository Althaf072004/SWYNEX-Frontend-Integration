import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { useRation } from '../../contexts/RationContext';

export const AdminSidebar = () => {
  const { adminUser, activeTab, setActiveTab, adminLogout } = useAdmin();
  const { setCurrentModule } = useRation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'families', label: 'Families', icon: '👨‍👩‍👧‍👦' },
    { id: 'transactions', label: 'Transactions', icon: '💰' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const handleLogout = () => {
    adminLogout();
    setCurrentModule(1);
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏛️</div>
        <h2>PDS Admin</h2>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
          {adminUser?.email || 'admin@ration.gov'}
        </p>
      </div>

      <div className="admin-sidebar-nav">
        {navItems.map(item => (
          <div
            key={item.id}
            className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="admin-nav-icon">{item.icon}</span>
            <span className="admin-nav-text">{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <div className="admin-nav-item" onClick={handleLogout}>
          <span className="admin-nav-icon">🚪</span>
          <span className="admin-nav-text">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;