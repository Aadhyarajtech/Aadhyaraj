import React from 'react';
import { Navigate } from 'react-router-dom';

const getAdmin = () => {
  try {
    const s = localStorage.getItem('aadhyaraj_admin');
    return s && s !== 'undefined' ? JSON.parse(s) : null;
  } catch { return null; }
};

// requireRole: 'any' | 'superadmin' | 'careeradmin'
const ProtectedRoute = ({ children, requireRole = 'any' }) => {
  const token = localStorage.getItem('aadhyaraj_token');
  if (!token) return <Navigate to="/admin" replace />;

  const admin = getAdmin();
  if (!admin) return <Navigate to="/admin" replace />;

  if (requireRole === 'superadmin' && admin.role !== 'superadmin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (requireRole === 'careeradmin' && admin.role !== 'superadmin' && admin.role !== 'careeradmin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
