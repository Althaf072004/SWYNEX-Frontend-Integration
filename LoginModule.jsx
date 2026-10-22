// src/components/Login/LoginModule.jsx
import React, { useState } from 'react';
import { useRation } from '../../contexts/RationContext';

export const LoginModule = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [shake, setShake] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  const { verifyCard, loading } = useRation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumber) {
      setMessage({ text: '❌ Please enter a smart card number', type: 'error' });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    const result = await verifyCard(cardNumber);
    if (result?.success) {
      setMessage({ text: '✅ Login Successful!', type: 'success' });
    } else {
      setMessage({ text: `❌ ${result?.message || 'Invalid card number'}`, type: 'error' });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
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
    maxWidth: '500px',
    width: '100%',
    padding: '40px 30px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const logoCircleStyle = {
    width: '120px',
    height: '120px',
    background: '#C8E6C9',
    borderRadius: '50%',
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3.5rem',
    boxShadow: '0 4px 20px rgba(46,125,50,0.3)',
    border: '4px solid white',
  };

  const headingStyle = {
    color: '#1B5E20',
    fontSize: '1.8rem',
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
  };

  const messageStyle = {
    padding: '12px 15px',
    borderRadius: '8px',
    marginTop: '20px',
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
    marginTop: '25px',
    padding: '15px',
    background: '#E8F5E8',
    borderRadius: '10px',
    color: '#1B5E20',
    width: '100%',
    boxSizing: 'border-box',
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
        <div style={logoCircleStyle}>🛒</div>
        <h1 style={headingStyle}>PDS Smart Card System</h1>
        <p style={subheadingStyle}>Government of Tamil Nadu - Public Distribution System</p>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="Enter Smart Card Number"
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
            {loading ? '⏳ Verifying...' : 'Login with Smart Card'}
          </button>
        </form>

        {message.text && (
          <div style={message.type === 'success' ? successMsgStyle : errorMsgStyle}>
            {message.text}
          </div>
        )}

        <div style={demoStyle}>
          <p style={{ margin: '5px 0' }}>
            Demo Card: <strong>TN333472120886</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModule;