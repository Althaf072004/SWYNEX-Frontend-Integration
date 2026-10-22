// src/components/Login/LoginCard.jsx
import React from 'react';
import './LoginCard.css';

export const LoginCard = ({ children }) => {
  // Background image from public folder – full screen, no white background
  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/logo.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="login-card" style={backgroundStyle}>
      <div className="logo">🛒</div>
      {children}
    </div>
  );
};

export default LoginCard;