import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Truck, Shield, Headphones, Zap } from 'lucide-react';
import { getProducts, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import heroParts from '../assets/hero-parts.png';
import './Home.css';

export default function Home() {
  const products = getProducts();
  const featured = products.slice(0, 4);

  const stats = [
    { value: '500+', label: 'Products' },
    { value: '50+', label: 'Brands' },
    { value: '1000+', label: 'Customers' },
    { value: '10+', label: 'Years' },
  ];

  const features = [
    { icon: <Truck size={28} />, title: 'Fast Delivery', desc: 'Quick dispatch across India with reliable logistics partners.' },
    { icon: <Shield size={28} />, title: 'Genuine Parts', desc: 'Only OEM and quality-tested aftermarket components.' },
    { icon: <Headphones size={28} />, title: '24/7 Support', desc: 'Expert technical assistance via WhatsApp anytime.' },
    { icon: <Zap size={28} />, title: 'Best Prices', desc: 'Competitive wholesale pricing for distributors and retailers.' },
  ];

  const vehicleTypes = [
    { name: 'Car', emoji: '🚗', desc: 'Sedans, Hatchbacks, SUVs', count: products.filter(p => p.category === 'Car').length },
    { name: 'Truck', emoji: '🚛', desc: 'Light & Heavy Commercial', count: products.filter(p => p.category === 'Truck').length },
    { name: 'Bus', emoji: '🚌', desc: 'Mini Bus & Fleet Vehicles', count: products.filter(p => p.category === 'Bus').length },
  ];

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero" id="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="section-label">
              AC Spare Parts Available <span className="dot"></span>
            </div>
            <h1 className="hero-title">
              <span className="hero-line">COOLING <span className="highlight">ENGINEERED</span></span>
              <span className="hero-line">FOR EVERY ROAD.</span>
            </h1>
            <p className="hero-subtitle">
              Get your AC parts for every vehicle — cars, trucks, SUVs, and 
              commercial fleets. Quality components, performance-tested and 
              delivered straight to your door.
            </p>
            <Link to="/products" className="hero-cta" id="hero-browse-btn">
              BROWSE PARTS <ArrowRight size={16} strokeWidth={3} />
            </Link>
          </div>
          <div className="hero-image">
            <img src={heroParts} alt="RCS AC Spare Parts" />
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-indicator">
            <div className="scroll-dot"></div>
            <ChevronDown size={16} className="scroll-chevron" />
          </div>
          <span>Scroll Down</span>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="stats-bar" id="stats-section">
        <div className="container stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* VEHICLE TYPES */}
      <section className="vehicle-section" id="vehicle-types">
        <div className="container">
          <div className="section-label">Browse By Vehicle <span className="dot"></span></div>
          <h2 className="section-title">
            Parts for <span className="highlight">Every</span> Vehicle Type
          </h2>
          <div className="vehicle-grid">
            {vehicleTypes.map((type) => (
              <Link
                to={`/products?category=${type.name}`}
                key={type.name}
                className="vehicle-card"
                id={`vehicle-${type.name.toLowerCase()}`}
              >
                <span className="vehicle-emoji">{type.emoji}</span>
                <h3>{type.name} AC Parts</h3>
                <p>{type.desc}</p>
                <span className="vehicle-count">{type.count} Products</span>
                <ArrowRight size={18} className="vehicle-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="featured-section" id="featured-products">
        <div className="container">
          <div className="featured-header">
            <div>
              <div className="section-label">Top Picks <span className="dot"></span></div>
              <h2 className="section-title">
                Featured <span className="highlight">Products</span>
              </h2>
            </div>
            <Link to="/products" className="view-all-btn" id="view-all-products">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="products-grid">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="features-section" id="features-section">
        <div className="container">
          <div className="section-label">Why Choose RCS <span className="dot"></span></div>
          <h2 className="section-title">
            Your Trusted <span className="highlight">Partner</span>
          </h2>
          <div className="features-grid">
            {features.map((feat, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{feat.icon}</div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-section" id="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Order?</h2>
            <p>Browse our complete catalog or reach out via WhatsApp for instant quotes and availability.</p>
            <div className="cta-buttons">
              <Link to="/products" className="cta-btn primary">
                Browse Products <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn whatsapp"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
