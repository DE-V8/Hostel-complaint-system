import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{ 
      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
      color: 'white',
      padding: '15px 0',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* <img src="/logo.jpg" alt="Logo" style={{ height: '40px', borderRadius: '4px' }}/> */}
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>KJEI Hostel Tracker</h1>
        </div>
        
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: 500 }}>{user.firstName} {user.lastName}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8, textTransform: 'capitalize' }}>{user.role}</p>
            </div>
            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.4rem 1rem' }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
