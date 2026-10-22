// src/components/Admin/FamilyManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

export const FamilyManagement = () => {
  const { 
    families: contextFamilies, 
    products,                 // <-- we now also get products
    addFamily, 
    updateFamily,
    deleteFamily,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember 
  } = useAdmin();

  const [showAddFamily, setShowAddFamily] = useState(false);
  const [showAddMember, setShowAddMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [editingFamily, setEditingFamily] = useState(null);
  const [editFamilyForm, setEditFamilyForm] = useState({
    headName: '',
    headAadhar: '',
    headPhone: '',
    address: '',
    rationType: 'BPL',
    monthlyQuota: { rice: 35, wheat: 25, sugar: 5, kerosene: 3 }
  });
  const [newFamily, setNewFamily] = useState({
    headName: '',
    headAadhar: '',
    headPhone: '',
    address: '',
    rationType: 'BPL',
    monthlyQuota: { rice: 35, wheat: 25, sugar: 5, kerosene: 3 },
    members: []
  });
  const [newMember, setNewMember] = useState({
    name: '',
    relation: '',
    icon: '👤',
    age: '',
    gender: '',
    aadhar: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure families and products are arrays
  const familiesArray = Array.isArray(contextFamilies) ? contextFamilies : [];
  const productsArray = Array.isArray(products) ? products : [];

  // Helper to get product image by name (case‑insensitive partial match)
  const getProductImage = (productName) => {
    const lowerName = productName.toLowerCase();
    const product = productsArray.find(p => 
      p.name?.toLowerCase().includes(lowerName)
    );
    return product?.image || product?.icon || '📦';
  };

  // Filter families by card number
  const filteredFamilies = familiesArray.filter(family =>
    family.card_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFamily = (e) => {
    e.preventDefault();
    const cardNumber = document.getElementById('newCardNumber')?.value;
    if (!cardNumber) return;
    if (!newFamily.headName || !newFamily.headAadhar) {
      alert('Please enter head name and Aadhar number');
      return;
    }
    addFamily(cardNumber, {
      headName: newFamily.headName,
      headAadhar: newFamily.headAadhar,
      headPhone: newFamily.headPhone,
      address: newFamily.address,
      rationType: newFamily.rationType,
      monthlyQuota: newFamily.monthlyQuota,
      members: newFamily.members,
      createdAt: new Date().toISOString()
    });
    setShowAddFamily(false);
    setNewFamily({
      headName: '',
      headAadhar: '',
      headPhone: '',
      address: '',
      rationType: 'BPL',
      monthlyQuota: { rice: 35, wheat: 25, sugar: 5, kerosene: 3 },
      members: []
    });
    e.target.reset();
  };

  const handleEditFamilyStart = (family) => {
    setEditingFamily(family.card_number);
    setEditFamilyForm({
      headName: family.head_name || family.headName || '',
      headAadhar: family.head_aadhar || family.headAadhar || '',
      headPhone: family.head_phone || family.headPhone || '',
      address: family.address || '',
      rationType: family.ration_type || family.rationType || 'BPL',
      monthlyQuota: family.monthly_quota || family.monthlyQuota || { rice: 35, wheat: 25, sugar: 5, kerosene: 3 }
    });
  };

  const handleEditFamilyChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rice' || name === 'wheat' || name === 'sugar' || name === 'kerosene') {
      setEditFamilyForm(prev => ({
        ...prev,
        monthlyQuota: { ...prev.monthlyQuota, [name]: parseInt(value) || 0 }
      }));
    } else {
      setEditFamilyForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditFamilySave = (cardNumber) => {
    updateFamily(cardNumber, {
      headName: editFamilyForm.headName,
      headAadhar: editFamilyForm.headAadhar,
      headPhone: editFamilyForm.headPhone,
      address: editFamilyForm.address,
      rationType: editFamilyForm.rationType,
      monthlyQuota: editFamilyForm.monthlyQuota
    });
    setEditingFamily(null);
    setEditFamilyForm({
      headName: '',
      headAadhar: '',
      headPhone: '',
      address: '',
      rationType: 'BPL',
      monthlyQuota: { rice: 35, wheat: 25, sugar: 5, kerosene: 3 }
    });
  };

  const handleAddMember = async (cardNumber) => {
    if (!newMember.name.trim() || !newMember.relation.trim()) {
      alert('Please enter both name and relation');
      return;
    }
    try {
      await addFamilyMember(cardNumber, {
        ...newMember,
        id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: newMember.name.trim(),
        relation: newMember.relation.trim(),
        age: parseInt(newMember.age) || null,
        addedAt: new Date().toISOString()
      });
      setShowAddMember(null);
      setNewMember({ name: '', relation: '', icon: '👤', age: '', gender: '', aadhar: '' });
    } catch (error) {
      console.error('Failed to add member:', error);
      alert('Failed to add member. Check console for details.');
    }
  };

  const handleUpdateMember = (cardNumber) => {
    if (!editingMember) return;
    updateFamilyMember(cardNumber, editingMember.id, {
      name: editingMember.name.trim(),
      relation: editingMember.relation.trim(),
      icon: editingMember.icon,
      age: editingMember.age,
      gender: editingMember.gender,
      aadhar: editingMember.aadhar,
      updatedAt: new Date().toISOString()
    });
    setEditingMember(null);
  };

  const handleDeleteFamily = (cardNumber) => {
    if (window.confirm(`⚠️ Delete Smart Card ${cardNumber}?\nThis action cannot be undone.`)) {
      deleteFamily(cardNumber);
    }
  };

  const handleDeleteMember = (cardNumber, memberId, memberName) => {
    if (window.confirm(`Remove ${memberName} from this family?`)) {
      deleteFamilyMember(cardNumber, memberId);
    }
  };

  return (
    <div className="admin-dashboard-section">
      {/* Header with search and add button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2 style={{ margin: 0, color: '#1e3c72' }}>👨‍👩‍👧‍👦 Family Management</h2>
          <span style={{ 
            background: '#e8f5e9',
            color: '#2e7d32',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {familiesArray.length} Cards
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <input
            type="text"
            placeholder="🔍 Search by Card Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              width: '250px',
              fontSize: '0.95rem'
            }}
          />
          <button 
            onClick={() => setShowAddFamily(!showAddFamily)}
            style={{
              padding: '10px 20px',
              background: showAddFamily ? '#dc3545' : 'linear-gradient(135deg, #1e3c72, #2a5298)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{showAddFamily ? '✕' : '➕'}</span>
            {showAddFamily ? 'Cancel' : 'Add New Smart Card'}
          </button>
        </div>
      </div>

      {/* Add Family Form */}
      {showAddFamily && (
        <div style={{ 
          marginBottom: '30px',
          padding: '25px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '2px solid #1e3c72'
        }}>
          <h3 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            marginBottom: '20px',
            color: '#1e3c72'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🎫</span>
            Create New Smart Card
          </h3>
          <form onSubmit={handleAddFamily}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Smart Card Number
              </label>
              <input
                id="newCardNumber"
                type="text"
                placeholder="TN333472120887"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '1.1rem'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Head Name
              </label>
              <input
                type="text"
                value={newFamily.headName}
                onChange={(e) => setNewFamily({...newFamily, headName: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Head Aadhar Number
              </label>
              <input
                type="text"
                value={newFamily.headAadhar}
                onChange={(e) => setNewFamily({...newFamily, headAadhar: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Phone Number
              </label>
              <input
                type="text"
                value={newFamily.headPhone}
                onChange={(e) => setNewFamily({...newFamily, headPhone: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Address
              </label>
              <textarea
                value={newFamily.address}
                onChange={(e) => setNewFamily({...newFamily, address: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  minHeight: '80px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Ration Type
              </label>
              <select
                value={newFamily.rationType}
                onChange={(e) => setNewFamily({...newFamily, rationType: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px'
                }}
              >
                <option value="BPL">BPL (Below Poverty Line)</option>
                <option value="APL">APL (Above Poverty Line)</option>
                <option value="AAY">AAY (Antyodaya)</option>
                <option value="PHH">PHH (Priority Household)</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Monthly Quota (kg/L)
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="number"
                  placeholder="Rice"
                  value={newFamily.monthlyQuota.rice}
                  onChange={(e) => setNewFamily({
                    ...newFamily,
                    monthlyQuota: { ...newFamily.monthlyQuota, rice: parseInt(e.target.value) || 0 }
                  })}
                  style={{ width: 'calc(25% - 8px)', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                />
                <input
                  type="number"
                  placeholder="Wheat"
                  value={newFamily.monthlyQuota.wheat}
                  onChange={(e) => setNewFamily({
                    ...newFamily,
                    monthlyQuota: { ...newFamily.monthlyQuota, wheat: parseInt(e.target.value) || 0 }
                  })}
                  style={{ width: 'calc(25% - 8px)', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                />
                <input
                  type="number"
                  placeholder="Sugar"
                  value={newFamily.monthlyQuota.sugar}
                  onChange={(e) => setNewFamily({
                    ...newFamily,
                    monthlyQuota: { ...newFamily.monthlyQuota, sugar: parseInt(e.target.value) || 0 }
                  })}
                  style={{ width: 'calc(25% - 8px)', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                />
                <input
                  type="number"
                  placeholder="Kerosene"
                  value={newFamily.monthlyQuota.kerosene}
                  onChange={(e) => setNewFamily({
                    ...newFamily,
                    monthlyQuota: { ...newFamily.monthlyQuota, kerosene: parseInt(e.target.value) || 0 }
                  })}
                  style={{ width: 'calc(25% - 8px)', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" style={{
                padding: '12px 25px',
                background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                ✅ Create Smart Card
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddFamily(false)}
                style={{
                  padding: '12px 25px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Families List */}
      {filteredFamilies.length === 0 ? (
        <div style={{ 
          padding: '60px 40px', 
          textAlign: 'center',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '20px' }}>👨‍👩‍👧‍👦</span>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>
            {searchTerm ? 'No matching Smart Cards found' : 'No Smart Cards Created Yet'}
          </h3>
          <p style={{ color: '#999', marginBottom: '25px' }}>
            {searchTerm 
              ? 'Try adjusting your search term' 
              : 'Click "Add New Smart Card" to create your first family record'}
          </p>
        </div>
      ) : (
        filteredFamilies.map((family) => {
          const cardNumber = family.card_number;
          const isEditingFamily = editingFamily === cardNumber;
          return (
            <div 
              key={cardNumber} 
              style={{ 
                background: 'white', 
                borderRadius: '12px', 
                padding: '25px', 
                marginBottom: '25px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #eee'
              }}
            >
              {/* Family Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: '2px solid #f0f0f0'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <h3 style={{ 
                      color: '#1e3c72', 
                      margin: 0,
                      fontFamily: 'monospace',
                      fontSize: '1.3rem'
                    }}>
                      🎫 {cardNumber}
                    </h3>
                    <span style={{
                      background: '#e8f5e9',
                      color: '#2e7d32',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      {family.members?.length || 0} Members
                    </span>
                  </div>

                  {!isEditingFamily ? (
                    // Display mode
                    <>
                      <p style={{ color: '#666', margin: '5px 0', fontSize: '0.9rem' }}>
                        <strong>Head:</strong> {family.head_name || family.headName}
                      </p>
                      <p style={{ color: '#666', margin: '5px 0', fontSize: '0.9rem' }}>
                        <strong>Aadhar:</strong> {family.head_aadhar || family.headAadhar}
                      </p>
                      <p style={{ color: '#666', margin: '5px 0', fontSize: '0.9rem' }}>
                        <strong>Phone:</strong> {family.head_phone || family.headPhone}
                      </p>
                      <p style={{ color: '#666', margin: '5px 0', fontSize: '0.9rem' }}>
                        <strong>Address:</strong> {family.address || 'Not specified'}
                      </p>
                      <p style={{ color: '#666', margin: '5px 0', fontSize: '0.9rem' }}>
                        <strong>Ration Type:</strong> {family.ration_type || family.rationType}
                      </p>
                      <div style={{ marginTop: '10px' }}>
                        <p style={{ fontWeight: '500', marginBottom: '8px' }}>Monthly Quota:</p>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <img 
                              src={getProductImage('Rice')} 
                              alt="Rice" 
                              style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }}
                            />
                            <span style={{ display: 'none' }}>🍚</span>
                            <span>Rice: {family.monthly_quota?.rice || family.monthlyQuota?.rice || 35} kg</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <img 
                              src={getProductImage('Wheat')} 
                              alt="Wheat" 
                              style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }}
                            />
                            <span style={{ display: 'none' }}>🌾</span>
                            <span>Wheat: {family.monthly_quota?.wheat || family.monthlyQuota?.wheat || 25} kg</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <img 
                              src={getProductImage('Sugar')} 
                              alt="Sugar" 
                              style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }}
                            />
                            <span style={{ display: 'none' }}>🍬</span>
                            <span>Sugar: {family.monthly_quota?.sugar || family.monthlyQuota?.sugar || 5} kg</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <img 
                              src={getProductImage('Kerosene')} 
                              alt="Kerosene" 
                              style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }}
                            />
                            <span style={{ display: 'none' }}>🛢️</span>
                            <span>Kerosene: {family.monthly_quota?.kerosene || family.monthlyQuota?.kerosene || 3} L</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Edit mode
                    <div style={{ marginTop: '10px' }}>
                      <input
                        name="headName"
                        value={editFamilyForm.headName}
                        onChange={handleEditFamilyChange}
                        placeholder="Head Name"
                        style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                      <input
                        name="headAadhar"
                        value={editFamilyForm.headAadhar}
                        onChange={handleEditFamilyChange}
                        placeholder="Aadhar"
                        style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                      <input
                        name="headPhone"
                        value={editFamilyForm.headPhone}
                        onChange={handleEditFamilyChange}
                        placeholder="Phone"
                        style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                      <textarea
                        name="address"
                        value={editFamilyForm.address}
                        onChange={handleEditFamilyChange}
                        placeholder="Address"
                        style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '60px' }}
                      />
                      <select
                        name="rationType"
                        value={editFamilyForm.rationType}
                        onChange={handleEditFamilyChange}
                        style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                      >
                        <option value="BPL">BPL</option>
                        <option value="APL">APL</option>
                        <option value="AAY">AAY</option>
                        <option value="PHH">PHH</option>
                      </select>
                      <div style={{ marginBottom: '8px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Monthly Quota (kg/L):</label>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          <input name="rice" value={editFamilyForm.monthlyQuota?.rice || ''} onChange={handleEditFamilyChange} placeholder="Rice" style={{ width: '70px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }} />
                          <input name="wheat" value={editFamilyForm.monthlyQuota?.wheat || ''} onChange={handleEditFamilyChange} placeholder="Wheat" style={{ width: '70px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }} />
                          <input name="sugar" value={editFamilyForm.monthlyQuota?.sugar || ''} onChange={handleEditFamilyChange} placeholder="Sugar" style={{ width: '70px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }} />
                          <input name="kerosene" value={editFamilyForm.monthlyQuota?.kerosene || ''} onChange={handleEditFamilyChange} placeholder="Kerosene" style={{ width: '70px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                  {isEditingFamily ? (
                    <>
                      <button
                        onClick={() => handleEditFamilySave(cardNumber)}
                        style={{ padding: '8px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingFamily(null)}
                        style={{ padding: '8px 12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditFamilyStart(family)}
                        style={{ padding: '8px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFamily(cardNumber)}
                        style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Family Members (unchanged) */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginBottom: '15px',
                  color: '#444'
                }}>
                  <span>👥 Family Members</span>
                  <span style={{
                    background: '#e9ecef',
                    color: '#495057',
                    padding: '2px 10px',
                    borderRadius: '20px',
                    fontSize: '0.85rem'
                  }}>
                    {family.members?.length || 0} total
                  </span>
                </h4>
                
                <div style={{ display: 'grid', gap: '15px' }}>
                  {family.members?.map(member => (
                    <div key={member.id}>
                      {editingMember?.id === member.id ? (
                        <div style={{
                          padding: '20px',
                          background: '#fff3cd',
                          borderRadius: '12px',
                          border: '2px solid #ffc107'
                        }}>
                          <h5 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#856404', marginBottom: '15px' }}>
                            <span style={{ fontSize: '1.3rem' }}>✏️</span> Edit Member
                          </h5>
                          <div style={{ display: 'grid', gap: '15px' }}>
                            <input type="text" value={editingMember.name} onChange={(e) => setEditingMember({...editingMember, name: e.target.value})} placeholder="Full Name" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                            <input type="text" value={editingMember.relation} onChange={(e) => setEditingMember({...editingMember, relation: e.target.value})} placeholder="Relationship" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                            <input type="text" value={editingMember.age || ''} onChange={(e) => setEditingMember({...editingMember, age: e.target.value})} placeholder="Age" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                            <select value={editingMember.gender || ''} onChange={(e) => setEditingMember({...editingMember, gender: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
                              <option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                            </select>
                            <input type="text" value={editingMember.aadhar || ''} onChange={(e) => setEditingMember({...editingMember, aadhar: e.target.value})} placeholder="Aadhar Number" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                            <select value={editingMember.icon} onChange={(e) => setEditingMember({...editingMember, icon: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
                              <option value="👤">👤 Default</option><option value="👨">👨 Father</option><option value="👩">👩 Mother</option><option value="👦">👦 Son</option><option value="👧">👧 Daughter</option><option value="👴">👴 Grandfather</option><option value="👵">👵 Grandmother</option><option value="👶">👶 Infant</option>
                            </select>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button onClick={() => handleUpdateMember(cardNumber)} disabled={!editingMember.name.trim() || !editingMember.relation.trim()} style={{ padding: '10px 20px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>💾 Save</button>
                              <button onClick={() => setEditingMember(null)} style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', borderRadius: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '2.2rem' }}>{member.icon}</span>
                            <div>
                              <strong style={{ fontSize: '1.1rem', display: 'block' }}>{member.name}</strong>
                              <span style={{ color: '#666', fontSize: '0.9rem' }}>{member.relation}</span>
                              {member.age && <span style={{ color: '#999', fontSize: '0.85rem', marginLeft: '5px' }}>Age: {member.age}</span>}
                              {member.gender && <span style={{ color: '#999', fontSize: '0.85rem', marginLeft: '5px' }}> • {member.gender}</span>}
                              {member.aadhar && <div style={{ color: '#999', fontSize: '0.8rem', marginTop: '2px' }}>Aadhar: {member.aadhar}</div>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => setEditingMember(member)} style={{ padding: '8px 12px', background: 'rgba(23,162,184,0.1)', color: '#17a2b8', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>✏️ Edit</button>
                            <button onClick={() => handleDeleteMember(cardNumber, member.id, member.name)} style={{ padding: '8px 12px', background: 'rgba(220,53,69,0.1)', color: '#dc3545', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>🗑️ Remove</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Member Button/Form */}
              {showAddMember === cardNumber ? (
                <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '12px', marginTop: '10px', border: '2px dashed #1e3c72' }}>
                  <h5 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e3c72', marginBottom: '20px' }}>
                    <span style={{ fontSize: '1.5rem' }}>➕</span>Add New Family Member
                  </h5>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    <input type="text" placeholder="Full Name" value={newMember.name} onChange={(e) => setNewMember({...newMember, name: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    <input type="text" placeholder="Relationship" value={newMember.relation} onChange={(e) => setNewMember({...newMember, relation: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    <input type="text" placeholder="Age" value={newMember.age} onChange={(e) => setNewMember({...newMember, age: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    <select value={newMember.gender} onChange={(e) => setNewMember({...newMember, gender: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
                      <option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                    </select>
                    <input type="text" placeholder="Aadhar Number" value={newMember.aadhar} onChange={(e) => setNewMember({...newMember, aadhar: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    <select value={newMember.icon} onChange={(e) => setNewMember({...newMember, icon: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
                      <option value="👤">👤 Default</option><option value="👨">👨 Father</option><option value="👩">👩 Mother</option><option value="👦">👦 Son</option><option value="👧">👧 Daughter</option><option value="👴">👴 Grandfather</option><option value="👵">👵 Grandmother</option><option value="👶">👶 Infant</option>
                    </select>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleAddMember(cardNumber)} disabled={!newMember.name.trim() || !newMember.relation.trim()} style={{ padding: '10px 25px', background: 'linear-gradient(135deg, #1e3c72, #2a5298)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>✅ Add Member</button>
                      <button onClick={() => { setShowAddMember(null); setNewMember({ name: '', relation: '', icon: '👤', age: '', gender: '', aadhar: '' }); }} style={{ padding: '10px 25px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowAddMember(cardNumber)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', width: '100%', justifyContent: 'center', background: '#e8f5e9', color: '#1e3c72', border: '2px dashed #1e3c72', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  <span style={{ fontSize: '1.2rem' }}>➕</span>Add Family Member
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};