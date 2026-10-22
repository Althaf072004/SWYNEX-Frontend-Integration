// src/components/Admin/ProductManagement.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

export const ProductManagement = () => {
  const { products, addProduct, updateProductLimit, updateProductPrice, updateProductStock, updateProductImage } = useAdmin();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', limit: '', stock: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', limit: '', stock: '', icon: '📦' });
  const [imageModal, setImageModal] = useState({ open: false, productId: null, currentIcon: '' });
  const [selectedIcon, setSelectedIcon] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);

  const emojiOptions = ['🍚', '🌾', '🍬', '🛢️', '🥛', '🧂', '🥜', '🍞', '🥔', '🧅', '🥕', '🍅', '🍌', '🍎', '🧃', '🧴'];

  const productsArray = Array.isArray(products) ? products : [];

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      limit: product.limit,
      stock: product.stock
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = (id) => {
    const product = productsArray.find(p => p.id === id);
    if (!product) return;
    if (editForm.price && parseFloat(editForm.price) !== product.price) {
      updateProductPrice(id, parseFloat(editForm.price));
    }
    if (editForm.limit && parseInt(editForm.limit) !== product.limit) {
      updateProductLimit(id, parseInt(editForm.limit));
    }
    if (editForm.stock && parseInt(editForm.stock) !== product.stock) {
      updateProductStock(id, parseInt(editForm.stock));
    }
    setEditingId(null);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.limit || !newProduct.stock) {
      alert('Please fill all fields');
      return;
    }
    addProduct({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      limit: parseInt(newProduct.limit),
      stock: parseInt(newProduct.stock),
      unit: 'kg',
      image: newProduct.icon,
      icon: newProduct.icon
    });
    setNewProduct({ name: '', price: '', limit: '', stock: '', icon: '📦' });
    setShowAddForm(false);
  };

  const openImageModal = (product) => {
    setImageModal({ open: true, productId: product.id, currentIcon: product.icon || product.image });
    setSelectedIcon(product.icon || product.image);
    setUploadedImage(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setSelectedIcon('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateImage = () => {
    const newImage = uploadedImage || selectedIcon;
    if (!newImage) {
      alert('Please select an image or emoji');
      return;
    }
    updateProductImage(imageModal.productId, newImage);
    setImageModal({ open: false, productId: null, currentIcon: '' });
  };

  return (
    <div className="admin-dashboard-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📦 Product Management</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕ Cancel' : '➕ Add New Product'}
        </button>
      </div>

      {showAddForm && (
        <div className="admin-card" style={{ marginBottom: '30px', padding: '20px' }}>
          <h3>Add New Product</h3>
          <form onSubmit={handleAddProduct}>
            <div className="admin-form-group">
              <label>Product Name</label>
              <input
                type="text"
                className="admin-form-control"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                className="admin-form-control"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Max Quantity (kg/L)</label>
              <input
                type="number"
                className="admin-form-control"
                value={newProduct.limit}
                onChange={(e) => setNewProduct({ ...newProduct, limit: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Stock</label>
              <input
                type="number"
                className="admin-form-control"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Icon (select emoji or upload image)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  className="admin-form-select"
                  value={newProduct.icon}
                  onChange={(e) => setNewProduct({ ...newProduct, icon: e.target.value })}
                  style={{ width: 'auto' }}
                >
                  {emojiOptions.map(emoji => (
                    <option key={emoji} value={emoji}>{emoji}</option>
                  ))}
                </select>
                <span>or</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setNewProduct({ ...newProduct, icon: event.target.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <button type="submit" className="admin-btn admin-btn-success">Add Product</button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowAddForm(false)} style={{ marginLeft: '10px' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {imageModal.open && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal" style={{ background: 'white', padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '90%' }}>
            <h3>Change Product Image</h3>
            <p>Current: <span style={{ fontSize: '2rem' }}>{imageModal.currentIcon}</span></p>
            <div className="admin-form-group">
              <label>Select Emoji</label>
              <select
                className="admin-form-select"
                value={selectedIcon}
                onChange={(e) => { setSelectedIcon(e.target.value); setUploadedImage(null); }}
                style={{ width: '100%' }}
              >
                <option value="">-- Choose an emoji --</option>
                {emojiOptions.map(emoji => (
                  <option key={emoji} value={emoji}>{emoji}</option>
                ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label>Or Upload New Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>
            {uploadedImage && (
              <div style={{ margin: '10px 0' }}>
                <img src={uploadedImage} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="admin-btn admin-btn-primary" onClick={handleUpdateImage}>Update Image</button>
              <button className="admin-btn admin-btn-secondary" onClick={() => setImageModal({ open: false, productId: null, currentIcon: '' })}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price (₹)</th>
              <th>Max Qty</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsArray.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  No products found. Click "Add New Product" to create one.
                </td>
              </tr>
            ) : (
              productsArray.map(product => (
                <tr key={product.id}>
                  <td>
                    {product.image && product.image.startsWith('data:') ? (
                      <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '2rem' }}>{product.image || product.icon}</span>
                    )}
                  </td>
                  <td>{product.name}</td>
                  {editingId === product.id ? (
                    <>
                      <td>
                        <input
                          type="number"
                          name="price"
                          value={editForm.price}
                          onChange={handleEditChange}
                          className="admin-form-control"
                          style={{ width: '80px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="limit"
                          value={editForm.limit}
                          onChange={handleEditChange}
                          className="admin-form-control"
                          style={{ width: '80px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="stock"
                          value={editForm.stock}
                          onChange={handleEditChange}
                          className="admin-form-control"
                          style={{ width: '80px' }}
                        />
                      </td>
                      <td>
                        <button className="admin-btn admin-btn-success" onClick={() => handleSave(product.id)}>Save</button>
                        <button className="admin-btn admin-btn-secondary" onClick={cancelEdit}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>₹{product.price}</td>
                      <td>{product.limit} {product.unit}</td>
                      <td>{product.stock}</td>
                      <td>
                        <button className="admin-btn admin-btn-primary" onClick={() => startEdit(product)}>Edit</button>
                        <button className="admin-btn admin-btn-secondary" onClick={() => openImageModal(product)}>Change Image</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};