import { useState } from 'react';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import useSEO from '../hooks/useSEO';
import './Contact.css';

export default function Contact() {
  useSEO('Contact Us', 'Get in touch with RCS (Rameswar Cool Spares). Inquire about bulk AC parts wholesale pricing, find our store location, or send us a message on WhatsApp.');

  const { addToast } = useToast();
  const [selectedOption, setSelectedOption] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const option = formData.get('option');
    const message = formData.get('message');
    
    // Open WhatsApp with the contact form message
    const waMessage = encodeURIComponent(
      `Hi RCS! I'm submitting a contact request:\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Subject:* ${option}\n*Message:* ${message}\n\nPlease get back to me. Thank you!`
    );
    window.open(`https://wa.me/919962173870?text=${waMessage}`, '_blank');
    addToast('Redirecting to WhatsApp...');
    e.target.reset();
  };

  const contactInfo = [
    { icon: <Phone size={20} />, title: 'Phone', value: '+91 99621 73870', link: 'tel:+919962173870' },
    { icon: <Mail size={20} />, title: 'Email', value: 'rameswarcoolspares@gmail.com', link: 'mailto:rameswarcoolspares@gmail.com' },
    { icon: <MapPin size={20} />, title: 'Location', value: '2/3, N Usman Rd, Chennai 600017', link: 'https://maps.google.com/?q=Rameswar+Cool+Spares+T.+Nagar+Chennai' },
    { 
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ), 
      title: 'X (Twitter)', 
      value: '@RameswarS22912', 
      link: 'https://x.com/RameswarS22912' 
    }
  ];

  return (
    <div className="contact-page page-transition">
      {/* Contact Hero Header */}
      <section className="contact-hero">
        <div className="container">
          <div className="section-label">GET IN TOUCH <span className="dot"></span></div>
          <h1 className="section-title">
            Contact <span className="highlight">Us</span>
          </h1>
          <p className="contact-hero-desc">
            Have a question about our products or need a quote? Reach out to us anytime.
          </p>
        </div>
      </section>

      {/* Premium Split Contact Section */}
      <section className="contact-split-section">
        <div className="contact-split-grid">
          
          {/* Left Form Column */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              <span className="contact-subtitle">— SEND A REQUEST</span>
              <h1 className="contact-title">Send us a WhatsApp message</h1>
              
              <form onSubmit={handleSubmit} className="contact-premium-form">
                <div className="form-row-2">
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Your Name" 
                    required 
                    className="contact-input"
                  />
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Email Address" 
                    required 
                    className="contact-input"
                  />
                </div>
                
                <div className="form-row-2">
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="Phone Number" 
                    required 
                    className="contact-input"
                  />
                  <div className="select-wrapper">
                    <select 
                      name="option" 
                      required 
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="contact-select"
                    >
                      <option value="" disabled>Choose a Option</option>
                      <option value="AC Compressor Inquiry">AC Compressor Inquiry</option>
                      <option value="Condenser / Cooling Coil">Condenser / Cooling Coil</option>
                      <option value="Blower / Fan Assembly">Blower / Fan Assembly</option>
                      <option value="Other AC Spare Parts">Other AC Spare Parts</option>
                    </select>
                  </div>
                </div>
                
                <textarea 
                  name="message" 
                  placeholder="Message here.." 
                  required 
                  rows={4}
                  className="contact-textarea"
                />
                
                <button type="submit" className="contact-submit-btn premium-liquid-btn">
                  <span className="btn-content">
                    SEND VIA WHATSAPP <ArrowRight size={16} />
                  </span>
                  <div className="liquid-bg">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path className="blob-1" d="M 0 0 C 35 15, 65 15, 80 80 C 80 120, 0 120, 0 120 Z" />
                      <path className="blob-2" d="M 100 100 C 65 85, 35 85, 20 20 C 20 -20, 100 -20, 100 -20 Z" />
                    </svg>
                  </div>
                </button>
              </form>
            </div>
          </div>
          
          {/* Right Image Column */}
          <div className="contact-img-col">
            <img 
              src="/contact-business.png" 
              alt="RCS Automotive AC Spare Parts Showcase" 
              className="contact-mechanic-img"
            />
          </div>
          
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            {contactInfo.map((info, i) => (
              <a
                key={i}
                href={info.link}
                className="contact-info-card-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="info-icon-wrapper">{info.icon}</div>
                <div className="info-content-wrapper">
                  <h3>{info.title}</h3>
                  <p>{info.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="contact-map-section">
        <div className="container">
          <div className="map-wrapper">
            <iframe
              src="https://maps.google.com/maps?q=Rameswar%20Cool%20Spares%20T.%20Nagar%20Chennai&t=&z=18&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Rameswar Cool Spares Location Map"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
