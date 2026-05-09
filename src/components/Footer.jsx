import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="footer-logo">R C S</span>
            <p className="footer-desc">
              Your trusted distributor of premium AC spare parts for cars, trucks, SUVs, and commercial fleets. 
              Quality components, delivered to your door.
            </p>
            <a
              href="https://wa.me/919876543210"
              className="footer-wa-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/brands">Brands</Link></li>
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
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <Phone size={14} />
                <span>+91 98765 43210</span>
              </li>
              <li>
                <Mail size={14} />
                <span>info@rcsparts.com</span>
              </li>
              <li>
                <MapPin size={14} />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} RCS AC Spare Parts. All rights reserved.</p>
          <p className="footer-admin-link">
            <Link to="/admin">Admin Panel</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
