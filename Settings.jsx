import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

export const Settings = () => {
  const { settings, updateSettings } = useAdmin();
  const [formData, setFormData] = useState({
    siteName: 'Ration Smart Card Service',
    contactEmail: 'admin@ration.gov',
    contactPhone: '1800-123-4567',
    gstRate: 5,
    deliveryCharge: 0
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    alert('✅ Settings updated successfully!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-dashboard-section">
      <h2>⚙️ System Settings</h2>

      <div className="admin-form" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '20px', color: 'var(--green-primary)' }}>
            General Settings
          </h3>

          <div className="admin-form-group">
            <label>Site Name</label>
            <input
              type="text"
              name="siteName"
              className="admin-form-control"
              value={formData.siteName || ''}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-group">
            <label>Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              className="admin-form-control"
              value={formData.contactEmail || ''}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-group">
            <label>Contact Phone</label>
            <input
              type="text"
              name="contactPhone"
              className="admin-form-control"
              value={formData.contactPhone || ''}
              onChange={handleChange}
            />
          </div>

          <h3 style={{ marginBottom: '20px', marginTop: '40px', color: 'var(--green-primary)' }}>
            Pricing Settings
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="admin-form-group">
              <label>GST Rate (%)</label>
              <input
                type="number"
                name="gstRate"
                className="admin-form-control"
                value={formData.gstRate || 0}
                onChange={handleChange}
                min="0"
                max="28"
                step="0.1"
              />
            </div>

            <div className="admin-form-group">
              <label>Delivery Charge (₹)</label>
              <input
                type="number"
                name="deliveryCharge"
                className="admin-form-control"
                value={formData.deliveryCharge || 0}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: '30px' }}>
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;