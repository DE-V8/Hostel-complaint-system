import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import ComplaintCard from '../components/ComplaintCard';
import Toast from '../components/Toast';

const StudentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({ type: '', roomNumber: '', complaint: '' });
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('/complaints/mine');
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/complaints', formData);
      setToast({ message: res.data.message, type: 'success' });
      setFormData({ type: '', roomNumber: '', complaint: '' });
      fetchComplaints();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Error submitting complaint', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="container dashboard-grid fade-in">
      
      {/* LEFT: Submit Complaint Form */}
      <div>
        <div className="card" style={{ position: 'sticky', top: '20px' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>File New Complaint</h2>
          <form onSubmit={handleSubmit}>
            <select 
              className="input-field" 
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="" disabled>-- Select Category --</option>
              <option value="Plumbing Issue">Plumbing Issue</option>
              <option value="Ragging Issue">Ragging Issue</option>
              <option value="Cleaning Problem">Cleaning Problem</option>
              <option value="Electricity Issue">Electricity Issue</option>
              <option value="Other">Other</option>
            </select>
            
            <input
              type="text"
              className="input-field"
              placeholder="Room Number (e.g., A-101)"
              required
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            />
            
            <textarea
              className="input-field"
              placeholder="Describe your issue in detail..."
              required
              rows="5"
              value={formData.complaint}
              onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
              style={{ resize: 'vertical' }}
            ></textarea>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: Complaint History */}
      <div>
        <h2 style={{ marginBottom: '1.5rem' }}>Your Complaint History</h2>
        
        {complaints.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>
            <svg style={{ width: '64px', height: '64px', margin: '0 auto 1rem', opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <p>You haven't submitted any complaints yet.</p>
          </div>
        ) : (
          <div>
            {complaints.map(comp => (
              <ComplaintCard key={comp._id} complaint={comp} />
            ))}
          </div>
        )}
      </div>

      {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />}
    </div>
  );
};

export default StudentDashboard;
