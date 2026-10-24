import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const passwordSubmittingRef = useRef(false);
  let admin = null;
  try {
    const storedAdmin = localStorage.getItem('aadhyaraj_admin');
    admin = storedAdmin && storedAdmin !== 'undefined' ? JSON.parse(storedAdmin) : null;
  } catch { admin = null; }

  const isSuperAdmin = admin?.role === 'superadmin';
  const isCareerAdmin = admin?.role === 'careeradmin';

  const logout = useCallback(() => {
    localStorage.removeItem('aadhyaraj_token');
    localStorage.removeItem('aadhyaraj_admin');
    toast.info('Logged out successfully.');
    navigate('/admin');
  }, [navigate]);

  const openPasswordModal = () => {
    setPasswordError('');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswords(false);
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    if (changingPassword) return;
    setShowPasswordModal(false);
    setPasswordError('');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswords(false);
  };

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordSubmittingRef.current) return;
    setPasswordError('');

    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError('New password must be different from the current password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    passwordSubmittingRef.current = true;
    setChangingPassword(true);
    try {
      const token = localStorage.getItem('aadhyaraj_token');
      await axios.put('/api/admin/profile', { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Password updated successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswords(false);
      setShowPasswordModal(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to change password. Please try again.';
      setPasswordError(message);
      toast.error(message);
    } finally {
      passwordSubmittingRef.current = false;
      setChangingPassword(false);
    }
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
  }, [navigate,logout]);

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
          <div className="admin-hero-actions">
            <button className="btn-outline logout-btn" onClick={openPasswordModal}>Change Password</button>
            <button className="btn-outline logout-btn" onClick={logout}>Logout</button>
          </div>
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
      {showPasswordModal && (
        <div
          className="password-modal-backdrop"
          onMouseDown={(e) => { if (e.target === e.currentTarget) closePasswordModal(); }}
        >
          <div className="password-modal" role="dialog" aria-modal="true" aria-labelledby="change-password-title">
            <div className="password-modal-header">
              <h2 id="change-password-title">Change Password</h2>
              <button type="button" className="password-modal-close" onClick={closePasswordModal} aria-label="Close change password form" disabled={changingPassword}>×</button>
            </div>
            <form className="password-form" onSubmit={handlePasswordSubmit} noValidate>
              <div className="password-field">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordInput}
                  autoComplete="current-password"
                  required
                  autoFocus
                  disabled={changingPassword}
                />
              </div>
              <div className="password-field">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInput}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  disabled={changingPassword}
                />
                <span className="password-hint">At least 8 characters.</span>
              </div>
              <div className="password-field">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordInput}
                  autoComplete="new-password"
                  required
                  disabled={changingPassword}
                />
              </div>
              <label className="password-show-toggle">
                <input type="checkbox" checked={showPasswords} onChange={(e) => setShowPasswords(e.target.checked)} disabled={changingPassword} />
                Show passwords
              </label>
              {passwordError && <p className="password-error" role="alert">{passwordError}</p>}
              <div className="password-form-actions">
                <button type="button" className="btn-outline" onClick={closePasswordModal} disabled={changingPassword}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={changingPassword} aria-busy={changingPassword}>
                  {changingPassword ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminDashboard;
