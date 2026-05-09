import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import './Contact.css';

export default function Contact() {
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const message = formData.get('message');
    
    // Open WhatsApp with the contact form message
    const waMessage = encodeURIComponent(
      `Hi RCS! My name is ${name}.\n\n${message}\n\nPlease get back to me. Thank you!`
    );
    window.open(`https://wa.me/919876543210?text=${waMessage}`, '_blank');
    addToast('Redirecting to WhatsApp...');
    e.target.reset();
  };

  const contactInfo = [
    { icon: <Phone size={22} />, title: 'Phone', value: '+91 98765 43210', link: 'tel:+919876543210' },
    { icon: <Mail size={22} />, title: 'Email', value: 'info@rcsparts.com', link: 'mailto:info@rcsparts.com' },
    { icon: <MapPin size={22} />, title: 'Location', value: 'Mumbai, Maharashtra, India', link: '#' },
    { icon: <MessageCircle size={22} />, title: 'WhatsApp', value: 'Chat with us anytime', link: 'https://wa.me/919876543210' },
  ];

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <div className="section-label">Get In Touch <span className="dot"></span></div>
          <h1 className="section-title">
            Contact <span className="highlight">Us</span>
          </h1>
          <p className="contact-hero-desc">
            Have a question about our products or need a quote? Reach out to us anytime.
          </p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container contact-grid">
          <div className="contact-info">
            <h2>Reach Out</h2>
            <p>We're available on WhatsApp 24/7 for quick responses on product availability, pricing, and orders.</p>
            <div className="contact-cards">
              {contactInfo.map((info, i) => (
                <a
                  key={i}
                  href={info.link}
                  className="contact-card"
                  target={info.link.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                >
                  <div className="contact-card-icon">{info.icon}</div>
                  <div>
                    <h4>{info.title}</h4>
                    <span>{info.value}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} id="contact-form">
            <h2>Send a Message</h2>
            <div className="cform-group">
              <label htmlFor="contact-name">Your Name</label>
              <input type="text" id="contact-name" name="name" required placeholder="Enter your name" />
            </div>
            <div className="cform-group">
              <label htmlFor="contact-phone">Phone Number</label>
              <input type="tel" id="contact-phone" name="phone" placeholder="Your phone number" />
            </div>
            <div className="cform-group">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows={5} required placeholder="Tell us what you need..." />
            </div>
            <button type="submit" className="contact-submit" id="contact-submit">
              <Send size={16} /> Send via WhatsApp
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
