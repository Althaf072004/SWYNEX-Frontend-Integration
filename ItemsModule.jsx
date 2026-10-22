// src/components/Items/ItemsModule.jsx
import React, { useState, useEffect } from 'react';
import { useRation } from '../../contexts/RationContext';
import './ItemsModule.css';

export const ItemsModule = () => {
  const { products, addToCart, cart, setCurrentModule, currentCard } = useRation();
  const [quantities, setQuantities] = useState({});

  // Determine which products to show based on card number prefix
  const getFilteredProducts = () => {
    if (!currentCard) return products; // fallback if no card

    const prefix = currentCard.slice(0, 5); // e.g., "TN333"

    if (prefix === 'TN333') {
      // Show all products
      return products;
    } else if (prefix === 'TN444') {
      // Show only Rice (id: '1') and Sugar (id: '3')
      return products.filter(p => p.id === '1' || p.id === '3');
    } else {
      // Default: show all (or you could show none)
      return products;
    }
  };

  const filteredProducts = getFilteredProducts();

  // Debug: log filtered products
  console.log('ItemsModule - filtered products:', filteredProducts);

  // Initialize quantities from cart when products change
  useEffect(() => {
    const initialQuantities = {};
    filteredProducts.forEach(p => {
      initialQuantities[p.id] = cart[p.id] || 0;
    });
    setQuantities(initialQuantities);
  }, [filteredProducts, cart]);

  const handleAddToCart = (product) => {
    const qty = quantities[product.id] || 1;
    if (qty <= 0) return;
    addToCart(product.id, qty);
    setQuantities(prev => ({ ...prev, [product.id]: 0 }));
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({ ...prev, [productId]: parseInt(value) || 0 }));
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  const handleImageError = (e, fallbackEmoji) => {
    console.error('Image failed to load:', e.target.src);
    const parent = e.target.parentNode;
    parent.innerHTML = `<span class="item-emoji">${fallbackEmoji}</span>`;
  };

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <div className="items-module module active">
        <div className="items-card empty-state">
          <h2>No Products Available</h2>
          <p>Please check back later.</p>
          <button className="btn btn-primary" onClick={() => setCurrentModule(3)}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="items-module module active">
      <div className="items-header">
        <h2>🛒 Select Items</h2>
        <div className="cart-summary">
          <span>Cart: {getCartItemCount()} items</span>
          <button className="btn btn-secondary" onClick={() => setCurrentModule(5)}>
            Go to Cart
          </button>
        </div>
      </div>

      <div className="items-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="item-card">
            <div className="item-image">
              {product.image && product.image.startsWith('data:') ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  onError={(e) => handleImageError(e, product.icon || '📦')}
                />
              ) : (
                <span className="item-emoji">{product.image || product.icon || '📦'}</span>
              )}
            </div>
            <h3 className="item-name">{product.name}</h3>
            <div className="item-details">
              <span className="item-price">₹{product.price}/{product.unit}</span>
              <span className="item-stock">Stock: {product.stock}</span>
              <span className="item-limit">Max: {product.limit} {product.unit}</span>
            </div>
            <div className="quantity-control">
              <input
                type="number"
                min="0"
                max={product.limit}
                value={quantities[product.id] || 0}
                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                placeholder="Qty"
              />
              <button
                className="btn-add"
                onClick={() => handleAddToCart(product)}
                disabled={!quantities[product.id] || quantities[product.id] <= 0}
              >
                Add to Cart
              </button>
            </div>
            {cart[product.id] > 0 && (
              <div className="in-cart-badge">
                ✓ {cart[product.id]} in cart
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};