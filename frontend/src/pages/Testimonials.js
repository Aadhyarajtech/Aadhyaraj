import React, { useEffect, useState } from 'react';
import axios from '../api';
import './Testimonials.css';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    axios.get('/api/testimonials').then(r => setTestimonials(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, [testimonials]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [testimonials]);

  return (
    <main className="testimonials-page">
      <section className="testimonials-hero">
        <div className="container">
          <h1 className="page-title reveal">Client Testimonials</h1>
          <p className="page-subtitle reveal">Hear from our satisfied clients about their experience with AadhyaRaj Technologies.</p>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          {testimonials.length > 0 ? (
            <div className="testimonial-slider reveal">
              <div className="testimonial-card active">
                <div className="quote-mark">"</div>
                <p className="testimonial-text">{testimonials[activeTestimonial]?.message}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonials[activeTestimonial]?.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="author-name">{testimonials[activeTestimonial]?.name}</div>
                    <div className="author-role">{testimonials[activeTestimonial]?.position} — {testimonials[activeTestimonial]?.company}, {testimonials[activeTestimonial]?.country}</div>
                  </div>
                  <div className="stars">{'★'.repeat(testimonials[activeTestimonial]?.rating || 5)}</div>
                </div>
              </div>
              <div className="testimonial-dots">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`dot ${i === activeTestimonial ? 'active' : ''}`}
                    onClick={() => setActiveTestimonial(i)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="no-testimonials">
              <p>Loading testimonials...</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Testimonials;