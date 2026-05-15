import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../api';
import { toast } from 'react-toastify';
import './Contact.css';

const offices = [
  { flag: '🇮🇳', country: 'India', label: 'Headquarters', email: 'info@aadhyarajtech.com', phone: '+91 91279 12345' },
  { flag: '🇺🇸', country: 'United States', label: 'Delivery Centre', email: 'us@aadhyarajtech.com', phone: '+1 800 000 0000' },
  { flag: '🇬🇧', country: 'United Kingdom', label: 'Delivery Centre', email: 'uk@aadhyarajtech.com', phone: '+44 20 0000 0000' },
  { flag: '🇦🇺', country: 'Australia', label: 'Delivery Centre', email: 'au@aadhyarajtech.com', phone: '+61 2 0000 0000' },
  { flag: '🇳🇿', country: 'New Zealand', label: 'Delivery Centre', email: 'nz@aadhyarajtech.com', phone: '+64 9 000 0000' },
  { flag: '🇲🇾', country: 'Malaysia', label: 'Delivery Centre', email: 'my@aadhyarajtech.com', phone: '+60 3 0000 0000' },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', service: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/contact', form);
      toast.success(res.data.message || 'Message sent successfully!');
      setForm({ name: '', email: '', phone: '', subject: '', service: '', message: '' });
    } catch (err) {
      toast.error('Failed to send. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-bg">
          <div className="page-hero-grid"></div>
          <div className="page-hero-orb"></div>
        </div>
        <div className="container page-hero-content">
          <p className="section-subtitle">Get In Touch</p>
          <h1 className="section-title">Let's Build <span>Together</span></h1>
          <div className="gold-line"></div>
          <p>Have a project in mind? Looking for a technology partner? We'd love to hear from you. Our team typically responds within 24 hours.</p>
        </div>
      </section>

      {/* CONTACT MAIN */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            {/* FORM */}
            <motion.div
              className="contact-form-wrapper reveal"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="form-header">
                <h2>Send Us a Message</h2>
                <p>Fill in your details and we'll get back to you promptly.</p>
              </div>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name <span>*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address <span>*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 000 000 0000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Service of Interest</label>
                    <select name="service" value={form.service} onChange={handleChange}>
                      <option value="">Select a service...</option>
                      <option value="Custom Software Development">Custom Software Development</option>
                      <option value="Enterprise Web Solutions">Enterprise Web Solutions</option>
                      <option value="IT Consulting & Strategy">IT Consulting & Strategy</option>
                      <option value="Cloud & DevOps">Cloud & DevOps Services</option>
                      <option value="Maintenance & Support">Maintenance & Support</option>
                      <option value="Training & Implementation">Training & Implementation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject <span>*</span></label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message <span>*</span></label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project, goals, timeline, and budget..."
                    rows="6"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary submit-btn" disabled={loading}>
                  {loading ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* INFO */}
            <motion.div
              className="contact-info reveal"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="info-block">
                <h3>Why Work With Us?</h3>
                <ul className="info-points">
                  {[
                    '✦ Dedicated project team from day one',
                    '✦ Transparent communication throughout',
                    '✦ Agile delivery with regular checkpoints',
                    '✦ 92.7% client satisfaction rate',
                    '✦ Speed and Quality guaranteed',
                    '✦ Flexible engagement models',
                  ].map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div className="info-block">
                <h3>Direct Contact</h3>
                <div className="direct-contacts">
                  <div className="direct-item">
                    <div className="direct-icon">📧</div>
                    <div>
                      <div className="direct-label">Email</div>
                      <a href="mailto:info@aadhyarajtech.com">info@aadhyarajtech.com</a>
                    </div>
                  </div>
                  <div className="direct-item">
                    <div className="direct-icon">📞</div>
                    <div>
                      <div className="direct-label">Phone (India)</div>
                      <a href="tel:+919127912345">+91 91279 12345</a>
                    </div>
                  </div>
                  <div className="direct-item">
                    <div className="direct-icon">⏰</div>
                    <div>
                      <div className="direct-label">Response Time</div>
                      <span>Within 24 business hours</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-block">
                <h3>Follow Us</h3>
                <div className="social-icons">
                  <a href="#" className="social-icon">📘</a>
                  <a href="#" className="social-icon">🐦</a>
                  <a href="#" className="social-icon">💼</a>
                  <a href="#" className="social-icon">📷</a>
                </div>
              </div>

              <div className="info-block">
                <h3>Global Offices</h3>
                <div className="office-mini-list">
                  {offices.map((o, i) => (
                    <div key={i} className="office-mini">
                      <span className="office-mini-flag">{o.flag}</span>
                      <div>
                        <div className="office-mini-country">{o.country}</div>
                        {/* <a href={`mailto:${o.email}`} className="office-mini-email">{o.email}</a> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
