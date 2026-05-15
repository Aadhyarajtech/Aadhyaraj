
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import './Careers.css';

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await axios.get('/api/careers');
        const list = response.data.data || [];
        setCareers(list);
      } catch (err) {
        console.warn('Failed to load careers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareers();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);



  return (
    <main className="careers-page">
      {/* ── Hero ── */}
      <section className="careers-hero">
        <div className="container">
          <motion.h1
            className="page-title reveal"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Join Our Team
          </motion.h1>
          <motion.p
            className="page-subtitle reveal"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Shape the future of technology with us. We're looking for talented individuals to join our innovative team.
          </motion.p>
        </div>
      </section>

      {/* ── Current Openings (new list style) ── */}
      <section className="job-openings">
        <div className="container">
          <motion.div
            className="openings-header reveal"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="openings-bar" />
            <h2 className="section-title">Current Openings</h2>
          </motion.div>

          <div className="jobs-list">
            {isLoading ? (
              <div className="loading-message">Loading job openings…</div>
            ) : careers.length > 0 ? (
              careers.map((job, index) => (
                <motion.div
                  key={job._id || index}
                  className="job-row"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true }}
                >
                  <div className="job-row-left">
                    <div className="job-row-pills">
                      <span className="pill pill-experience">{job.experience || 'Experience Required'}</span>
                      {job.location && (
                        <span className="pill pill-location">{job.location}</span>
                      )}
                    </div>
                    <h3 className="job-row-title">{job.title}</h3>
                    <div className="job-row-meta">
                      {job.location && (
                        <span className="job-row-meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {job.location}
                        </span>
                      )}
                      <span className="job-row-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Posted recently
                      </span>
                    </div>
                  </div>

                  <button
                    className="job-row-btn"
                    onClick={() => navigate(`/careers/${job._id}`)}
                  >
                    View Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="no-jobs">No job openings are available right now. Please check back later.</div>
            )}
          </div>
        </div>
      </section>

      {/* ── Application Form ── */}
      
    </main>
  );
};

export default Careers;