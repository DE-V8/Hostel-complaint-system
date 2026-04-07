import React from 'react';

const ComplaintCard = ({ complaint }) => {
  const statusClass = complaint.status.replace(' ', '-');
  
  const borderColors = {
    'Pending': 'var(--danger)',
    'In Progress': 'var(--warning)',
    'Resolved': 'var(--success)'
  };
  
  return (
    <div className="card fade-in" style={{ 
      borderLeft: `5px solid ${borderColors[complaint.status]}`,
      marginBottom: '1rem',
      padding: '1.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)' }}>{complaint.type}</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--gray)', margin: 0 }}>
            {new Date(complaint.createdAt).toLocaleString()}
          </p>
        </div>
        <span className={`badge badge-${statusClass}`}>{complaint.status}</span>
      </div>
      
      <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>{complaint.complaint}</p>
      
      <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--gray)' }}>
        <p><strong>Room:</strong> {complaint.roomNumber}</p>
        <p><strong>ID:</strong> {complaint._id.slice(-6).toUpperCase()}</p>
      </div>
    </div>
  );
};

export default ComplaintCard;
