import React from 'react';

export const FamilyMember = ({ member, onSelect, isSelected = false }) => {
  return (
    <div 
      className={`family-member ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(member.id, member.name)}
    >
      <div className="member-avatar">{member.icon}</div>
      <div>
        <h3>{member.name}</h3>
        <p>{member.relation}</p>
      </div>
    </div>
  );
};

export default FamilyMember;