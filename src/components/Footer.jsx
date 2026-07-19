import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Truck, Lock, Clock } from 'lucide-react';
import rcsLogo from '../assets/rcs-logo.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo-link">
              <div className="logo-wrapper">
                <img src={rcsLogo} alt="RCS Logo" className="logo-img footer-logo-img" />
              </div>
            </Link>
            <p className="footer-desc">
              India's trusted distributor, wholesaler, and retailer of automotive AC components.
            </p>
            <div className="footer-stats-grid">
              <div className="footer-stat-item">
                <span className="stat-num">1000+</span>
                <span className="stat-label">Products Available</span>
              </div>
              <div className="footer-stat-item">
                <span className="stat-num">50+</span>
                <span className="stat-label">OEM & Aftermarket Brands</span>
              </div>
              <div className="footer-stat-item">
                <span className="stat-num">1000+</span>
                <span className="stat-label">Dealers & Workshops Served</span>
              </div>
              <div className="footer-stat-item">
                <span className="stat-num">20+</span>
                <span className="stat-label">Years in Automotive Cooling Solutions</span>
              </div>
            </div>
            <div className="footer-trust-badges">
              <div className="trust-badge">
                <ShieldCheck size={16} className="trust-icon" />
                <span>100% Genuine Parts</span>
              </div>
              <div className="trust-badge">
                <Truck size={16} className="trust-icon" />
                <span>Express Dispatch</span>
              </div>
              <div className="trust-badge">
                <Lock size={16} className="trust-icon" />
                <span>Secure Transactions</span>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/brands">Brands</Link></li>
              <li><Link to="/car-brands">Car Brands</Link></li>
              <li><Link to="/education">AC Systems Guide</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/products?category=Car">Car AC Parts</Link></li>
              <li><Link to="/products?category=Truck">Truck AC Parts</Link></li>
              <li><Link to="/products?category=Bus">Bus AC Parts</Link></li>
              <li><Link to="/products?category=Payload Vehicle">Payload Vehicle AC Parts</Link></li>
              <li><Link to="/products?category=Construction Vehicle">Construction Vehicle AC Parts</Link></li>
              <li><Link to="/products?category=Bulldozer">Bulldozer AC Parts</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <span className="footer-icon-circle"><Phone size={14} /></span>
                <span>+91 99621 73870</span>
              </li>
              <li>
                <span className="footer-icon-circle"><Mail size={14} /></span>
                <span><a href="mailto:rameswarcoolspares@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>rameswarcoolspares@gmail.com</a></span>
              </li>
              <li>
                <span className="footer-icon-circle"><MapPin size={14} /></span>
                <span><a href="https://maps.google.com/?q=Rameswar+Cool+Spares+T.+Nagar+Chennai" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Rameswar Cool Spares, 2/3, N Usman Rd, T. Nagar, Chennai 600017</a></span>
              </li>
              <li>
                <span className="footer-icon-circle"><Clock size={14} /></span>
                <span><strong>Business Hours:</strong> Mon-Sat 09:30 to 20:30 | Sunday Closed</span>
              </li>
            </ul>

            <div className="footer-social-section">
              <h5>Follow Us</h5>
              <div className="footer-social-links">
                <a
                  href="https://www.facebook.com/share/1BonMkbBTG/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-btn"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/rameswar_cool_spares?igsh=MTFud3pmc3ZmZWtrcQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-btn"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="https://x.com/RameswarS22912"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-btn"
                  aria-label="X (formerly Twitter)"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="footer-quote-section">
              <a
                href={`https://wa.me/919962173870?text=${encodeURIComponent(
                  "Hello! I would like to request a custom quote for automotive AC spare parts. Please share pricing and availability."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-quote-btn premium-liquid-btn"
              >
                <span className="btn-content">
                  Request a Quote
                </span>
                <div className="liquid-bg">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path className="blob-1" d="M 0 0 C 35 15, 65 15, 80 80 C 80 120, 0 120, 0 120 Z" />
                    <path className="blob-2" d="M 100 100 C 65 85, 35 85, 20 20 C 20 -20, 100 -20, 100 -20 Z" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 RCS AC Spare Parts. All rights reserved.</p>
          <p className="footer-admin-link">
            <Link to="/admin">Admin Panel</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
