import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  let admin = null;
  try {
    const storedAdmin = localStorage.getItem('aadhyaraj_admin');
    admin = storedAdmin && storedAdmin !== 'undefined' ? JSON.parse(storedAdmin) : null;
  } catch { admin = null; }

  const isSuperAdmin = admin?.role === 'superadmin';
  const isCareerAdmin = admin?.role === 'careeradmin';

  const logout = () => {
    localStorage.removeItem('aadhyaraj_token');
    localStorage.removeItem('aadhyaraj_admin');
    toast.info('Logged out successfully.');
    navigate('/admin');
  };

  useEffect(() => {
    const token = localStorage.getItem('aadhyaraj_token');
    if (!token) { navigate('/admin'); return; }
    const fetchDashboard = async () => {
      try {
        const response = await axios.get('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } });
        setStats(response.data.data.overview);
      } catch {
        toast.error('Unable to load admin dashboard. Please log in again.');
        logout();
      } finally { setLoading(false); }
    };
    fetchDashboard();
  }, [navigate]);

  const allCmsCards = [
    { title: 'Services', icon: '🚀', desc: 'Manage service offerings', count: stats?.totalServices ?? '—', path: '/admin/services', color: '#3b82f6', roles: ['superadmin'] },
    { title: 'Testimonials', icon: '💬', desc: 'Manage client testimonials', count: stats?.totalTestimonials ?? '—', path: '/admin/testimonials', color: '#8b5cf6', roles: ['superadmin'] },
    { title: 'Careers', icon: '💼', desc: 'Post and manage job openings', count: stats?.totalCareers ?? '—', path: '/admin/careers', color: '#10b981', roles: ['superadmin', 'careeradmin'] },
    { title: 'Applications', icon: '📄', desc: 'Review all job applications', count: stats?.totalApplications ?? '—', path: '/admin/applications', color: '#0ea5e9', roles: ['superadmin', 'careeradmin'] },
    { title: 'Contact Messages', icon: '✉️', desc: 'View contact submissions', count: stats?.totalContacts ?? '—', path: '/admin/contacts', color: '#f97316', roles: ['superadmin'] },
    { title: 'Tech Stack', icon: '⚡', desc: 'Manage technologies displayed', count: '—', path: '/admin/techstack', color: '#f59e0b', roles: ['superadmin'] },
  ];

  const cmsCards = allCmsCards.filter(c => c.roles.includes(admin?.role));

  const roleLabel = isSuperAdmin ? 'Super Admin' : isCareerAdmin ? 'Career Admin' : 'Admin';

  return (
    <main className="admin-dashboard-page">
      <section className="admin-hero">
        <div className="container admin-hero-inner">
          <div>
            <p className="section-subtitle">Welcome Back</p>
            <h1 className="section-title">Admin Dashboard</h1>
            <p>Manage site content, review applications, and keep your business data updated from one place.</p>
          </div>
          <button className="btn-outline logout-btn" onClick={logout}>Logout</button>
        </div>
      </section>

      <section className="admin-stats-section">
        <div className="container">
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Administrator</h3>
              <p>{admin?.username || 'Unknown User'}</p>
              <span>{roleLabel} — {admin?.email || ''}</span>
            </div>
            <div className="dashboard-card">
              <h3>Status</h3>
              <p>{loading ? 'Loading…' : stats?.status || 'Connected'}</p>
              <span>{stats?.environment || 'Development'}</span>
            </div>
            {isSuperAdmin && <>
              <div className="dashboard-card">
                <h3>Total Services</h3>
                <p>{loading ? '—' : stats?.totalServices ?? '0'}</p>
                <span>Active service records</span>
              </div>
              <div className="dashboard-card">
                <h3>Total Testimonials</h3>
                <p>{loading ? '—' : stats?.totalTestimonials ?? '0'}</p>
                <span>Customer reviews</span>
              </div>
            </>}
            <div className="dashboard-card">
              <h3>Open Careers</h3>
              <p>{loading ? '—' : stats?.totalCareers ?? '0'}</p>
              <span>Active positions</span>
            </div>
            <div className="dashboard-card">
              <h3>Applications</h3>
              <p>{loading ? '—' : stats?.totalApplications ?? '0'}</p>
              <span>Total submissions</span>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-stats-section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.4rem', color: '#1e40af', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Content Management</h2>
          <div className="dashboard-grid">
            {cmsCards.map(card => (
              <button
                key={card.title}
                onClick={() => navigate(card.path)}
                className="dashboard-card cms-nav-card"
                style={{ textAlign: 'left', cursor: 'pointer', border: `1px solid rgba(30,64,175,0.15)`, background: '#fff', width: '100%' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>{card.icon}</span>
                  <h3 style={{ color: card.color, margin: 0, fontSize: '1rem' }}>{card.title}</h3>
                </div>
                <p style={{ fontSize: '1.6rem', margin: '0 0 0.3rem', color: '#1e293b' }}>{loading ? '—' : card.count}</p>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{card.desc} →</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;
