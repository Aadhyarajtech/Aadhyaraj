import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { toast } from 'react-toastify';
import './AdminCMS.css';

const EMPTY_FORM = { title: '', description: '', icon: '', features: '', techStack: '', isActive: true };

const AdminServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const token = localStorage.getItem('aadhyaraj_token');

  const fetchServices = useCallback(async () => {
    try {
      const res = await axios.get('/api/services/admin/all', { headers: { Authorization: `Bearer ${token}` } });
      setServices(res.data.data || []);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const openAdd = () => { setEditingId(null); setForm(EMPTY_FORM); setShowModal(true); };

  const openEdit = (svc) => {
    setEditingId(svc._id);
    setForm({
      title: svc.title || '',
      description: svc.description || '',
      icon: svc.icon || '',
      features: Array.isArray(svc.features) ? svc.features.join(', ') : '',
      techStack: Array.isArray(svc.techStack) ? svc.techStack.join(', ') : '',
      isActive: svc.isActive !== false
    });
    setShowModal(true);
  };

  const openDelete = (id) => { setDeleteId(id); setShowConfirm(true); };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) { toast.error('Title and description are required'); return; }
    setSaving(true);
    const payload = {
      ...form,
      features: form.features.split(',').map(s => s.trim()).filter(Boolean),
      techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean)
    };
    try {
      if (editingId) {
        await axios.put(`/api/services/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Service updated!');
      } else {
        await axios.post('/api/services', payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Service added!');
      }
      setShowModal(false);
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/services/${deleteId}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Service deleted');
      setShowConfirm(false);
      fetchServices();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <main className="admin-cms-page">
      <div className="container">
        <div className="cms-header">
          <div className="cms-header-left">
            <h1>Manage Services</h1>
            <p>Add, edit, or remove services shown on the public website</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="cms-back-btn" onClick={() => navigate('/admin/dashboard')}>← Dashboard</button>
            <button className="cms-add-btn" onClick={openAdd}>+ Add Service</button>
          </div>
        </div>

        <div className="cms-stats">
          <div className="cms-stat"><div className="stat-number">{services.length}</div><div className="stat-label">Total Services</div></div>
          <div className="cms-stat"><div className="stat-number">{services.filter(s => s.isActive !== false).length}</div><div className="stat-label">Active</div></div>
        </div>

        {loading ? (
          <div className="cms-loading"><div className="cms-spinner" /><p>Loading services…</p></div>
        ) : services.length === 0 ? (
          <div className="cms-empty"><div className="empty-icon">🚀</div><p>No services yet. Click "Add Service" to get started.</p></div>
        ) : (
          <div className="cms-table-wrapper">
            <table className="cms-table">
              <thead><tr><th>Icon</th><th>Title</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {services.map(svc => (
                  <tr key={svc._id}>
                    <td style={{ fontSize: '1.5rem' }}>{svc.icon || '⚙️'}</td>
                    <td className="td-title">{svc.title}</td>
                    <td className="td-desc">{svc.description}</td>
                    <td><span className={`badge ${svc.isActive !== false ? 'badge-active' : 'badge-inactive'}`}>{svc.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                    <td><div className="action-btns"><button className="btn-edit" onClick={() => openEdit(svc)}>✏️ Edit</button><button className="btn-delete" onClick={() => openDelete(svc._id)}>🗑️ Delete</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="cms-modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="cms-modal">
            <h2>{editingId ? '✏️ Edit Service' : '+ Add New Service'}</h2>
            <form className="cms-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Title *</label><input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Cloud Solutions" required /></div>
                <div className="form-group"><label>Icon (emoji)</label><input name="icon" value={form.icon} onChange={handleChange} placeholder="e.g. ☁️" /></div>
              </div>
              <div className="form-group"><label>Description *</label><textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe this service…" required /></div>
              <div className="form-group"><label>Features (comma-separated)</label><input name="features" value={form.features} onChange={handleChange} placeholder="Feature 1, Feature 2" /></div>
              <div className="form-group"><label>Tech Stack (comma-separated)</label><input name="techStack" value={form.techStack} onChange={handleChange} placeholder="React, Node.js, MongoDB" /></div>
              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" name="isActive" id="svc-active" checked={form.isActive} onChange={handleChange} style={{ width: 'auto' }} />
                <label htmlFor="svc-active" style={{ textTransform: 'none', marginBottom: 0 }}>Active (visible on public site)</label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update Service' : 'Add Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="cms-modal-overlay" onClick={e => e.target === e.currentTarget && setShowConfirm(false)}>
          <div className="cms-modal confirm-modal">
            <h2>🗑️ Delete Service</h2>
            <p>Are you sure you want to delete this service? This action cannot be undone.</p>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn-confirm-delete" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminServices;
