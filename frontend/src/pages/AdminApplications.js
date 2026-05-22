import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { toast } from 'react-toastify';
import './AdminCMS.css';

const AdminApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const token = localStorage.getItem('aadhyaraj_token');

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/careers/applications/all?page=${page}&limit=25`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(response.data.data.applications || []);
        setPagination(response.data.data.pagination || {});
      } catch (error) {
        toast.error('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [page, token]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
 const updateApplicationStatus = async (id, status) => {
  try {
    const response = await axios.put(
      `/api/careers/applications/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.success) {
      setApplications(prev =>
        prev.map(app =>
          app._id === id ? { ...app, status } : app
        )
      );

      toast.success('Status updated successfully');
    } else {
      toast.error(response.data.message || 'Update failed');
    }
  } catch (error) {
    console.log(error);

    toast.error(
      error.response?.data?.message ||
      error.message ||
      'Failed to update status'
    );
  }
};

  const renderResume = (resume) => {
    if (!resume) return 'No resume';
    const isUrl = /^https?:\/\//i.test(resume);
    if (isUrl) {
      return (
        <a className="resume-link" href={resume} target="_blank" rel="noreferrer">View Resume</a>
      );
    }
    return <span className="resume-text">{resume}</span>;
  };

  return (
    <main className="admin-cms-page">
      <div className="container">
        <div className="cms-header">
          <div className="cms-header-left">
            <h1>Applications Management</h1>
            <p>View all job applications submitted through the careers page.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="cms-back-btn" onClick={() => navigate('/admin/dashboard')}>← Dashboard</button>
          </div>
        </div>

        {loading ? (
          <div className="cms-loading"><div className="cms-spinner" /><p>Loading applications…</p></div>
        ) : applications.length === 0 ? (
          <div className="cms-empty">
            <div className="empty-icon">📄</div>
            <p>No job applications found yet.</p>
          </div>
        ) : (
          <div className="cms-table-wrapper">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Job Title</th>
                  <th>Resume</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application._id}>
                    <td className="td-title">{application.applicantName || 'N/A'}</td>
                    <td>{application.email || 'N/A'}</td>
                    <td>{application.phone || 'N/A'}</td>
                    <td>{application.career?.title || 'N/A'}</td>
                    <td>{renderResume(application.resume)}</td>
                    {/*<td>
                      <a
                        href={`https://aadhyaraj.onrender.com/${application.resume}`}
                      >
                      </a>
                    </td>*/}
                    {/* <td><span className={`badge ${application.status === 'pending' ? 'badge-inactive' : 'badge-active'}`}>{application.status || 'pending'}</span></td> */}
                    <td>
                      <select
                        value={application.status || 'pending'}
                        onChange={(e) =>
                          updateApplicationStatus(application._id, e.target.value)
                        }
                        className="status-dropdown"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="offered">Offered</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td>{formatDate(application.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && pagination.totalPages > 1 && (
          <div className="cms-pagination" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button className="btn-cancel" disabled={!pagination.hasPrev} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
            <button className="btn-save" disabled={!pagination.hasNext} onClick={() => setPage((prev) => prev + 1)}>Next</button>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminApplications;
