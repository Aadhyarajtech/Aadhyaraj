import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from '../api';
import './TechStack.css';

const HARDCODED = {
  frontend: [
    { name: 'React', icon: '⚛️', desc: 'Modern UI library' },
    { name: 'Next.js', icon: '▲', desc: 'Full-stack React framework' },
    { name: 'Tailwind CSS', icon: '🎨', desc: 'Utility-first CSS' },
    { name: 'TypeScript', icon: '🔷', desc: 'Typed JavaScript' },
  ],
  backend: [
    { name: 'Node.js', icon: '🟢', desc: 'JavaScript runtime' },
    { name: 'Java', icon: '☕', desc: 'Enterprise-grade language' },
    { name: 'Spring Boot', icon: '🌱', desc: 'Java framework' },
    { name: 'Python', icon: '🐍', desc: 'Versatile programming' },
  ],
  database: [
    { name: 'MongoDB', icon: '🍃', desc: 'NoSQL database' },
    { name: 'PostgreSQL', icon: '🐘', desc: 'Advanced SQL database' },
  ],
  'cloud-devops': [
    { name: 'AWS', icon: '☁️', desc: 'Cloud platform' },
    { name: 'Docker', icon: '🐳', desc: 'Containerization' },
    { name: 'Kubernetes', icon: '⎈', desc: 'Container orchestration' },
  ],
  'ai-machine-learning': [
    { name: 'TensorFlow', icon: '🤖', desc: 'Machine learning framework' },
    { name: 'PyTorch', icon: '🔥', desc: 'Deep learning library' },
  ]
};

const CATEGORY_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  'cloud-devops': 'Cloud & DevOps',
  'ai-machine-learning': 'AI / Machine Learning',
  mobile: 'Mobile',
  other: 'Other'
};

const TechStack = () => {
  const [techCategories, setTechCategories] = useState(null);

  useEffect(() => {
    axios.get('/api/techstack')
      .then(res => {
        const items = res.data.data || [];
        if (items.length === 0) { setTechCategories(HARDCODED); return; }
        // Group by category
        const grouped = {};
        items.forEach(item => {
          const cat = item.category || 'other';
          if (!grouped[cat]) grouped[cat] = [];

          if (Array.isArray(item.technologies) && item.technologies.length > 0) {
            item.technologies.forEach((tech) => {
              if (!tech) return;
              grouped[cat].push({ name: tech.name || '', icon: tech.icon || '🔧', desc: tech.description || '' });
            });
          } else if (item.name) {
            grouped[cat].push({ name: item.name, icon: item.icon || '🔧', desc: item.description || '' });
          }
        });
        setTechCategories(grouped);
      })
      .catch(() => setTechCategories(HARDCODED));
  }, []);

  const categories = techCategories || HARDCODED;

  return (
    <main className="tech-stack-page">
      <section className="tech-hero">
        <div className="container">
          <motion.h1
            className="page-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Tech Stack
          </motion.h1>
          <motion.p
            className="page-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Cutting-edge technologies we use to build robust, scalable solutions.
          </motion.p>
        </div>
      </section>

      <section className="tech-categories">
        <div className="container">
          {Object.entries(categories).map(([category, techs], index) => (
            <motion.div
              key={category}
              className="tech-category"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h2 className="category-title">
                {CATEGORY_LABELS[category] || category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' & ')}
              </h2>
              <div className="tech-grid">
                {techs.map((tech, i) => (
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
                    <h3>{tech.name}</h3>
                    <p>{tech.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default TechStack;
