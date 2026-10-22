// src/components/Admin/AdminDashboard.jsx
import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { useRation } from '../../contexts/RationContext';
import { DashboardOverview } from './DashboardOverview';
import { ProductManagement } from './ProductManagement';
import { FamilyManagement } from './FamilyManagement';
import { TransactionMonitoring } from './TransactionMonitoring';
import { AnalyticsReports } from './AnalyticsReports';
import { Settings } from './Settings';
import './AdminDashboard.css';

export const AdminDashboard = () => {
  const { adminUser, activeTab, setActiveTab, adminLogout } = useAdmin();
  const { setCurrentModule } = useRation();

  const handleLogout = () => {
    adminLogout();
    setCurrentModule(9); // back to admin login
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'products':
        return <ProductManagement />;
      case 'families':
        return <FamilyManagement />;
      case 'transactions':
        return <TransactionMonitoring />;
      case 'analytics':
        return <AnalyticsReports />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="admin-dashboard-fullscreen">
      <div className="admin-dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, <strong>{adminUser?.name || 'Administrator'}</strong>!</p>
        </div>
        <div className="admin-user-info">
          <span className="admin-role">{adminUser?.role || 'Admin'}</span>
          <p className="admin-email">{adminUser?.email || 'admin@ration.gov'}</p>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
          📊 Overview
        </button>
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
          📦 Products
        </button>
        <button className={activeTab === 'families' ? 'active' : ''} onClick={() => setActiveTab('families')}>
          👨‍👩‍👧 Families
        </button>
        <button className={activeTab === 'transactions' ? 'active' : ''} onClick={() => setActiveTab('transactions')}>
          💰 Transactions
        </button>
        <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
          📈 Analytics
        </button>
        <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
          ⚙️ Settings
        </button>
      </div>

      <div className="admin-tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;