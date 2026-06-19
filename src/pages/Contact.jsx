import { Phone, Mail, MapPin } from 'lucide-react';
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
    window.open(`https://wa.me/919962173870?text=${waMessage}`, '_blank');
    addToast('Redirecting to WhatsApp...');
    e.target.reset();
  };

  const contactInfo = [
    { icon: <Phone size={22} />, title: 'Phone', value: '+91 99621 73870', link: 'tel:+919962173870' },
    { icon: <Mail size={22} />, title: 'Email', value: 'rameswarcoolspares@gmail.com', link: 'mailto:rameswarcoolspares@gmail.com' },
    { icon: <MapPin size={22} />, title: 'Location', value: 'Rameswar Cool Spares, 2/3, N Usman Rd, below Mahalingapuram Flyover, Panagal Park Market, Darmapuram, T. Nagar, Chennai, Tamil Nadu 600017', link: 'https://maps.google.com/?q=Rameswar+Cool+Spares+T.+Nagar+Chennai' },
    { icon: <svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>, title: 'WhatsApp', value: 'Chat with us anytime', link: 'https://wa.me/919962173870' },
    { icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>, title: 'Facebook', value: 'Rameswar cool spares', link: 'https://www.facebook.com/share/1BonMkbBTG/' },
    { icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>, title: 'Instagram', value: 'rameswar_cool_spares', link: 'https://www.instagram.com/rameswar_cool_spares?igsh=MTFud3pmc3ZmZWtrcQ==' },
  ];

  return (
    <div className="contact-page page-transition">
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
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }}>
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
              </svg>
              Send via WhatsApp
            </button>
          </form>
        </div>
      </section>
      
      {/* GOOGLE MAP EMBED */}
      <section className="contact-map-section">
        <div className="container">
          <div className="map-wrapper">
            <iframe
              src="https://maps.google.com/maps?q=Rameswar%20Cool%20Spares%20T.%20Nagar%20Chennai&t=&z=18&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="450"
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
