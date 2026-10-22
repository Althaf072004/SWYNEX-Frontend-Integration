// src/App.jsx
import React from 'react';
import { RationProvider } from './contexts/RationContext';
import { AdminProvider } from './contexts/AdminContext';
import { Container } from './components/Layout/Container';
import { ProjectTitle } from './components/Layout/ProjectTitle';
import { LoginModule } from './components/Login/LoginModule';
import { FamilyModule } from './components/Family/FamilyModule';
import { BiometricModule } from './components/Biometric/BiometricModule';
import { ItemsModule } from './components/Items/ItemsModule';
import { CartModule } from './components/Cart/CartModule';
import { PaymentModule } from './components/Payment/PaymentModule';
import { ReceiptModule } from './components/Receipt/ReceiptModule';
import { TransactionStatus } from './components/Status/TransactionStatus';
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { useRation } from './contexts/RationContext';
import './styles/admin.css';
import ApiStatus from './components/ApiStatus';

const AppContent = () => {
  const { currentModule, setCurrentModule, loading } = useRation();

  // Debug logging
  console.log('AppContent - Current Module:', currentModule);
  console.log('AppContent - Loading:', loading);

  const renderModule = () => {
    switch (currentModule) {
      case 1:
        return <LoginModule />;
      case 2:
        return <FamilyModule />;
      case 3:
        return <BiometricModule />;
      case 4:
        return <ItemsModule />;
      case 5:
        return <CartModule />;
      case 6:
        return <PaymentModule />;
      case 7:
        return <ReceiptModule />;
      case 8:
        return <TransactionStatus />;
      case 9:
        return <AdminLogin />;
      case 10:
        return <AdminDashboard />;
      default:
        return <LoginModule />;
    }
  };

  // Show loading state if needed
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid rgba(255,255,255,0.3)',
          borderTopColor: 'white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Container>
      {/* Show ProjectTitle only on modules 1,2,3,8 (Login, Family, Biometric, TransactionStatus) */}
      {[1, 2, 3, 8].includes(currentModule) && <ProjectTitle />}
      
      {renderModule()}
      <ApiStatus />
      
      {/* Admin Login Button - Only show on user login screen (module 1) */}
      {currentModule === 1 && (
        <div style={{ 
          position: 'fixed', 
          bottom: '30px', 
          right: '30px',
          zIndex: 1000
        }}>
          <button
            onClick={() => setCurrentModule(9)}
            style={{
              padding: '15px 25px',
              background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>👨‍💼</span>
            Admin Portal
          </button>
        </div>
      )}
    </Container>
  );
};

const App = () => {
  return (
    <RationProvider>
      <AdminProvider>
        <AppContent />
      </AdminProvider>
    </RationProvider>
  );
};

export default App;