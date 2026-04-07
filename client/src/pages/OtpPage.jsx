import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import axios from '../api/axios';
import Toast from '../components/Toast';

const OtpPage = () => {
  const [otp, setOtp] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });
  const location = useLocation();
  const navigate = useNavigate();
  
  if (!location.state?.email) return <Navigate to="/register" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/verify-otp', { email: location.state.email, otp });
      setToast({ message: res.data.message, type: 'success' });
      setTimeout(() => navigate('/set-password', { state: { email: location.state.email } }), 1000);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Verification failed', type: 'error' });
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card slide-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '1rem' }}>Enter OTP</h2>
        <p style={{ textAlign: 'center', color: 'var(--gray)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          We sent a 6-digit code to <strong>{location.state.email}</strong>
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-field"
            placeholder="6-digit OTP"
            required
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '2px' }}
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Verify OTP</button>
        </form>
      </div>
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />}
    </div>
  );
};

export default OtpPage;
