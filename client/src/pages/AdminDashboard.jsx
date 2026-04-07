import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import StatsCard from '../components/StatsCard';
import Toast from '../components/Toast';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { DocumentTextIcon, CheckCircleIcon, ClockIcon, ExclamationCircleIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('complaints'); // complaints or students
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [toast, setToast] = useState({ message: '', type: '' });

  const fetchData = async () => {
    try {
      const [statsRes, complaintsRes, studentsRes] = await Promise.all([
        axios.get('/complaints/stats'),
        axios.get(`/complaints/all?status=${statusFilter}&type=${typeFilter}&search=${searchTerm}`),
        axios.get('/complaints/students')
      ]);
      setStats(statsRes.data);
      setComplaints(complaintsRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      setToast({ message: 'Error fetching data', type: 'error' });
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, typeFilter, searchTerm]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`/complaints/${id}/status`, { status: newStatus });
      setToast({ message: 'Status updated', type: 'success' });
      fetchData(); // Refresh data
    } catch (err) {
      setToast({ message: 'Error updating status', type: 'error' });
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Email', 'Name', 'Room', 'Type', 'Complaint', 'Status', 'Date'];
    const rows = complaints.map(c => [
      c._id, c.email, `${c.firstName} ${c.lastName}`, c.roomNumber, c.type, 
      `"${c.complaint.replace(/"/g, '""')}"`, c.status, new Date(c.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "complaints_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!stats) return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading dashboard...</div>;

  // Chart Data
  const pieData = {
    labels: stats.byType.map(t => t._id),
    datasets: [{
      data: stats.byType.map(t => t.count),
      backgroundColor: ['#4f46e5', '#818cf8', '#10b981', '#f59e0b', '#ef4444'],
    }]
  };

  const lineData = {
    labels: stats.weeklyTrend.map(w => `Wk ${w._id}`),
    datasets: [{
      label: 'Complaints',
      data: stats.weeklyTrend.map(w => w.count),
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.5)',
      tension: 0.3
    }]
  };

  return (
    <div className="container fade-in" style={{ padding: '2rem 1.5rem' }}>
      
      {/* Top Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatsCard title="Total" count={stats.total} color="var(--primary)" icon={<DocumentTextIcon style={{width: 24}}/>} />
        <StatsCard title="Pending" count={stats.pending} color="var(--danger)" icon={<ExclamationCircleIcon style={{width: 24}}/>} />
        <StatsCard title="In Progress" count={stats.inProgress} color="var(--warning)" icon={<ClockIcon style={{width: 24}}/>} />
        <StatsCard title="Resolved" count={stats.resolved} color="var(--success)" icon={<CheckCircleIcon style={{width: 24}}/>} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        
        {/* Main Content Area */}
        <div>
          <div className="card">
            
            {/* Tabs & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className={`btn ${activeTab === 'complaints' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setActiveTab('complaints')}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Complaints
                </button>
                <button 
                  className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setActiveTab('students')}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Students ({stats.students})
                </button>
              </div>
              
              {activeTab === 'complaints' && (
                <button className="btn" onClick={exportToCSV} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--light)', border: '1px solid var(--border)' }}>
                  <ArrowDownTrayIcon style={{width: 18}} /> Export CSV
                </button>
              )}
            </div>

            {/* Constraints & Filters */}
            {activeTab === 'complaints' && (
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ marginBottom: 0 }}
                  placeholder="Search name, room, keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select className="input-field" style={{ marginBottom: 0, width: '200px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <select className="input-field" style={{ marginBottom: 0, width: '200px' }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="All">All Types</option>
                  <option value="Plumbing Issue">Plumbing</option>
                  <option value="Ragging Issue">Ragging</option>
                  <option value="Cleaning Problem">Cleaning</option>
                  <option value="Electricity Issue">Electricity</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            {/* Data Tables */}
            <div style={{ overflowX: 'auto' }}>
              {activeTab === 'complaints' ? (
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Room</th>
                      <th>Student</th>
                      <th>Type</th>
                      <th style={{ width: '40%' }}>Complaint</th>
                      <th>Status Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.length > 0 ? complaints.map(c => (
                      <tr key={c._id}>
                        <td style={{ fontSize: '0.85rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td><strong>{c.roomNumber}</strong></td>
                        <td>
                          {c.firstName} {c.lastName}<br/>
                          <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{c.email}</span>
                        </td>
                        <td>{c.type}</td>
                        <td style={{ fontSize: '0.9rem' }}>{c.complaint.substring(0, 80)}{c.complaint.length > 80 ? '...' : ''}</td>
                        <td>
                          <select 
                            value={c.status}
                            onChange={(e) => handleStatusUpdate(c._id, e.target.value)}
                            style={{
                              padding: '0.4rem',
                              borderRadius: '4px',
                              border: `1px solid ${c.status === 'Resolved' ? 'var(--success)' : c.status === 'In Progress' ? 'var(--warning)' : 'var(--danger)'}`,
                              background: c.status === 'Resolved' ? '#d1fae5' : c.status === 'In Progress' ? '#fef3c7' : '#fee2e2',
                              color: c.status === 'Resolved' ? '#065f46' : c.status === 'In Progress' ? '#92400e' : '#991b1b',
                              fontWeight: 500,
                              cursor: 'pointer'
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                      </tr>
                    )) : <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No complaints found.</td></tr>}
                  </tbody>
                </table>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined Date</th>
                      <th>Total Complaints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s._id}>
                        <td><strong>{s.firstName} {s.lastName}</strong></td>
                        <td>{s.email}</td>
                        <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                        <td><span className="badge" style={{ background: 'var(--light)', color: 'var(--dark)' }}>{s.complaintCount}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Issues by Category</h3>
            <div style={{ position: 'relative', height: '250px' }}>
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Filing Trend (7 weeks)</h3>
             <div style={{ position: 'relative', height: '200px' }}>
              <Line data={lineData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </div>
        </div>

      </div>

      {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />}
    </div>
  );
};

export default AdminDashboard;
