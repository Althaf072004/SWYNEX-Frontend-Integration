// src/components/Admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { useRation } from '../../contexts/RationContext';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [shake, setShake] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const { adminLogin, loading } = useAdmin();
  const { setCurrentModule } = useRation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await adminLogin(username, password);

    if (result?.success) {
      setMessage({ text: '✅ Admin Login Successful! Redirecting to Dashboard...', type: 'success' });
      setTimeout(() => setCurrentModule(10), 2000);
    } else {
      setMessage({ text: `❌ ${result?.message || 'Invalid credentials'}`, type: 'error' });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleBackToUserLogin = () => {
    setCurrentModule(1);
  };

  // Full‑screen container styles
  const containerStyle = {
    width: '100vw',
    minHeight: '100vh',
    margin: 0,
    padding: '20px',
    boxSizing: 'border-box',
    backgroundImage: logoError ? 'none' : `url(${process.env.PUBLIC_URL}/logo.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: logoError ? '#2E7D32' : 'transparent', // fallback green
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  // Dark overlay for readability
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  };

  // Content card styles
  const cardStyle = {
    position: 'relative',
    zIndex: 2,
    maxWidth: '450px',
    width: '100%',
    padding: '50px 40px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const logoStyle = {
    fontSize: '4rem',
    marginBottom: '20px',
  };

  const headingStyle = {
    color: '#1B5E20',
    fontSize: '2rem',
    marginBottom: '10px',
  };

  const subheadingStyle = {
    color: '#666',
    marginBottom: '30px',
    fontSize: '1rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '15px 20px',
    border: '2px solid #C8E6C9',
    borderRadius: '12px',
    fontSize: '16px',
    marginBottom: '15px',
    transition: 'all 0.3s',
    boxSizing: 'border-box',
  };

  const buttonStyle = {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
    opacity: loading ? 0.6 : 1,
    marginBottom: '15px',
  };

  const messageStyle = {
    padding: '12px 15px',
    borderRadius: '8px',
    marginTop: '10px',
    fontWeight: 'bold',
    borderLeft: '4px solid',
    width: '100%',
    boxSizing: 'border-box',
  };

  const successMsgStyle = {
    ...messageStyle,
    background: '#C8E6C9',
    color: '#1B5E20',
    borderLeftColor: '#4CAF50',
  };

  const errorMsgStyle = {
    ...messageStyle,
    background: '#FFEBEE',
    color: '#C62828',
    borderLeftColor: '#C62828',
  };

  const demoStyle = {
    marginTop: '20px',
    padding: '15px',
    background: '#E8F5E8',
    borderRadius: '10px',
    color: '#1B5E20',
    width: '100%',
    boxSizing: 'border-box',
  };

  const backButtonStyle = {
    marginTop: '20px',
    background: 'transparent',
    border: 'none',
    color: '#4CAF50',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s',
  };

  const shakeAnimation = {
    animation: 'shake 0.5s ease-in-out',
  };

  // Inject keyframes for shake animation
  const styleElement = (
    <style>{`
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }
    `}</style>
  );

  return (
    <div style={containerStyle}>
      {styleElement}
      <div style={overlayStyle}></div>
      <div style={cardStyle}>
        <div style={logoStyle}>👨‍💼</div>
        <h1 style={headingStyle}>Admin Portal</h1>
        <p style={subheadingStyle}>Government of Tamil Nadu - PDS Administration</p>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Admin Email"
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
            onBlur={(e) => e.target.style.borderColor = '#C8E6C9'}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
            onBlur={(e) => e.target.style.borderColor = '#C8E6C9'}
          />
          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? '⏳ Verifying...' : 'Access Admin Panel'}
          </button>
        </form>

        {message.text && (
          <div style={message.type === 'success' ? successMsgStyle : errorMsgStyle}>
            {message.text}
          </div>
        )}

        <div style={demoStyle}>
          <p style={{ margin: '5px 0' }}>Username: <strong>admin@ration.gov</strong></p>
          <p style={{ margin: '5px 0' }}>Password: <strong>Admin@123</strong></p>
        </div>

        <button
          onClick={handleBackToUserLogin}
          style={backButtonStyle}
          onMouseEnter={(e) => e.target.style.color = '#1B5E20'}
          onMouseLeave={(e) => e.target.style.color = '#4CAF50'}
        >
          ← Back to User Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;