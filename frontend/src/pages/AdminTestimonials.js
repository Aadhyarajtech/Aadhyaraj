import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { toast } from 'react-toastify';
import './AdminCMS.css';

const EMPTY = { name: '', position: '', company: '', country: '', icon: '🏢', message: '', rating: 5, isActive: true };

const AdminTestimonials = () => {
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
      const res = await axios.get('/api/testimonials/admin/all', { headers: { Authorization: `Bearer ${token}` } });
      setItems(res.data.data || []);
    } catch { toast.error('Failed to load testimonials'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openAdd = () => { setEditingId(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (t) => {
    setEditingId(t._id);
    setForm({ name: t.name || '', position: t.position || '', company: t.company || '', country: t.country || '', icon: t.icon || '🏢', message: t.message || '', rating: t.rating || 5, isActive: t.isActive !== false });
    setShowModal(true);
  };
  const openDelete = (id) => { setDeleteId(id); setShowConfirm(true); };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) { toast.error('Name and message are required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, rating: Number(form.rating) };
      if (editingId) {
        await axios.put(`/api/testimonials/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Testimonial updated!');
      } else {
        await axios.post('/api/testimonials', payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Testimonial added!');
      }
      setShowModal(false);
      fetchItems();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/testimonials/${deleteId}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Testimonial deleted');
      setShowConfirm(false);
      fetchItems();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <main className="admin-cms-page">
      <div className="container">
        <div className="cms-header">
          <div className="cms-header-left">
            <h1>Manage Testimonials</h1>
            <p>Add, edit, or remove client testimonials</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="cms-back-btn" onClick={() => navigate('/admin/dashboard')}>← Dashboard</button>
            <button className="cms-add-btn" onClick={openAdd}>+ Add Testimonial</button>
          </div>
        </div>

        <div className="cms-stats">
          <div className="cms-stat"><div className="stat-number">{items.length}</div><div className="stat-label">Total</div></div>
          <div className="cms-stat"><div className="stat-number">{items.filter(i => i.isActive !== false).length}</div><div className="stat-label">Active</div></div>
        </div>

        {loading ? (
          <div className="cms-loading"><div className="cms-spinner" /><p>Loading…</p></div>
        ) : items.length === 0 ? (
          <div className="cms-empty"><div className="empty-icon">💬</div><p>No testimonials yet.</p></div>
        ) : (
          <div className="cms-table-wrapper">
            <table className="cms-table">
              <thead><tr><th>Icon</th><th>Name</th><th>Company</th><th>Message</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map(t => (
                  <tr key={t._id}>
                    <td style={{ fontSize: '1.4rem' }}>{t.icon || '🏢'}</td>
                    <td>
                      <div className="td-title">{t.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{t.position}</div>
                    </td>
                    <td>{t.company}{t.country ? `, ${t.country}` : ''}</td>
                    <td className="td-desc">{t.message}</td>
                    <td>{'★'.repeat(t.rating || 5)}</td>
                    <td><span className={`badge ${t.isActive !== false ? 'badge-active' : 'badge-inactive'}`}>{t.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                    <td><div className="action-btns"><button className="btn-edit" onClick={() => openEdit(t)}>✏️ Edit</button><button className="btn-delete" onClick={() => openDelete(t._id)}>🗑️ Delete</button></div></td>
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
            <h2>{editingId ? '✏️ Edit Testimonial' : '+ Add Testimonial'}</h2>
            <form className="cms-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Name *</label><input name="name" value={form.name} onChange={handleChange} placeholder="Client name" required /></div>
                <div className="form-group"><label>Rating</label>
                  <select name="rating" value={form.rating} onChange={handleChange}>
                    {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Position</label><input name="position" value={form.position} onChange={handleChange} placeholder="e.g. CTO" /></div>
                <div className="form-group"><label>Company</label><input name="company" value={form.company} onChange={handleChange} placeholder="Company name" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Country</label><input name="country" value={form.country} onChange={handleChange} placeholder="e.g. USA" /></div>
                <div className="form-group"><label>Icon</label><input name="icon" value={form.icon} onChange={handleChange} placeholder="e.g. 🏢" /></div>
              </div>
              <div className="form-group"><label>Message *</label><textarea name="message" value={form.message} onChange={handleChange} placeholder="Client's testimonial…" required /></div>
              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" name="isActive" id="test-active" checked={form.isActive} onChange={handleChange} style={{ width: 'auto' }} />
                <label htmlFor="test-active" style={{ textTransform: 'none', marginBottom: 0 }}>Active (visible on site)</label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update' : 'Add Testimonial'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="cms-modal-overlay" onClick={e => e.target === e.currentTarget && setShowConfirm(false)}>
          <div className="cms-modal confirm-modal">
            <h2>🗑️ Delete Testimonial</h2>
            <p>Are you sure you want to delete this testimonial?</p>
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

export default AdminTestimonials;
