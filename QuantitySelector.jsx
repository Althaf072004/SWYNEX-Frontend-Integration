import React from 'react';

export const QuantitySelector = ({ item, quantity = 0, onQuantityChange }) => {
  const displayQuantity = quantity || 0;
  const decimals = item.increment === 0.25 ? 2 : 0;

  return (
    <div className="qty-selector">
      <button 
        className="qty-btn" 
        onClick={() => onQuantityChange(-item.increment)}
        type="button"
      >-</button>
      <div className="qty-display">
        {displayQuantity.toFixed(decimals)} {item.unit}
      </div>
      <button 
        className="qty-btn" 
        onClick={() => onQuantityChange(item.increment)}
        type="button"
      >+</button>
    </div>
  );
};

export default QuantitySelector;