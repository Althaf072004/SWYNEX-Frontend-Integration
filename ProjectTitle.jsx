// src/components/Layout/ProjectTitle.jsx
import React from 'react';

export const ProjectTitle = () => {
  return (
    <div className="project-title" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '20px',
      padding: '20px 0',
      background: 'linear-gradient(135deg, var(--green-primary), var(--green-secondary))',
      color: 'white',
      borderRadius: 'var(--border-radius)',
      boxShadow: 'var(--shadow)'
    }}>
      <img src="/logo.png" alt="Logo" style={{ height: '60px' }} />
      <div>
        <h1>PDS Smart Card System</h1>
        <p>Government of Tamil Nadu - Public Distribution System</p>
      </div>
    </div>
  );
};