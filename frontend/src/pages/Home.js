import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../api';
import './Home.css';

const stats = [
  { value: '100+', label: 'Trusted Clients' },
  { value: '500+', label: 'Projects Delivered' },
  { value: '6', label: 'Global Offices' },
  { value: '92.7%', label: 'Client Satisfaction' },
];

const serviceIcons = {
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  lightbulb: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  graduation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
};

const Home = () => {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    // axios.get('/api/services').then(r => setServices(r.data.data)).catch(() => {});
    // axios.get('/api/testimonials').then(r => setTestimonials(r.data.data)).catch(() => {});
    axios.get('/api/services')
      .then(r => setServices(r?.data?.data || []))
      .catch(() => setServices([]));

    axios.get('/api/testimonials')
      .then(r => setTestimonials(r?.data?.data || []))
      .catch(() => setTestimonials([]));
  }, []);

  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;
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
  }, [services, testimonials]);

  const countries = ['India', 'USA', 'UK', 'Australia', 'New Zealand', 'Malaysia'];

  return (
    <main className="home">
      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`particle particle-${i % 3 + 1}`} style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
              }}></div>
            ))}
          </div>
          <div className="hero-grid"></div>
          <div className="hero-orb orb-1"></div>
          <div className="hero-orb orb-2"></div>
          <div className="hero-orb orb-3"></div>
          <div className="hero-circuit"></div>
        </div>
        <div className="container hero-content">
          {/* <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-dot"></span>
            <span>Trusted IT Partner Since 2010</span>
          </motion.div> */}
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="hero-title-line">Complete IT</span>
            <span className="hero-title-line">Solutions</span>
            <span className="hero-title-line italic">Under One Roof</span>
          </motion.h1>
          <motion.p
            className="hero-desc"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            AadhyaRaj Technologies delivers world-class software services and web solutions, leveraging India's offshore advantage to serve clients across global delivery centres.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/services" className="btn-outline">
              <span>Explore Services</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link to="/contact" className="btn-outline">
              <span>Contact Us</span>
            </Link>
          </motion.div>
          <motion.div
            className="hero-presence"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="presence-label">Global Presence:</span>
            {countries.map(c => <span key={c} className="presence-tag">{c}</span>)}
          </motion.div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-line"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-card reveal">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section className="about-strip">
        <div className="container">
          <div className="about-strip-inner reveal">
            <div className="about-strip-text">
              <p className="section-subtitle">Who We Are</p>
              <h2 className="section-title">Built by Techies, <span>Driven by Excellence</span></h2>
              <div className="gold-line"></div>
              <p>Founded by experienced technology and business development professionals, AadhyaRaj Technologies is dedicated to becoming one of the best IT service providers globally. Our forte lies in developing custom, scalable and secure applications leveraging India's offshore value advantage.</p>
              <p>We believe excellence, core competency and intricate knowledge bring success — and we apply this principle as our goal in every project we undertake.</p>
              {/* <Link to="/about" className="btn-outline" style={{ marginTop: '2rem', display: 'inline-flex' }}>
                <span>Our Story</span>
              </Link> */}
            </div>
            <div className="about-strip-visual">
              <div className="visual-card vc-1">
                <div className="vc-icon">🏆</div>
                <div className="vc-text">Award-Winning Quality</div>
              </div>
              <div className="visual-card vc-2">
                <div className="vc-icon">🌐</div>
                <div className="vc-text">Global Delivery</div>
              </div>
              <div className="visual-card vc-3">
                <div className="vc-icon">🔐</div>
                <div className="vc-text">Secure & Scalable</div>
              </div>
              <div className="visual-hexagon">
                <span>100+</span>
                <small>Clients</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-section">
        <div className="container">
          <motion.div
            className="section-header reveal"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="section-subtitle">What We Do</p>
            <h2 className="section-title">Our <span>Core Services</span></h2>
            <div className="gold-line center"></div>
            <p className="section-desc">End-to-end IT solutions crafted to accelerate your business growth and digital transformation journey.</p>
          </motion.div>
          <div className="services-grid">
            {(Array.isArray(services) && services.length > 0 ? services : [
              { title: 'Web Development', description: 'Custom web applications with modern frameworks.', icon: 'code', features: ['React', 'Node.js', 'Responsive', 'Scalable'] },
              { title: 'AI Solutions', description: 'Intelligent systems powered by machine learning.', icon: 'globe', features: ['GenAI', 'LLMs', 'Computer Vision', 'NLP'] },
              { title: 'Cloud Services', description: 'Scalable cloud infrastructure and migration.', icon: 'cloud', features: ['AWS', 'Azure', 'DevOps', 'Security'] },
              { title: 'Enterprise Software', description: 'Robust software for large-scale operations.', icon: 'shield', features: ['Java', 'Spring Boot', 'Microservices', 'Integration'] },
              { title: 'Mobile App Development', description: 'Native and cross-platform mobile apps.', icon: 'lightbulb', features: ['React Native', 'iOS', 'Android', 'Flutter'] },
              { title: 'DevOps & Automation', description: 'Streamlined development and deployment.', icon: 'graduation', features: ['CI/CD', 'Docker', 'Kubernetes', 'Monitoring'] },
              { title: 'UI/UX Design', description: 'Intuitive and beautiful user experiences.', icon: 'code', features: ['Figma', 'Prototyping', 'User Research', 'Design Systems'] },
              { title: 'Data & Analytics', description: 'Insights from your data.', icon: 'globe', features: ['Big Data', 'Python', 'Visualization', 'ML Models'] },
            ]).map((svc, i) => (
              <motion.div
                key={i}
                className="service-card reveal"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                viewport={{ once: true }}
              >
                <div className="service-card-glow"></div>
                <div className="service-icon">
                  {serviceIcons[svc?.icon] || serviceIcons.code}
                </div>
                <h3>{svc?.title || 'Service'}</h3>
                <p>{svc?.description || ''}</p>
                <ul className="service-features">
                  {(svc.features || []).map((f, fi) => (
                    <li key={fi}><span className="feature-dot"></span>{f}</li>
                  ))}
                </ul>
                {/* <div className="service-card-footer">
                  <Link to="/services" className="service-link">Learn More →</Link>
                </div> */}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK
      <section className="tech-stack-section">
        <div className="container">
          <motion.div
            className="section-header reveal"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="section-subtitle">Our Expertise</p>
            <h2 className="section-title">Tech <span>Stack</span></h2>
            <div className="gold-line center"></div>
            <p className="section-desc">Cutting-edge technologies we use to build robust, scalable solutions.</p>
          </motion.div>
          <div className="tech-categories">
            {[
              {
                title: 'Frontend',
                techs: [
                  { name: 'React', icon: '⚛️' },
                  { name: 'Next.js', icon: '▲' },
                  { name: 'Tailwind CSS', icon: '🎨' },
                  { name: 'TypeScript', icon: '🔷' },
                ]
              },
              {
                title: 'Backend',
                techs: [
                  { name: 'Node.js', icon: '🟢' },
                  { name: 'Java', icon: '☕' },
                  { name: 'Spring Boot', icon: '🌱' },
                  { name: 'Python', icon: '🐍' },
                ]
              },
              {
                title: 'Database/Cloud',
                techs: [
                  { name: 'MongoDB', icon: '🍃' },
                  { name: 'PostgreSQL', icon: '🐘' },
                  { name: 'AWS', icon: '☁️' },
                  { name: 'Docker', icon: '🐳' },
                  { name: 'Kubernetes', icon: '⎈' },
                ]
              },
            ].map((category, index) => (
              <motion.div
                key={category.title}
                className="tech-category"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="category-title">{category.title}</h3>
                <div className="tech-grid">
                  {category.techs.map((tech, i) => (
                    <motion.div
                      key={tech.name}
                      className="tech-card"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="tech-icon">{tech.icon}</div>
                      <h4>{tech.name}</h4>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* WHY US */}
      <section className="why-section">
        <div className="container">
          <div className="why-inner">
            <div className="why-content reveal">
              <p className="section-subtitle">Why Choose Us</p>
              <h2 className="section-title">Your Trusted <span>Technology Partner</span></h2>
              <div className="gold-line"></div>
              <div className="why-points">
                {[
                  { icon: '⚡', title: 'Rapid Delivery', desc: 'Agile methodology ensures faster go-to-market without compromising quality.' },
                  { icon: '🛡️', title: 'Secure by Design', desc: 'Security-first architecture across every layer of your application stack.' },
                  { icon: '🌍', title: 'Offshore Advantage', desc: "India's best talent at globally competitive pricing with local support." },
                  { icon: '🤝', title: 'Long-term Partnership', desc: 'We build relationships, not just software — your one-stop IT partner.' },
                ].map((p, i) => (
                  <div key={i} className="why-point">
                    <div className="why-point-icon">{p.icon}</div>
                    <div>
                      <h4>{p.title}</h4>
                      <p>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="why-visual reveal">
              <div className="globe-visual">
                <div className="globe-ring ring-1"></div>
                <div className="globe-ring ring-2"></div>
                <div className="globe-ring ring-3"></div>
                <div className="globe-core">
                  <span>🌏</span>
                </div>
                {countries.map((c, i) => (
                  <div key={c} className={`globe-node node-${i}`}>
                    <div className="node-dot"></div>
                    <div className="node-label">{c}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS
      {testimonials.length > 0 && (
        <section className="testimonials-section">
          <div className="container">
            <motion.div
              className="section-header reveal"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="section-subtitle">Client Stories</p>
              <h2 className="section-title">Trusted by <span>Industry Leaders</span></h2>
              <div className="gold-line center"></div>
            </motion.div>
            <motion.div
              className="testimonial-slider reveal"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
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
            </motion.div>
          </div>
        </section>
      )} */}

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-glow"></div>
        <div className="container">
          <div className="cta-inner reveal">
            <p className="section-subtitle">Ready to Start?</p>
            <h2 className="section-title">Let's Build Something <span>Extraordinary</span></h2>
            <p>Partner with AadhyaRaj Technologies and transform your business with cutting-edge IT solutions tailored to your needs.</p>
            <div className="cta-actions">
              <Link to="/services" className="btn-outline">
                <span>View Services</span>
              </Link>

              <Link to="/contact" className="btn-primary">
                <span>Contact us</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
