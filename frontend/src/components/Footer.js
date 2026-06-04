import React, { useEffect, useState } from 'react';
import axios from '../api';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../assets/logo1.png';
const Footer = () => {
  const [services, setServices] = useState([]);

    useEffect(() => {
      const fetchServices = async () => {
        try {
          const response = await axios.get('/api/services');

          if (Array.isArray(response.data.data)) {
            setServices(response.data.data);
          }
        } catch (err) {
          console.log(err);
        }
      };

      fetchServices();
    }, []);
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-glow"></div>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <img src={logo} alt="Logo" className="footer-logo-image" />
              </div>
              <div>
                <div className="footer-logo-main">AadhyaRaj</div>
                <div className="footer-logo-sub">Technologies</div>
              </div>
            </div>
            <p className="footer-desc">
              Delivering complete IT solutions with excellence, commitment and innovation. One of the most trusted technology partner across the globe.
            </p>
            <div className="footer-socials">
              <a href="https://www.linkedin.com/company/aadhyaraj-technologies/"
                  target="_blank"
                  rel="noopener noreferrer" aria-label="LinkedIn" className="social-btn">in</a>
              <a href="/" aria-label="Twitter" className="social-btn">𝕏</a>
              <a href="/" aria-label="Facebook" className="social-btn">f</a>
              <a href="/" aria-label="Instagram" className="social-btn">ig</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/admin">Admin</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Our Services</h4>
            <ul>
              {services.map((service, i) => (
                <li key={i}>
                  <a href="/services">
                    {service.name || service.title || 'Service'}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Global Offices</h4>
            <ul className="office-list">
              <li><span className="flag">🇮🇳</span> India</li>
              <li><span className="flag">🇺🇸</span> United States</li>
              <li><span className="flag">🇬🇧</span> United Kingdom</li>
              <li><span className="flag">🇦🇺</span> Australia</li>
              <li><span className="flag">🇳🇿</span> New Zealand</li>
              <li><span className="flag">🇲🇾</span> Malaysia</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-line"></div>
          <div className="footer-bottom-content">
            <p>&copy; {year} AadhyaRaj Technologies. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="/">Privacy Policy</a>
              <span>|</span>
              <a href="/">Terms of Service</a>
              <span>|</span>
              <a href="/">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
