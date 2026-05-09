import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brands } from '../data/products';
import './Brands.css';

const brandInfo = {
  Denso: {
    desc: 'Global leader in automotive thermal systems. Japanese precision engineering trusted by top automakers worldwide.',
    origin: 'Japan',
    specialty: 'Compressors, Condensers, Evaporators',
  },
  Sanden: {
    desc: 'Pioneering compressor technology with over 80 years of experience in vehicle climate control systems.',
    origin: 'Japan',
    specialty: 'Compressors, Magnetic Clutches',
  },
  Valeo: {
    desc: 'French automotive supplier delivering innovative cooling solutions for passenger and commercial vehicles.',
    origin: 'France',
    specialty: 'Evaporators, Expansion Valves, Blowers',
  },
  Behr: {
    desc: 'Premium German engineering for thermal management. Now part of MAHLE group, known for reliability.',
    origin: 'Germany',
    specialty: 'Radiator Fans, Blower Motors',
  },
  Bitzer: {
    desc: 'World-renowned for heavy-duty compressors built for extreme conditions in commercial vehicles.',
    origin: 'Germany',
    specialty: 'Industrial Compressors, Bus AC Systems',
  },
};

export default function Brands() {
  return (
    <div className="brands-page">
      <section className="brands-hero">
        <div className="container">
          <div className="section-label">Our Partners <span className="dot"></span></div>
          <h1 className="section-title">
            Trusted <span className="highlight">Brands</span>
          </h1>
          <p className="brands-hero-desc">
            We distribute parts from globally recognized manufacturers, ensuring quality and reliability.
          </p>
        </div>
      </section>

      <section className="brands-content">
        <div className="container">
          <div className="brands-grid">
            {brands.map(brand => (
              <div key={brand} className="brand-card" id={`brand-${brand.toLowerCase()}`}>
                <div className="brand-card-top">
                  <div className="brand-initial">{brand[0]}</div>
                  <div>
                    <h3>{brand}</h3>
                    <span className="brand-origin">📍 {brandInfo[brand].origin}</span>
                  </div>
                </div>
                <p className="brand-desc">{brandInfo[brand].desc}</p>
                <div className="brand-specialty">
                  <span className="specialty-label">Specialty:</span>
                  <span>{brandInfo[brand].specialty}</span>
                </div>
                <Link to={`/products?category=All`} className="brand-link">
                  View Products <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
