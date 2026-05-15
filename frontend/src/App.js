import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Careers from './pages/Careers';
import JobDetail from './pages/JobDetail';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminServices from './pages/AdminServices';
import AdminTestimonials from './pages/AdminTestimonials';
import AdminCareers from './pages/AdminCareers';
import AdminTechStack from './pages/AdminTechStack';
import AdminApplications from './pages/AdminApplications';
import AdminContacts from './pages/AdminContacts';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:id" element={<JobDetail />} /> 
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          {/* Super admin only */}
          <Route path="/admin/services" element={<ProtectedRoute requireRole="superadmin"><AdminServices /></ProtectedRoute>} />
          <Route path="/admin/testimonials" element={<ProtectedRoute requireRole="superadmin"><AdminTestimonials /></ProtectedRoute>} />
          <Route path="/admin/techstack" element={<ProtectedRoute requireRole="superadmin"><AdminTechStack /></ProtectedRoute>} />
          <Route path="/admin/contacts" element={<ProtectedRoute requireRole="superadmin"><AdminContacts /></ProtectedRoute>} />
          {/* Career admin + super admin */}
          <Route path="/admin/applications" element={<ProtectedRoute requireRole="careeradmin"><AdminApplications /></ProtectedRoute>} />
          <Route path="/admin/careers" element={<ProtectedRoute requireRole="careeradmin"><AdminCareers /></ProtectedRoute>} />
        </Routes>
        <Footer />
        <Chatbot />
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          theme="light"
          toastStyle={{ background: '#fff', border: '1px solid #e2e8f0', color: '#0f172a' }}
        />
      </div>
    </Router>
  );
}

export default App;
