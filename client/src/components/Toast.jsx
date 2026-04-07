import React, { useEffect, useState } from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible && !message) return null;

  const bgColors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#4f46e5',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: bgColors[type] || bgColors.info,
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        zIndex: 9999,
        transition: 'all 0.3s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(-50%, 0)' : 'translate(-50%, 20px)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontWeight: 500 }}>{message}</span>
        <button 
          onClick={() => setVisible(false)}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
