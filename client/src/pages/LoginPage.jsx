import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [toast, setToast] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', formData);
      login(res.data.token, res.data.user);
      if (res.data.user.role === 'admin') navigate('/admin');
      else navigate('/student');
    } catch (err) {
      setToast(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card slide-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '2rem' }}>Login to Tracker</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="input-field"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <Link to="/forgot-password" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Forgot Password?</Link>
        </div>
        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
          New user? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Create an account</Link>
        </div>
      </div>
      {toast && <Toast message={toast} type="error" onClose={() => setToast('')} />}
    </div>
  );
};

export default LoginPage;
