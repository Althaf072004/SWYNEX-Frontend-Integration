import React, { useState } from 'react';
import { QuantitySelector } from './QuantitySelector';

export const RationItem = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(0);

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(0, Math.min(item.maxQty, prev + change)));
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      onAddToCart(item.id, quantity);
      setQuantity(0);
    }
  };

  return (
    <div className="ration-item">
      <div className="item-icon">{item.icon}</div>
      <h3>{item.name}</h3>
      <QuantitySelector 
        item={item}
        quantity={quantity}
        onQuantityChange={handleQuantityChange}
      />
      <div className="price-tag">₹{item.pricePerUnit}/{item.unit}</div>
      <button 
        className="add-cart-btn"
        onClick={handleAddToCart}
        disabled={quantity === 0}
        type="button"
      >
        {quantity === 0 ? 'Select Quantity' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default RationItem;