// src/components/Biometric/BiometricModule.jsx
import React, { useState } from 'react';
import { useRation } from '../../contexts/RationContext';
import './BiometricModule.css';

export const BiometricModule = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const { verifyBiometric, loading, setCurrentModule } = useRation();

  const handleSelect = async (type) => {
    setSelectedType(type);
    setVerifying(true);

    try {
      const result = await verifyBiometric(type);
      if (result?.success) {
        setCurrentModule(4); // Go to Items
      } else {
        alert(result?.message || 'Verification failed');
        setSelectedType(null);
      }
    } catch (error) {
      console.error('Biometric error:', error);
      alert('An error occurred');
      setSelectedType(null);
    } finally {
      setVerifying(false);
    }
  };

  const options = [
    { id: 'fingerprint', icon: '👆', title: 'Fingerprint', desc: 'Place your finger on the scanner' },
    { id: 'iris', icon: '👁️', title: 'Iris Scan', desc: 'Look into the iris scanner' },
    { id: 'face', icon: '😊', title: 'Face Recognition', desc: 'Position your face in the frame' },
  ];

  return (
    <div className="biometric-module">
      <div className="biometric-content">
        <h1 className="biometric-title">🔐 Biometric Verification</h1>
        <p className="biometric-subtitle">Select your preferred verification method</p>

        <div className="options-grid">
          {options.map(opt => (
            <div
              key={opt.id}
              className={`option-card ${selectedType === opt.id ? 'selected' : ''} ${verifying ? 'disabled' : ''}`}
              onClick={() => !verifying && !loading && handleSelect(opt.id)}
            >
              <div className="option-icon">{opt.icon}</div>
              <h3 className="option-title">{opt.title}</h3>
              <p className="option-desc">{opt.desc}</p>
              {verifying && selectedType === opt.id && (
                <div className="option-spinner"></div>
              )}
            </div>
          ))}
        </div>

        {verifying && (
          <div className="verifying-message">
            <div className="spinner"></div>
            <p>Verifying {selectedType}...</p>
          </div>
        )}

        <button
          className="back-button"
          onClick={() => setCurrentModule(2)}
          disabled={verifying}
        >
          ← Back to Family Selection
        </button>
      </div>
    </div>
  );
};

export default BiometricModule;