// src/components/Cart/CartItem.jsx
import React from 'react';
import './CartItem.css';

export const CartItem = ({ item, onUpdateQuantity, onRemove, loading }) => {
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'inline';
  };

  return (
    <div className="cart-item">
      <div className="item-image">
        {item.image && item.image.startsWith('data:') ? (
          <>
            <img
              src={item.image}
              alt={item.name}
              onError={handleImageError}
            />
            <span className="item-emoji" style={{ display: 'none' }}>📦</span>
          </>
        ) : (
          <span className="item-emoji">{item.image}</span>
        )}
      </div>
      <div className="item-details">
        <h3>{item.name}</h3>
        <p>₹{item.price}/{item.unit}</p>
      </div>
      <div className="item-quantity">
        <button
          className="qty-btn"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={loading}
          aria-label="Decrease quantity"
        >−</button>
        <span className="qty-value">{item.quantity}</span>
        <button
          className="qty-btn"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          disabled={loading}
          aria-label="Increase quantity"
        >+</button>
      </div>
      <div className="item-total">
        ₹{(item.price * item.quantity).toFixed(2)}
      </div>
      <button
        className="remove-btn"
        onClick={() => onRemove(item.id)}
        disabled={loading}
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;