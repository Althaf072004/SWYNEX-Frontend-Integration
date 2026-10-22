import React from 'react';

export const ReceiptContent = ({ data }) => {
  if (!data) return null;

  return (
    <div style={{ background: 'var(--green-light)', padding: '50px', borderRadius: '25px', margin: '30px 0' }}>
      <h2 style={{ color: 'var(--green-primary)' }}>Receipt #{data.id}</h2>
      <hr style={{ border: 'none', height: '3px', background: 'var(--green-primary)', margin: '30px 0' }} />
      <div style={{ textAlign: 'left', maxWidth: '450px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p><strong>📋 Smart Card:</strong> {data.card}</p>
        <p><strong>👤 Member:</strong> {data.member}</p>
        <p><strong>🆔 Transaction ID:</strong> {data.id}</p>
        <p><strong>📅 Date & Time:</strong> {data.date}</p>
        <p style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--green-primary)', marginTop: '25px' }}>
          💰 Total Amount: {data.total}
        </p>
      </div>
      <hr style={{ border: 'none', height: '3px', background: 'var(--green-primary)', margin: '30px 0' }} />
      <div style={{ 
        fontSize: '1.3rem', 
        color: 'var(--green-primary)', 
        padding: '25px', 
        background: 'var(--white)', 
        borderRadius: '18px', 
        borderLeft: '6px solid var(--green-secondary)' 
      }}>
        ✅ Items ready for collection at your ration shop<br />
        📱 Transaction saved to your device storage
      </div>
    </div>
  );
};

export default ReceiptContent;