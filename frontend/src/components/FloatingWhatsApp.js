import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './FloatingWhatsApp.css';

const FloatingWhatsApp = () => (
  <a
    className="floating-whatsapp"
    href="https://wa.me/919127912345"
    aria-label="Chat with us on WhatsApp"
  >
    <FaWhatsapp aria-hidden="true" />
  </a>
);

export default FloatingWhatsApp;
