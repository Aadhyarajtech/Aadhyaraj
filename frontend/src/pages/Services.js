import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api';
import './Services.css';

const defaultServices = [
  {
    title: 'Custom Software Development',
    icon: '⚙️',
    tagline: 'Tailored solutions built for your business.',
    description: 'We architect and build bespoke software applications that solve your unique business challenges. From enterprise-grade web platforms to mobile applications and APIs, our engineers deliver robust, scalable, and secure solutions with modern tech stacks.',
    features: [
      'Full-stack web application development',
      'Native and cross-platform mobile apps',
      'RESTful & GraphQL API development',
      'Cloud-native application architecture',
      'Legacy system modernisation',
      'Database design and optimisation',
    ],
    techs: ['React', 'Node.js', 'Python', 'Java', 'MongoDB', 'PostgreSQL'],
  },
  {
    title: 'Enterprise Web Solutions',
    icon: '🌐',
    tagline: 'Stunning, high-performance web presences.',
    description: 'We create powerful web experiences that convert visitors into customers. From e-commerce platforms handling thousands of transactions to content management systems and progressive web apps, we build for performance, SEO, and scalability.',
    features: [
      'E-commerce platform development',
      'Custom CMS solutions',
      'Progressive Web Apps (PWA)',
      'UI/UX design and prototyping',
      'Performance optimisation',
      'SEO-ready architecture',
    ],
    techs: ['Next.js', 'WordPress', 'Shopify', 'Figma', 'Tailwind', 'Vue.js'],
  },
  {
    title: 'IT Consulting & Strategy',
    icon: '💡',
    tagline: 'Strategic guidance for digital transformation.',
    description: 'Our seasoned consultants work alongside your leadership team to design technology strategies that align with your business goals. We assess your current landscape, identify gaps, and create actionable roadmaps that deliver measurable outcomes.',
    features: [
      'Digital transformation strategy',
      'Technology stack assessment',
      'Architecture design and review',
      'Business process optimisation',
      'IT governance frameworks',
      'Vendor selection and management',
    ],
    techs: ['TOGAF', 'Agile', 'ITIL', 'Scrum', 'DevSecOps', 'PMBOK'],
  },
  {
    title: 'Cloud & DevOps Services',
    icon: '☁️',
    tagline: 'Modernise infrastructure, accelerate delivery.',
    description: 'We help organisations harness the full power of cloud computing. From seamless cloud migrations to building robust CI/CD pipelines and container orchestration, we ensure your infrastructure is agile, cost-effective, and highly available.',
    features: [
      'AWS, Azure and GCP migration',
      'CI/CD pipeline implementation',
      'Docker & Kubernetes orchestration',
      'Infrastructure as Code (Terraform)',
      'Cost optimisation and FinOps',
      'Disaster recovery planning',
    ],
    techs: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform'],
  },
  {
    title: 'Maintenance & Support',
    icon: '🛡️',
    tagline: 'Always-on support for business continuity.',
    description: 'Our dedicated support teams ensure your applications and systems run at peak performance around the clock. With proactive monitoring, rapid incident response, and regular updates, we keep your technology running so you can focus on your business.',
    features: [
      '24/7 application monitoring',
      'Bug tracking and resolution',
      'Security patch management',
      'Performance tuning',
      'Scheduled maintenance windows',
      'SLA-backed response times',
    ],
    techs: ['Datadog', 'New Relic', 'PagerDuty', 'Jira', 'Grafana', 'ELK Stack'],
  },
  {
    title: 'Training & Implementation',
    icon: '🎓',
    tagline: 'Empower your team. Maximise your ROI.',
    description: 'We ensure successful adoption of new technology through comprehensive training programmes and hands-on implementation support. From go-live planning to knowledge transfer sessions, we set your team up for long-term success.',
    features: [
      'Custom training programmes',
      'System integration and go-live',
      'Knowledge transfer workshops',
      'Documentation and SOPs',
      'Post-launch hypercare',
      'Ongoing learning resources',
    ],
    techs: ['LMS Platforms', 'Confluence', 'Notion', 'Teams', 'Zoom', 'Miro'],
  },
];

const process = [
  { step: '01', title: 'Discovery', desc: 'We deeply understand your business needs, goals, and technical requirements through collaborative workshops.' },
  { step: '02', title: 'Strategy', desc: 'We design a tailored technology strategy and architecture plan aligned to your objectives and budget.' },
  { step: '03', title: 'Development', desc: 'Our agile teams build your solution with transparency, regular demos, and continuous feedback loops.' },
  { step: '04', title: 'Delivery', desc: 'Thorough QA, smooth deployment, and comprehensive handover ensure a seamless go-live experience.' },
  { step: '05', title: 'Support', desc: 'Our partnership continues post-launch with ongoing maintenance, support, and growth-focused enhancements.' },
];

const Services = () => {
  const [active, setActive] = useState(0);
  const [services, setServices] = useState(defaultServices);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services');
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
          setServices(response.data.data.map(service => ({
            title: service.title || service.name || 'Service',
            icon: service.icon || '⚙️',
            tagline: service.tagline || service.description?.slice(0, 60) || 'Professional service delivered with care.',
            description: service.description || 'Premium service designed to meet your business goals.',
            features: service.features || ['Expert team', 'Strategic delivery', 'Customer-first approach'],
            techs: service.techStack || ['React', 'Node.js', 'Cloud'],
          })));
        }
      } catch (err) {
        console.warn('Services API error:', err);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const activeService = services[active] || defaultServices[0];

  return (
    <main className="services-page">
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-bg">
          <div className="page-hero-grid"></div>
          <div className="page-hero-orb"></div>
        </div>
        <div className="container page-hero-content">
          <p className="section-subtitle">What We Offer</p>
          <h1 className="section-title">End-to-End <span>IT Services</span></h1>
          <div className="gold-line"></div>
          <p>From strategy to implementation, from code to cloud — AadhyaRaj Technologies is your complete technology partner.</p>
        </div>
      </section>

      {/* SERVICE DETAIL */}
      <section className="service-detail-section">
        <div className="container">
          <div className="service-tabs reveal">
            {services.map((s, i) => (
              <button
                key={`${s.title}-${i}`}
                className={`service-tab ${i === active ? 'active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="tab-icon">{s.icon}</span>
                <span className="tab-label">{s.title}</span>
              </button>
            ))}
          </div>
          <div className="service-detail reveal">
            <div className="detail-left">
              <div className="detail-icon">{activeService.icon}</div>
              <h2>{activeService.title}</h2>
              <p className="detail-tagline">{activeService.tagline}</p>
              <div className="gold-line"></div>
              <p className="detail-desc">{activeService.description}</p>
              <Link to="/contact" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
                <span>Get a Quote</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
            <div className="detail-right">
              <div className="detail-features">
                <h4>What's Included</h4>
                <ul>
                  {(activeService.features || []).map((f, i) => (
                    <li key={i}>
                      <span className="check-icon">✦</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="detail-techs">
                <h4>Technologies & Tools</h4>
                <div className="tech-tags">
                  {(activeService.techs || []).map((t, i) => (
                    <span key={i} className="tech-tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process-section">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-subtitle">How We Work</p>
            <h2 className="section-title">Our <span>Proven Process</span></h2>
            <div className="gold-line center"></div>
          </div>
          <div className="process-steps">
            {process.map((p, i) => (
              <div key={i} className="process-step reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="step-number">{p.step}</div>
                <div className="step-connector"></div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ padding: '6rem 0', textAlign: 'center', position: 'relative' }}>
        <div className="cta-glow"></div>
        <div className="container">
          <div className="reveal">
            <p className="section-subtitle">Start Today</p>
            <h2 className="section-title">Ready to <span>Transform</span> Your Business?</h2>
            <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '1rem auto 2.5rem', lineHeight: 1.7 }}>
              Let's discuss your requirements and explore how AadhyaRaj Technologies can deliver the perfect IT solution for you.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-primary"><span>Contact Us</span></Link>
              <Link to="/about" className="btn-outline"><span>About Us</span></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
