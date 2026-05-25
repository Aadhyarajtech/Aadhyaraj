import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../api';
import { toast } from 'react-toastify';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [application, setApplication] = useState({ name: '', email: '', phone: '', message: '',experience: '0-1 years',skills: '' });
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/careers/${id}`);
        setJob(response.data.data || response.data);
      } catch (err) {
        console.warn('Failed to load job:', err);
        toast.error('Could not load job details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleChange = e => setApplication(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleResume = e => setResume(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!application.name || !application.email || !application.message || !resume) {
      toast.error('Please complete all required fields and attach your resume.');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('applicantName', application.name);
    formData.append('email', application.email);
    formData.append('phone', application.phone);
    formData.append('coverLetter', application.message);
    formData.append('experience', application.experience);
    formData.append('skills', application.skills);
    formData.append('resume', resume);

    try {
      await axios.post(`/api/careers/${id}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Application submitted successfully!');
      setApplication({ name: '', email: '', phone: '', message: '' });
      setResume(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="jd-loading">
        <div className="jd-spinner" />
        <p>Loading job details…</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="jd-not-found">
        <h2>Job not found</h2>
        <button className="jd-back-btn" onClick={() => navigate('/careers')}>
          ← Back to Careers
        </button>
      </div>
    );
  }

  return (
    <main className="jd-page">
      {/* ── Hero banner ── */}
      <section className="jd-hero">
        <div className="jd-container">
          <button className="jd-back-btn" onClick={() => navigate('/careers')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Careers
          </button>

          <motion.div
            className="jd-hero-content"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="jd-hero-pills">
              <span className="pill pill-experience">{job.experience || 'Experience Required'}</span>
              {job.location  && <span className="pill pill-location">{job.location}</span>}
            </div>
            <h1 className="jd-title">{job.title}</h1>
            <div className="jd-hero-meta">
              {job.location && (
                <span className="jd-meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {job.location}
                </span>
              )}
              <span className="jd-meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Posted recently
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Body: details + form ── */}
      <section className="jd-body">
        <div className="jd-container jd-two-col">

          {/* Left – Job Details */}
          <motion.aside
            className="jd-details"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* About the role */}
            {job.description && (
              <div className="jd-section">
                <h2 className="jd-section-title">About the Role</h2>
                <p className="jd-text">{job.description}</p>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="jd-section">
                <h2 className="jd-section-title">Responsibilities</h2>
                <ul className="jd-list">
                  {job.responsibilities.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="jd-section">
                <h2 className="jd-section-title">Requirements</h2>
                <ul className="jd-list">
                  {job.requirements.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {/* {job.skills && job.skills.length > 0 && (
              <div className="jd-section">
                <h2 className="jd-section-title">Skills &amp; Technologies</h2>
                <div className="jd-skills">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="jd-skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )} */}
          </motion.aside>

          {/* Right – Application Form */}
          <motion.div
            className="jd-form-card"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <div className="jd-form-header">
              <p className="jd-form-eyebrow">Ready to Apply</p>
              <h2 className="jd-form-title">Submit Your Application</h2>
              <p className="jd-form-sub">
                You are applying for <strong>{job.title}</strong>. Complete the form below and attach your resume.
              </p>
            </div>

            <form className="jd-form" onSubmit={handleSubmit}>
              <div className="jd-form-row">
                <label className="jd-label">
                  Full Name<span>*</span>
                  <input
                    name="name"
                    value={application.name}
                    onChange={handleChange}
                    placeholder="Anna Patel"
                    required
                  />
                </label>
                <label className="jd-label">
                  Email Address<span>*</span>
                  <input
                    type="email"
                    name="email"
                    value={application.email}
                    onChange={handleChange}
                    placeholder="anna@domain.com"
                    required
                  />
                </label>
              </div>

              <div className="jd-form-row">
                <label className="jd-label">
                  Phone Number<span>*</span>
                  <input
                    name="phone"
                    value={application.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                  />
                </label>
                  <label className="jd-label">
                Experience<span>*</span>
                <select
                  name="experience"
                  value={application.experience}
                  onChange={handleChange}
                  required
                >
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-8 years">5-8 years</option>
                  <option value="8+ years">8+ years</option>
                </select>
              </label>
                {job.title === 'Open Application – Domain Based Hiring' && (
                  <label className="jd-label">
                    Your Skills<span>*</span>

                    <input
                      type="text"
                      name="skills"
                      value={application.skills || ''}
                      onChange={handleChange}
                      placeholder="Frontend, React, Java, AI, UI/UX..."
                      required
                    />
                  </label>
                )}
                <label className="jd-label">
                  Resume<span>*</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleResume}
                    required
                  />
                </label>
              </div>

              <label className="jd-label">
                Cover Note<span>*</span>
                <textarea
                  name="message"
                  value={application.message}
                  onChange={handleChange}
                  placeholder="Tell us why you're the best fit for this position."
                  rows="5"
                  required
                />
              </label>

              <button type="submit" className="jd-submit-btn" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
            </form>
          </motion.div>

        </div>
      </section>
    </main>
  );
};

export default JobDetail;