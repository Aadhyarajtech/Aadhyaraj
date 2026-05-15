import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminCMS.css';

const EMPTY = { title: '', department: '', location: '', type: 'Full-time', experience: 'Mid Level', description: '', requirements: '', responsibilities: '', isActive: true };

const AdminCareers = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const token = localStorage.getItem('aadhyaraj_token');

  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get('/api/careers/admin/all', { headers: { Authorization: `Bearer ${token}` } });
      setItems(res.data.data || []);
    } catch { toast.error('Failed to load careers'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openAdd = () => { setEditingId(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (c) => {
    setEditingId(c._id);
    setForm({
      title: c.title || '', department: c.department || '', location: c.location || '',
      type: c.type || 'Full-time', experience: c.experience || 'Mid Level',
      description: c.description || '',
      requirements: Array.isArray(c.requirements) ? c.requirements.join('\n') : (c.requirements || ''),
      responsibilities: Array.isArray(c.responsibilities) ? c.responsibilities.join('\n') : (c.responsibilities || ''),
      isActive: c.isActive !== false
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
    if (!form.title.trim() || !form.department.trim() || !form.location.trim() || !form.experience.trim()) {
      toast.error('Title, department, location, and experience are required'); return;
    }
    setSaving(true);
    const payload = {
      ...form,
      requirements: form.requirements.split('\n').map(s => s.trim()).filter(Boolean),
      responsibilities: form.responsibilities.split('\n').map(s => s.trim()).filter(Boolean)
    };
    try {
      if (editingId) {
        await axios.put(`/api/careers/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Career updated!');
      } else {
        await axios.post('/api/careers', payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Career added!');
      }
      setShowModal(false);
      fetchItems();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/careers/${deleteId}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Career deleted');
      setShowConfirm(false);
      fetchItems();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <main className="admin-cms-page">
      <div className="container">
        <div className="cms-header">
          <div className="cms-header-left">
            <h1>Manage Careers</h1>
            <p>Post and manage job openings on the public website</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="cms-back-btn" onClick={() => navigate('/admin/dashboard')}>← Dashboard</button>
            <button className="cms-add-btn" onClick={openAdd}>+ Post Job</button>
          </div>
        </div>

        <div className="cms-stats">
          <div className="cms-stat"><div className="stat-number">{items.length}</div><div className="stat-label">Total Positions</div></div>
          <div className="cms-stat"><div className="stat-number">{items.filter(i => i.isActive !== false).length}</div><div className="stat-label">Open</div></div>
        </div>

        {loading ? (
          <div className="cms-loading"><div className="cms-spinner" /><p>Loading…</p></div>
        ) : items.length === 0 ? (
          <div className="cms-empty"><div className="empty-icon">💼</div><p>No job openings yet. Click "Post Job" to add one.</p></div>
        ) : (
          <div className="cms-table-wrapper">
            <table className="cms-table">
              <thead><tr><th>Title</th><th>Department</th><th>Type</th><th>Location</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map(c => (
                  <tr key={c._id}>
                    <td className="td-title">{c.title}</td>
                    <td>{c.department}</td>
                    <td><span className="badge badge-category">{c.type}</span></td>
                    <td>{c.location}</td>
                    <td><span className={`badge ${c.isActive !== false ? 'badge-active' : 'badge-inactive'}`}>{c.isActive !== false ? 'Open' : 'Closed'}</span></td>
                    <td><div className="action-btns"><button className="btn-edit" onClick={() => openEdit(c)}>✏️ Edit</button><button className="btn-delete" onClick={() => openDelete(c._id)}>🗑️ Delete</button></div></td>
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
            <h2>{editingId ? '✏️ Edit Job Posting' : '+ Post New Job'}</h2>
            <form className="cms-form" onSubmit={handleSubmit}>
              <div className="form-group"><label>Job Title *</label><input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Senior React Developer" required /></div>
              <div className="form-row">
                <div className="form-group"><label>Department *</label><input name="department" value={form.department} onChange={handleChange} placeholder="e.g. Engineering" required /></div>
                <div className="form-group"><label>Location *</label><input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Hyderabad / Remote" required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Job Type</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    {['Full-time','Part-time','Contract','Remote','Hybrid'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Years of Experience *</label>
                  <input
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="e.g. 2+ years, Mid Level, Senior Level"
                    required
                  />
                </div>
              </div>
              <div className="form-group"><label>Job Description</label><textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the role…" /></div>
              <div className="form-group"><label>Requirements (one per line)</label><textarea name="requirements" value={form.requirements} onChange={handleChange} placeholder="3+ years React experience&#10;Strong Node.js skills" /></div>
              <div className="form-group"><label>Responsibilities (one per line)</label><textarea name="responsibilities" value={form.responsibilities} onChange={handleChange} placeholder="Build scalable APIs&#10;Collaborate with design team" /></div>
              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" name="isActive" id="career-active" checked={form.isActive} onChange={handleChange} style={{ width: 'auto' }} />
                <label htmlFor="career-active" style={{ textTransform: 'none', marginBottom: 0 }}>Open (visible to applicants)</label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update Job' : 'Post Job'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="cms-modal-overlay" onClick={e => e.target === e.currentTarget && setShowConfirm(false)}>
          <div className="cms-modal confirm-modal">
            <h2>🗑️ Delete Job Posting</h2>
            <p>Are you sure you want to delete this job posting? This cannot be undone.</p>
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

export default AdminCareers;
