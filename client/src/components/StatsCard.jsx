import React from 'react';

const StatsCard = ({ title, count, color, icon }) => {
  return (
    <div className="card fade-in" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      borderBottom: `4px solid ${color}`,
      padding: '1.5rem'
    }}>
      <div>
        <p style={{ color: 'var(--gray)', fontSize: '0.9rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
          {title}
        </p>
        <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--dark)' }}>{count}</h2>
      </div>
      <div style={{ 
        width: '50px', height: '50px', 
        borderRadius: '50%', 
        backgroundColor: `${color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color, fontSize: '1.5rem'
      }}>
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
