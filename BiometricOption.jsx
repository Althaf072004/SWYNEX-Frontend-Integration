import React from 'react';

export const BiometricOption = ({ option, isSelected = false, onSelect }) => {
  return (
    <div 
      className={`biometric-option ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(option.id)}
    >
      <div className="biometric-icon">{option.icon}</div>
      <div className="biometric-title">{option.name}</div>
      <p>{option.description}</p>
    </div>
  );
};

export default BiometricOption;