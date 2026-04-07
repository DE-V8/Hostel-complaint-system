import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Toast from '../components/Toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/register', formData);
      setToast({ message: res.data.message, type: 'success' });
      setTimeout(() => navigate('/verify-otp', { state: { email: formData.email } }), 1000);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Registration failed', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card slide-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '2rem' }}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-field"
            placeholder="First Name"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Last Name"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
          <input
            type="email"
            className="input-field"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Sending OTP...' : 'Register'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Login here</Link>
        </div>
      </div>
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />}
    </div>
  );
};

export default RegisterPage;
