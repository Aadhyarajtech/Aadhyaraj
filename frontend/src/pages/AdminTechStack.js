import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { toast } from 'react-toastify';
import './AdminCMS.css';

const CATEGORIES = ['frontend', 'backend', 'database', 'cloud-devops', 'ai-machine-learning', 'mobile', 'other'];
const CATEGORY_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  'cloud-devops': 'Cloud & DevOps',
  'ai-machine-learning': 'AI / Machine Learning',
  mobile: 'Mobile',
  other: 'Other'
};
const EMPTY = { category: 'frontend', order: 0, isActive: true, technologies: '' };

const parseTechnologies = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((tech) => typeof tech === 'string' ? tech.trim() : tech?.name || '').filter(Boolean);
  }
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
};

const AdminTechStack = () => {
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
      const res = await axios.get('/api/techstack/admin/all', { headers: { Authorization: `Bearer ${token}` } });
      setItems(res.data.data || []);
    } catch {
      toast.error('Failed to load tech stack');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openAdd = () => { setEditingId(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (item) => {
    const techLines = parseTechnologies(item.technologies).join('\n');
    setEditingId(item._id);
    setForm({ category: item.category || 'frontend', order: item.order || 0, isActive: item.isActive !== false, technologies: techLines });
    setShowModal(true);
  };
  const openDelete = (id) => { setDeleteId(id); setShowConfirm(true); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const techs = parseTechnologies(form.technologies);
    if (!form.category) {
      toast.error('Category is required');
      return;
    }
    if (techs.length === 0) {
      toast.error('Add at least one technology');
      return;
    }

    setSaving(true);
    try {
      const payload = { category: form.category, order: Number(form.order), isActive: form.isActive, technologies: techs };
      if (editingId) {
        await axios.put(`/api/techstack/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Tech category updated!');
      } else {
        await axios.post('/api/techstack', payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Tech category added!');
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/techstack/${deleteId}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Tech category deleted');
      setShowConfirm(false);
      fetchItems();
    } catch {
      toast.error('Delete failed');
    }
  };

  const grouped = CATEGORIES.reduce((acc, category) => {
    acc[category] = items.filter((item) => item.category === category);
    return acc;
  }, {});

  return (
    <main className="admin-cms-page">
      <div className="container">
        <div className="cms-header">
          <div className="cms-header-left">
            <h1>Manage Tech Stack</h1>
            <p>Manage technologies shown on the public Tech Stack page</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="cms-back-btn" onClick={() => navigate('/admin/dashboard')}>← Dashboard</button>
            <button className="cms-add-btn" onClick={openAdd}>+ Add Category</button>
          </div>
        </div>

        <div className="cms-stats">
          <div className="cms-stat"><div className="stat-number">{items.length}</div><div className="stat-label">Categories</div></div>
          <div className="cms-stat"><div className="stat-number">{items.filter((item) => item.isActive !== false).length}</div><div className="stat-label">Active</div></div>
          <div className="cms-stat"><div className="stat-number">{CATEGORIES.filter((category) => grouped[category]?.length > 0).length}</div><div className="stat-label">Used</div></div>
        </div>

        {loading ? (
          <div className="cms-loading"><div className="cms-spinner" /><p>Loading…</p></div>
        ) : items.length === 0 ? (
          <div className="cms-empty"><div className="empty-icon">⚡</div><p>No tech categories yet. Click "Add Category" to get started.</p></div>
        ) : (
          <div className="cms-table-wrapper">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Technologies</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td><span className="badge badge-category">{CATEGORY_LABELS[item.category] || item.category}</span></td>
                    <td className="td-desc">{parseTechnologies(item.technologies).join(', ')}</td>
                    <td><span className={`badge ${item.isActive !== false ? 'badge-active' : 'badge-inactive'}`}>{item.isActive !== false ? 'Active' : 'Hidden'}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => openEdit(item)}>✏️ Edit</button>
                        <button className="btn-delete" onClick={() => openDelete(item._id)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {items.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#f9d76f', marginBottom: '1rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>By Category</h3>
            <div className="cms-stats" style={{ flexWrap: 'wrap' }}>
              {CATEGORIES.map((category) => grouped[category]?.length > 0 && (
                <div key={category} className="cms-stat">
                  <div className="stat-number">{grouped[category].length}</div>
                  <div className="stat-label" style={{ textTransform: 'capitalize' }}>{CATEGORY_LABELS[category]}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="cms-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="cms-modal">
            <h2>{editingId ? '✏️ Edit Tech Category' : '+ Add Tech Category'}</h2>
            <form className="cms-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>{CATEGORY_LABELS[category]}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Order (lower = first)</label>
                  <input type="number" name="order" value={form.order} onChange={handleChange} min="0" />
                </div>
              </div>
              <div className="form-group">
                <label>Technologies *</label>
                <textarea
                  name="technologies"
                  value={form.technologies}
                  onChange={handleChange}
                  placeholder="One technology per line, e.g. React.js"
                  rows={6}
                  required
                />
              </div>
              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" name="isActive" id="tech-active" checked={form.isActive} onChange={handleChange} style={{ width: 'auto' }} />
                <label htmlFor="tech-active" style={{ textTransform: 'none', marginBottom: 0 }}>Active (visible on site)</label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update' : 'Add Category'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="cms-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowConfirm(false)}>
          <div className="cms-modal confirm-modal">
            <h2>🗑️ Delete Tech Category</h2>
            <p>Are you sure you want to remove this technology category?</p>
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

export default AdminTechStack;
