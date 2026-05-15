import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('aadhyaraj_token');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    // Make reveal elements visible on mount
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => el.classList.add('visible'));
  }, []);

  const handleChange = e => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/admin/login', credentials);
      const { token, admin } = response.data.data;
      localStorage.setItem('aadhyaraj_token', token);
      localStorage.setItem('aadhyaraj_admin', JSON.stringify(admin));
      toast.success('Logged in successfully.');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-auth-hero">
        <div className="container auth-grid">
          <div className="auth-copy reveal">
            <p className="section-subtitle">Admin Access</p>
            <h1 className="section-title">Secure Dashboard Login</h1>
            <p>Sign in to manage services, testimonials, careers, applications, contacts, and site settings.</p>
          </div>
          <form className="auth-form reveal" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>Admin Login</h2>
              <p>Enter your administrator credentials.</p>
            </div>
            <label>
              Email Address
              <input type="email" name="email" value={credentials.email} onChange={handleChange} placeholder="admin@aadhyarajtech.com" required />
            </label>
            <label>
              Password
              <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="••••••••" required />
            </label>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default AdminLogin;
