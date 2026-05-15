import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './About.css';

const values = [
  { icon: '🎯', title: 'Excellence', desc: 'We pursue perfection in every line of code, every design, every delivery.' },
  { icon: '🔗', title: 'Commitment', desc: 'Our promise to clients is unwavering — quality work, on time, every time.' },
  { icon: '💡', title: 'Innovation', desc: 'We constantly evolve, embracing the latest technologies to drive better outcomes.' },
  { icon: '🤝', title: 'Partnership', desc: 'We are not vendors — we are long-term partners invested in your success.' },
];

const team = [
  { name: 'Rajesh Kumar', role: 'CEO & Founder', expertise: 'Business Strategy & Leadership' },
  { name: 'Ananya Sharma', role: 'CTO', expertise: 'Cloud Architecture & Engineering' },
  { name: 'Vikram Patel', role: 'Head of Delivery', expertise: 'Project Management & Agile' },
  { name: 'Priya Nair', role: 'Head of Design', expertise: 'UI/UX & Product Design' },
];

const STATIC_TESTIMONIALS = [
  {
    message: 'Professional team with strong domain knowledge in enterprise software development. Delivery was on time and as promised.',
    company: 'Enterprise IT Solutions Company',
    country: 'INDIA',
    rating: 5,
    icon: '🏢',
  },
  {
    message: 'AadhyaRaj Technologies transformed our legacy systems into a modern, scalable cloud architecture. Their expertise and dedication are unmatched.',
    company: 'ISO-certified enterprise',
    country: 'USA',
    rating: 5,
    icon: '🛡️',
  },
  {
    message: 'The AI-driven analytics platform they built for us exceeded all expectations. It has completely revolutionized how we understand our data.',
    company: 'Healthcare solutions provider',
    country: 'NORTH AMERICA',
    rating: 5,
    icon: '📈',
  },
  {
    message: 'Their mobility solutions have significantly improved our field operations and customer engagement. A truly innovative partner.',
    company: 'Leading Logistics Provider',
    country: 'AUSTRALIA',
    rating: 5,
    icon: '📱',
  },
  {
    message: 'Exceptional cloud migration strategy. They helped us transition our entire infrastructure to Azure with zero downtime.',
    company: 'Retail Giant',
    country: 'AUSTRALIA',
    rating: 5,
    icon: '☁️',
  },
];

const HARDCODED_TECH = {
  frontend: ['React.js', 'Next.js', 'Vue.js', 'Angular', 'Tailwind CSS', 'TypeScript'],
  backend: ['Node.js', 'Java', 'Spring Boot', 'Python', 'Express.js', 'GraphQL'],
  database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'ElasticSearch'],
  'cloud-devops': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD'],
  'ai-machine-learning': ['TensorFlow', 'PyTorch', 'OpenAI', 'LangChain', 'Computer Vision', 'NLP'],
  mobile: ['React Native', 'Flutter', 'iOS (Swift)', 'Android (Kotlin)'],
};

const TECH_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  'cloud-devops': 'Cloud & DevOps',
  'ai-machine-learning': 'AI & Machine Learning',
  mobile: 'Mobile',
};

const About = () => {
  const [counters, setCounters] = useState({ clients: 0, projects: 0, offices: 0, satisfaction: 0 });
  // const [testimonials] = useState(STATIC_TESTIMONIALS);
  // const [techCategories] = useState(HARDCODED_TECH);
  const [testimonials, setTestimonials] = useState([]);
  const [techCategories, setTechCategories] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    // FETCH TESTIMONIALS
    axios.get('/api/testimonials')
      .then(res => {
        if (res.data?.data?.length > 0) {
          setTestimonials(res.data.data);
        } else {
          setTestimonials(STATIC_TESTIMONIALS);
        }
      })
      .catch(() => {
        setTestimonials(STATIC_TESTIMONIALS);
      });

    // FETCH TECH STACK
    axios.get('/api/techstack')
      .then(res => {
        const items = res.data?.data || [];

        if (items.length > 0) {
          const grouped = {};

          items.forEach(item => {
            const category = item.category || 'other';
            const technologies = [];

            if (Array.isArray(item.technologies) && item.technologies.length > 0) {
              item.technologies.forEach(tech => {
                if (typeof tech === 'string') {
                  technologies.push(tech);
                } else if (tech?.name) {
                  technologies.push(tech.name);
                }
              });
            } else if (item.name) {
              technologies.push(item.name);
            }

            if (!grouped[category]) {
              grouped[category] = [];
            }
            grouped[category] = grouped[category].concat(technologies);
          });

          setTechCategories(grouped);
        } else {
          setTechCategories(HARDCODED_TECH);
        }
      })
      .catch(() => {
        setTechCategories(HARDCODED_TECH);
      });
  }, []);

  useEffect(() => {
    const animateCounters = () => {
      const targetCounters = { clients: 100, projects: 500, offices: 6, satisfaction: 92.7 };
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        setCounters({
          clients: Math.floor(targetCounters.clients * progress),
          projects: Math.floor(targetCounters.projects * progress),
          offices: Math.floor(targetCounters.offices * progress),
          satisfaction: parseFloat((targetCounters.satisfaction * progress).toFixed(1)),
        });
        if (step >= steps) clearInterval(timer);
      }, increment);
    };

    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    const statsElement = document.querySelector('.stats-section');
    if (statsElement) statsObserver.observe(statsElement);

    return () => statsObserver.disconnect();
  }, []);

  return (
    <main className="about-page">
      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="page-hero-bg">
          <div className="page-hero-grid"></div>
          <div className="page-hero-orb"></div>
        </div>
        <div className="container page-hero-content">
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About Us
          </motion.p>
          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Team Behind <span>AadhyaRaj</span>
          </motion.h1>
          <motion.div
            className="gold-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          ></motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            A passionate team of technologists and business leaders united by a single mission — to deliver IT excellence that transforms businesses globally.
          </motion.p>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="stat-value">{counters.clients}+</div>
              <div className="stat-label">Trusted Clients</div>
            </motion.div>
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="stat-value">{counters.projects}+</div>
              <div className="stat-label">Projects Delivered</div>
            </motion.div>
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="stat-value">{counters.offices}</div>
              <div className="stat-label">Global Offices</div>
            </motion.div>
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="stat-value">{counters.satisfaction}%</div>
              <div className="stat-label">Client Satisfaction</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <motion.div
              className="mission-card reveal"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mission-icon">🚀</div>
              <h3>Our Mission</h3>
              <p>Build long term relationships with our clients, provide exceptional customer services by pursuing business through innovation and advanced technology. To become one of the best IT service providers globally.</p>
              {/* <p>To become one of the best IT service providers globally by delivering complete, high-quality software solutions that enable our clients to thrive in an ever-evolving digital landscape.</p> */}
            </motion.div>
            <motion.div
              className="mission-card reveal"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mission-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>To shape the future with digital engineering excellence — becoming the one-stop IT partner for businesses of all sizes, across all geographies, for every stage of their technology journey.</p>
            </motion.div>
            <motion.div
              className="mission-card reveal"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="mission-icon">💎</div>
              <h3>Why Choose Us</h3>
              <p>Excellence, core competency, and intricate knowledge are the foundations of everything we do. We apply these principles as our core goal in each and every project we undertake.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section about-testimonials-section">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-subtitle">What Clients Say</p>
            <h2 className="section-title">Client <span>Testimonials</span></h2>
            <div className="gold-line center"></div>
          </div>
          <div className="testimonials-grid reveal">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card-new">
                <div className="testimonial-stars">
                  {'★'.repeat(t.rating || 5)}
                </div>
                <div className="testimonial-quote-mark">"</div>
                <p className="testimonial-text-new">"{t.message}"</p>
                <div className="testimonial-author-new">
                  <div className="testimonial-company-icon">{t.icon || '🏢'}</div>
                  <div>
                    <div className="testimonial-company-name">{t.company}</div>
                    <div className="testimonial-country">{t.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="about-tech-section">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-subtitle">Our Expertise</p>
            <h2 className="section-title">Our <span>Tech Stack</span></h2>
            <div className="gold-line center"></div>
          </div>
          <div className="tech-categories-grid reveal">
            {Object.entries(techCategories).map(([category, techs], index) => (
              <div key={category} className="tech-category-card" style={{ transitionDelay: `${index * 0.1}s` }}>
                <h3 className="tech-category-title">
                  <span className="tech-category-dot"></span>
                  {TECH_LABELS[category] || category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' & ')}
                </h3>
                <div className="tech-tags-grid">
                  {(Array.isArray(techs) ? techs : techs.map(t => t.name)).map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="story-section">
        <div className="container">
          <div className="story-inner">
            <div className="story-text reveal">
              <p className="section-subtitle">Our Story</p>
              <h2 className="section-title">Built on <span>Trust & Technology</span></h2>
              <div className="gold-line"></div>
              <p>AadhyaRaj Technologies was founded by a team of techies who carry vast experience in software services and business development. We set out with a single goal — to provide complete IT solutions under one roof.</p>
              <p>Our forte lies in developing custom, scalable and secure applications that leverage India's offshore value advantage. We serve clients across different geographies, pairing world-class technical talent with deep business understanding.</p>
              <p>Headquartered in India, with delivery centres in the USA, UK, Australia, New Zealand and Malaysia, we offer our clients the best of both worlds — global delivery capability with local support.</p>
              <p>In a relatively short span of time, we have carved a niche in the IT industry by acquiring major projects and building a reputation for quality, commitment and client satisfaction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="values-section">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-subtitle">What Drives Us</p>
            <h2 className="section-title">Our Core <span>Values</span></h2>
            <div className="gold-line center"></div>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="value-icon">{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="team-section">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-subtitle">Leadership</p>
            <h2 className="section-title">Meet the <span>Visionaries</span></h2>
            <div className="gold-line center"></div>
          </div>
          <div className="team-grid">
            {team.map((t, i) => (
              <div key={i} className="team-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="team-avatar">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="team-info">
                  <h4>{t.name}</h4>
                  <span className="team-role">{t.role}</span>
                  <p>{t.expertise}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GLOBAL */}
      <section className="global-section">
        <div className="container">
          <div className="global-inner reveal">
            <div className="global-text">
              <p className="section-subtitle">Global Reach</p>
              <h2 className="section-title">6 Countries, <span>One Standard</span></h2>
              <div className="gold-line"></div>
              <p>No matter where you are in the world, AadhyaRaj Technologies delivers the same commitment to quality, the same dedication to your success, with the added benefit of local support from our global delivery centres.</p>
            </div>
            <div className="global-offices">
              {[
                { flag: '🇮🇳', country: 'India', city: 'Delivery Centre' },
                { flag: '🇺🇸', country: 'United States', city: 'Delivery Centre' },
                { flag: '🇬🇧', country: 'United Kingdom', city: 'Delivery Centre' },
                { flag: '🇦🇺', country: 'Australia', city: 'Delivery Centre' },
                { flag: '🇳🇿', country: 'New Zealand', city: 'Delivery Centre' },
                { flag: '🇲🇾', country: 'Malaysia', city: 'Delivery Centre' },
              ].map((o, i) => (
                <div key={i} className={`office-card ${o.type === 'hq' ? 'hq' : ''}`}>
                  <span className="office-flag">{o.flag}</span>
                  <div>
                    <div className="office-country">{o.country}</div>
                    <div className="office-type">{o.city}</div>
                  </div>
                  {o.type === 'hq' && <span className="hq-badge">HQ</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;