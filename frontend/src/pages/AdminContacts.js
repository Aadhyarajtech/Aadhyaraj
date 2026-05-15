import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminCMS.css';

const AdminContacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('aadhyaraj_token');

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/contact', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContacts(response.data.data.contacts || []);
      } catch (error) {
        toast.error('Failed to load contact submissions.');
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [token]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <main className="admin-cms-page">
      <div className="container">
        <div className="cms-header">
          <div className="cms-header-left">
            <h1>Contact Submissions</h1>
            <p>Review incoming contact form messages submitted by website visitors.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="cms-back-btn" onClick={() => navigate('/admin/dashboard')}>← Dashboard</button>
          </div>
        </div>

        {loading ? (
          <div className="cms-loading"><div className="cms-spinner" /><p>Loading contact messages…</p></div>
        ) : contacts.length === 0 ? (
          <div className="cms-empty">
            <div className="empty-icon">✉️</div>
            <p>No contact submissions available.</p>
          </div>
        ) : (
          <div className="cms-table-wrapper">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id}>
                    <td className="td-title">{contact.name || 'N/A'}</td>
                    <td>{contact.email || 'N/A'}</td>
                    <td>{contact.subject || 'N/A'}</td>
                    <td>{contact.message || '—'}</td>
                    <td>{formatDate(contact.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminContacts;
