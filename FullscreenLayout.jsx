// src/components/Layout/FullScreenLayout.jsx
import React from 'react';

/**
 * A reusable full‑screen layout component.
 * - Fills the entire viewport (100vw, 100vh)
 * - Optional dark overlay for readability
 * - Centers its children (with flexbox)
 * - Uses fixed positioning to avoid parent constraints
 */
export const FullScreenLayout = ({ 
  children, 
  backgroundImage, 
  overlayOpacity = 0.5,
  backgroundColor = '#2E7D32' // fallback green
}) => {
  const layoutStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto',
    zIndex: 10,
  };

  const overlayStyle = overlayOpacity > 0 ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
    zIndex: 1,
  } : null;

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    maxWidth: '1200px', // adjust as needed
    padding: '20px',
  };

  return (
    <div style={layoutStyle}>
      {overlayStyle && <div style={overlayStyle}></div>}
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

export default FullScreenLayout;