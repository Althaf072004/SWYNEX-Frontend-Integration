// src/components/Family/FamilyModule.jsx
import React, { useEffect } from 'react';
import { useRation } from '../../contexts/RationContext';
import './FamilyModule.css';

export const FamilyModule = () => {
  console.log('🏠 FamilyModule rendering...');
  
  const ration = useRation();
  const { currentCard, families, selectMember, setCurrentModule, loading, products } = ration;
  
  // Helper to get product image by name (case‑insensitive partial match)
  const getProductImage = (productName) => {
    const lowerName = productName.toLowerCase();
    const product = products?.find(p => 
      p.name?.toLowerCase().includes(lowerName)
    );
    return product?.image || product?.icon || '📦';
  };

  // Log everything on mount
  useEffect(() => {
    console.log('📊 FamilyModule mounted with:', {
      currentCard,
      familiesKeys: Object.keys(families || {}),
      familiesData: families,
      loading
    }); 
  }, [currentCard, families, loading]); // added dependencies

  // Log when currentCard changes
  useEffect(() => {
    console.log('🔄 FamilyModule - currentCard updated:', currentCard);
    if (currentCard) {
      console.log('👨‍👩‍👧 Family data for', currentCard, ':', families?.[currentCard]);
    }
  }, [currentCard, families]);

  // Log when loading changes
  useEffect(() => {
    console.log('⏳ FamilyModule - loading:', loading);
  }, [loading]);

  const familyData = currentCard ? families?.[currentCard] : null;

  // Show loading state
  if (loading) {
    console.log('⏳ Rendering loading state');
    return (
      <div className="family-module module active">
        <div className="family-card loading-state">
          <div className="spinner"></div>
          <h3>Loading family details...</h3>
        </div>
      </div>
    );
  }

  // No card selected
  if (!currentCard) {
    console.log('❌ No current card');
    return (
      <div className="family-module module active">
        <div className="family-card error-state">
          <h2>❌ No Card Selected</h2>
          <p>Please login with a smart card first</p>
          <button 
            className="btn"
            onClick={() => setCurrentModule(1)}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Family not found
  if (!familyData) {
    console.log('❌ No family data for card:', currentCard);
    return (
      <div className="family-module module active">
        <div className="family-card error-state">
          <h2>❌ Family Not Found</h2>
          <p>No family data found for card: <strong>{currentCard}</strong></p>
          <p>Available cards: {Object.keys(families || {}).join(', ') || 'None'}</p>
          <button 
            className="btn"
            onClick={() => setCurrentModule(1)}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Success - render family data
  console.log('✅ Rendering family data for', currentCard, familyData);
  return (
    <div className="family-module module active">
      <div className="family-card">
        {/* Family Header */}
        <div className="family-header">
          <h2>👨‍👩‍👧‍👦 Select Family Member</h2>
          <p className="card-number">Card: {currentCard}</p>
          <p className="ration-type">{familyData.ration_type || familyData.rationType || 'BPL (Below Poverty Line)'}</p>
          <p className="address">📍 {familyData.address || 'Address not specified'}</p>
          <p className="member-count">👥 Total Members: {familyData.members?.length || 0}</p>
        </div>

        {/* Members List */}
        <div className="members-list">
          {familyData.members && familyData.members.length > 0 ? (
            familyData.members.map((member) => (
              <div
                key={member.id}
                className="member-item"
                onClick={() => selectMember(member)}
              >
                <span className="member-avatar">{member.icon || '👤'}</span>
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-detail">
                    <span className="member-relation">{member.relation}</span> • Age: {member.age || 'N/A'}
                  </p>
                  <p className="member-detail">{member.occupation || 'Not specified'}</p>
                </div>
                <span className="member-arrow">→</span>
              </div>
            ))
          ) : (
            <p className="no-members">No family members found</p>
          )}
        </div>

        {/* Monthly Quota - now using product images */}
        {(familyData.monthly_quota || familyData.monthlyQuota) && (
          <div className="quota-section">
            <h4>📦 Monthly Quota</h4>
            <div className="quota-grid">
              <div className="quota-item">
                <div className="quota-image">
                  <img 
                    src={getProductImage('Rice')} 
                    alt="Rice"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }}
                  />
                  <span style={{ display: 'none' }}>🍚</span>
                </div>
                <span className="quota-text">
                  Rice: {familyData.monthly_quota?.rice || familyData.monthlyQuota?.rice || 35} kg
                </span>
              </div>
              <div className="quota-item">
                <div className="quota-image">
                  <img 
                    src={getProductImage('Wheat')} 
                    alt="Wheat"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }}
                  />
                  <span style={{ display: 'none' }}>🌾</span>
                </div>
                <span className="quota-text">
                  Wheat: {familyData.monthly_quota?.wheat || familyData.monthlyQuota?.wheat || 25} kg
                </span>
              </div>
              <div className="quota-item">
                <div className="quota-image">
                  <img 
                    src={getProductImage('Sugar')} 
                    alt="Sugar"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }}
                  />
                  <span style={{ display: 'none' }}>🍬</span>
                </div>
                <span className="quota-text">
                  Sugar: {familyData.monthly_quota?.sugar || familyData.monthlyQuota?.sugar || 5} kg
                </span>
              </div>
              <div className="quota-item">
                <div className="quota-image">
                  <img 
                    src={getProductImage('Kerosene')} 
                    alt="Kerosene"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }}
                  />
                  <span style={{ display: 'none' }}>🛢️</span>
                </div>
                <span className="quota-text">
                  Kerosene: {familyData.monthly_quota?.kerosene || familyData.monthlyQuota?.kerosene || 3} L
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          className="back-button"
          onClick={() => setCurrentModule(1)}
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
};