import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import axios from '../api/axios';
import Toast from '../components/Toast';

const SetPasswordPage = () => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [toast, setToast] = useState({ message: '', type: '' });
  const location = useLocation();
  const navigate = useNavigate();

  const isReset = location.pathname === '/reset-password';
  const email = location.state?.email;

  if (!email) return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setToast({ message: 'Passwords do not match', type: 'error' });
    }
    
    try {
      const endpoint = isReset ? '/auth/reset-password' : '/auth/set-password';
      const res = await axios.post(endpoint, { email, password: formData.password });
      setToast({ message: res.data.message, type: 'success' });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Action failed', type: 'error' });
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card slide-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '2rem' }}>
          {isReset ? 'Create New Password' : 'Set Your Password'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="input-field"
            placeholder="New Password (min 6 chars)"
            required
            minLength="6"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <input
            type="password"
            className="input-field"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            {isReset ? 'Reset Password' : 'Save & Login'}
          </button>
        </form>
      </div>
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />}
    </div>
  );
};

export default SetPasswordPage;
