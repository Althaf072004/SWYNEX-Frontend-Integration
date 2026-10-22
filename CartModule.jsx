// src/components/Cart/CartModule.jsx
import React from 'react';
import { useRation } from '../../contexts/RationContext';
import CartItem from './CartItem';
import './CartModule.css';

export const CartModule = () => {
  const { cart, products, totalAmount, updateQuantity, removeFromCart, setCurrentModule, loading } = useRation();

  // Build cart items with live product data
  const cartItems = Object.entries(cart).map(([id, quantity]) => {
    const product = products.find(p => p.id.toString() === id.toString());
    return {
      id,
      name: product?.name || 'Unknown',
      price: product?.price || 0,
      unit: product?.unit || '',
      image: product?.image || product?.icon || '📦',
      quantity
    };
  }).filter(item => item.quantity > 0);

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQty);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-module">
        <div className="empty-cart">
          <h2>🛒 Your Cart is Empty</h2>
          <p>Add some items from the shop to get started.</p>
          <button className="btn-primary" onClick={() => setCurrentModule(4)}>
            Browse Items
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subsidy = 50;
  const total = subtotal - subsidy;

  return (
    <div className="cart-module">
      <div className="cart-content">
        <h1 className="cart-title">🛒 Your Cart</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={removeFromCart}
                loading={loading}
              />
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row subsidy">
              <span>Subsidy</span>
              <span>-₹{subsidy.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => setCurrentModule(6)}
              disabled={cartItems.length === 0 || loading}
            >
              Proceed to Payment
            </button>

            <button
              className="continue-shopping-btn"
              onClick={() => setCurrentModule(4)}
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModule;