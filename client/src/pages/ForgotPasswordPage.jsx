import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import Toast from '../components/Toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/forgot-password', { email });
      setToast({ message: res.data.message, type: 'info' });
      setTimeout(() => navigate('/verify-reset-otp', { state: { email } }), 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to send OTP', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card slide-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '1rem' }}>Forgot Password</h2>
        <p style={{ textAlign: 'center', color: 'var(--gray)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Enter your registered email address and we'll send you a code to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="input-field"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Sending Code...' : 'Send Reset Code'}
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Back to Login</Link>
        </div>
      </div>
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />}
    </div>
  );
};

export default ForgotPasswordPage;
