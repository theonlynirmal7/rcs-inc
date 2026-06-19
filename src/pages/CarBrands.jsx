import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Car, HelpCircle, ArrowRight } from 'lucide-react';
import './CarBrands.css';

const carBrands = [
  {
    name: 'Isuzu',
    logoUrl: '/brand-logos/isuzu.png',
    category: 'Commercial & UV',
    origin: 'Japan',
    description: 'Compatible AC parts for D-Max, V-Cross, MU-X, and commercial trucks.'
  },
  {
    name: 'Aston Martin',
    logoUrl: '/brand-logos/aston-martin.png',
    category: 'Luxury Sports',
    origin: 'United Kingdom',
    description: 'Precision climate components for Vantage, DB11, DBS, and DBX.'
  },
  {
    name: 'Audi',
    logoUrl: '/brand-logos/audi.png',
    category: 'Premium Passenger',
    origin: 'Germany',
    description: 'OEM-grade compressors and evaporators for A3, A4, A6, Q3, Q5, Q7.'
  },
  {
    name: 'Bentley',
    logoUrl: '/brand-logos/bentley.png',
    category: 'Ultra Luxury',
    origin: 'United Kingdom',
    description: 'Bespoke climate control parts for Continental GT, Flying Spur, Bentayga.'
  },
  {
    name: 'BMW',
    logoUrl: '/brand-logos/bmw.png',
    category: 'Premium Passenger',
    origin: 'Germany',
    description: 'Premium condensers and blowers for 3 Series, 5 Series, 7 Series, X1, X3, X5.'
  },
  {
    name: 'Chevrolet',
    logoUrl: '/brand-logos/chevrolet.png',
    category: 'Passenger',
    origin: 'United States',
    description: 'Replacement AC parts for Beat, Cruze, Sail, Tavera, Enjoy, Trailblazer.'
  },
  {
    name: 'Citroen',
    logoUrl: '/brand-logos/citroen.png',
    category: 'Passenger',
    origin: 'France',
    description: 'Modern cooling solutions for C3, C3 Aircross, C5 Aircross, and eC3.'
  },
  {
    name: 'Ferrari',
    logoUrl: '/brand-logos/ferrari.png',
    category: 'Supercar',
    origin: 'Italy',
    description: 'High-performance HVAC components for Roma, Portofino, F8, SF90.'
  },
  {
    name: 'Ford',
    logoUrl: '/brand-logos/ford.png',
    category: 'Passenger & SUV',
    origin: 'United States',
    description: 'Genuine parts for Figo, Aspire, EcoSport, Endeavour, Mustang.'
  },
  {
    name: 'Honda',
    logoUrl: '/brand-logos/honda.png',
    category: 'Passenger',
    origin: 'Japan',
    description: 'Highly reliable AC components for City, Amaze, Civic, Jazz, WR-V, CR-V.'
  },
  {
    name: 'Hyundai',
    logoUrl: '/brand-logos/hyundai.png',
    category: 'Passenger & SUV',
    origin: 'South Korea',
    description: 'Full AC system support for i10, i20, Verna, Creta, Venue, Alcazar, Tucson.'
  },
  {
    name: 'Jaguar',
    logoUrl: '/brand-logos/jaguar.png',
    category: 'Premium Passenger',
    origin: 'United Kingdom',
    description: 'Luxury climate control parts for XE, XF, XJ, F-Pace, F-Type.'
  },
  {
    name: 'Jeep',
    logoUrl: '/brand-logos/jeep.png',
    category: 'SUV',
    origin: 'United States',
    description: 'Heavy-duty AC units for Compass, Meridian, Wrangler, Grand Cherokee.'
  },
  {
    name: 'Kia',
    logoUrl: '/brand-logos/kia.png',
    category: 'Passenger & SUV',
    origin: 'South Korea',
    description: 'Complete cooling solutions for Seltos, Sonet, Carens, Carnival, EV6.'
  },
  {
    name: 'Lamborghini',
    logoUrl: '/brand-logos/lamborghini.png',
    category: 'Supercar',
    origin: 'Italy',
    description: 'Heavy-duty cooling units for Huracan, Aventador, Urus.'
  },
  {
    name: 'Land Rover',
    logoUrl: '/brand-logos/land-rover.png',
    category: 'Premium SUV',
    origin: 'United Kingdom',
    description: 'Robust climate spares for Defender, Discovery, Range Rover Evoque, Velar, Sport.'
  },
  {
    name: 'Lexus',
    logoUrl: '/brand-logos/lexus.png',
    category: 'Premium Passenger',
    origin: 'Japan',
    description: 'Ultra-quiet climate components for ES, NX, RX, LX, LC.'
  },
  {
    name: 'Maserati',
    logoUrl: '/brand-logos/maserati.png',
    category: 'Luxury Sports',
    origin: 'Italy',
    description: 'AC parts designed for Ghibli, Quattroporte, Levante, MC20.'
  },
  {
    name: 'Mazda',
    logoUrl: '/brand-logos/mazda.png',
    category: 'Passenger & SUV',
    origin: 'Japan',
    description: 'AC parts compatible with Mazda 2, 3, 6, CX-3, CX-5, CX-9, and MX-5.'
  },
  {
    name: 'Mercedes-Benz',
    logoUrl: '/brand-logos/mercedes-benz.png',
    category: 'Premium Passenger',
    origin: 'Germany',
    description: 'Advanced HVAC spares for A-Class, C-Class, E-Class, S-Class, GLA, GLC, GLE, GLS.'
  },
  {
    name: 'Mini',
    logoUrl: '/brand-logos/mini.png',
    category: 'Passenger',
    origin: 'United Kingdom',
    description: 'Climate spares for Mini Cooper, Clubman, Countryman.'
  },
  {
    name: 'Mitsubishi',
    logoUrl: '/brand-logos/mitsubishi.png',
    category: 'SUV & UV',
    origin: 'Japan',
    description: 'Heavy-duty AC units for Lancer, Pajero, Outlander, Montero.'
  },
  {
    name: 'Nissan',
    logoUrl: '/brand-logos/nissan.png',
    category: 'Passenger & SUV',
    origin: 'Japan',
    description: 'Compatible spares for Micra, Sunny, Terrano, Kicks, Magnite, Kicks.'
  },
  {
    name: 'Opel',
    logoUrl: '/brand-logos/opel.png',
    category: 'Passenger',
    origin: 'Germany',
    description: 'Cooling system replacement components for Corsa, Astra, Insignia.'
  },
  {
    name: 'Porsche',
    logoUrl: '/brand-logos/porsche.png',
    category: 'Luxury Sports',
    origin: 'Germany',
    description: 'OEM-grade AC parts for 911, Boxster, Cayman, Cayenne, Macan, Panamera, Taycan.'
  },
  {
    name: 'Renault',
    logoUrl: '/brand-logos/renault.png',
    category: 'Passenger & SUV',
    origin: 'France',
    description: 'Cooling components for Kwid, Triber, Kiger, Duster.'
  },
  {
    name: 'Skoda',
    logoUrl: '/brand-logos/skoda.png',
    category: 'Passenger',
    origin: 'Czech Republic',
    description: 'Premium AC compressors and condensers for Rapid, Octavia, Superb, Kushaq, Slavia, Kodiaq.'
  },
  {
    name: 'Maruti Suzuki',
    logoUrl: '/brand-logos/suzuki.png',
    category: 'Passenger & SUV',
    origin: 'India / Japan',
    description: 'Massive inventory for Alto, Swift, Baleno, Dzire, Brezza, Ertiga, Grand Vitara.'
  },
  {
    name: 'Tesla',
    logoUrl: '/brand-logos/tesla.png',
    category: 'Passenger & SUV',
    origin: 'United States',
    description: 'Compatible thermal management parts for Model S, Model 3, Model X, Model Y.'
  },
  {
    name: 'Toyota',
    logoUrl: '/brand-logos/toyota.png',
    category: 'Passenger & SUV',
    origin: 'Japan',
    description: 'High-performance AC units for Glanza, Urban Cruiser, Innova Crysta, Fortuner.'
  },
  {
    name: 'Volkswagen',
    logoUrl: '/brand-logos/volkswagen.png',
    category: 'Passenger & SUV',
    origin: 'Germany',
    description: 'German-engineered AC spares for Polo, Vento, Taigun, Virtus, Tiguan.'
  },
  {
    name: 'Volvo',
    logoUrl: '/brand-logos/volvo.png',
    category: 'Premium Passenger & SUV',
    origin: 'Sweden',
    description: 'Premium HVAC components for S60, S90, XC40, XC60, XC90.'
  },
  {
    name: 'Bugatti',
    logoUrl: '/brand-logos/bugatti.png',
    category: 'Supercar',
    origin: 'France',
    description: 'High-end cooling and HVAC support for Veyron, Chiron.'
  },
  {
    name: 'Rolls Royce',
    logoUrl: '/brand-logos/rolls-royce.png',
    category: 'Ultra Luxury',
    origin: 'United Kingdom',
    description: 'Bespoke climate control parts for Ghost, Phantom, Wraith, Dawn, Cullinan.'
  },
  {
    name: 'Mahindra',
    logoUrl: '/brand-logos/mahindra.png',
    category: 'SUV & Commercial',
    origin: 'India',
    description: 'Heavy-duty AC systems for Thar, Scorpio Classic/N, XUV300, XUV700, Bolero.'
  },
  {
    name: 'Tata Motors',
    logoUrl: '/brand-logos/tata.png',
    category: 'Passenger & Commercial',
    origin: 'India',
    description: 'Sturdy HVAC components for Tiago, Tigor, Altroz, Nexon, Harrier, Safari, Punch.'
  },
  {
    name: 'MG',
    logoUrl: '/brand-logos/mg.png',
    category: 'Passenger & SUV',
    origin: 'United Kingdom / China',
    description: 'Compatible cooling solutions for Hector, Astor, Gloster, ZS EV, Comet.'
  }
];

const categories = ['All', 'Passenger', 'SUV', 'Premium Passenger', 'Premium SUV', 'Commercial & UV', 'Luxury & Supercar'];

export default function CarBrands() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBrands = carBrands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(search.toLowerCase()) || 
                          brand.description.toLowerCase().includes(search.toLowerCase());
    
    if (selectedCategory === 'All') return matchesSearch;
    
    if (selectedCategory === 'Luxury & Supercar') {
      return matchesSearch && (brand.category === 'Supercar' || brand.category === 'Luxury Sports' || brand.category === 'Ultra Luxury');
    }
    
    return matchesSearch && brand.category.includes(selectedCategory);
  });

  return (
    <div className="car-brands-page page-transition">
      {/* HERO SECTION */}
      <section className="car-brands-hero">
        <div className="container">
          <div className="section-label">Supported Manufacturers <span className="dot"></span></div>
          <h1 className="section-title">
            Find Parts by <span className="highlight">Vehicle Brand</span>
          </h1>
          <p className="hero-subtitle">
            We distribute genuine and premium aftermarket AC spare parts compatible with a wide range of global automotive manufacturers.
          </p>
        </div>
      </section>

      {/* COMPATIBILITY NOTICE */}
      <section className="compatibility-highlights">
        <div className="container highlights-grid">
          <div className="highlight-card">
            <ShieldCheck size={36} className="highlight-icon" />
            <h3>100% Guaranteed Fit</h3>
            <p>All spare parts are tested to match exact OEM specifications for each respective vehicle model.</p>
          </div>
          <div className="highlight-card">
            <Car size={36} className="highlight-icon" />
            <h3>Complete Vehicle Range</h3>
            <p>From hatchbacks and SUVs to luxury supercars and commercial trucks, we cover all segments.</p>
          </div>
          <div className="highlight-card">
            <HelpCircle size={36} className="highlight-icon" />
            <h3>Custom Model Inquiries</h3>
            <p>Can't find your specific vehicle variant? Our engineering team can source customized parts directly.</p>
          </div>
        </div>
      </section>

      {/* SEARCH AND FILTERS */}
      <section className="brands-search-section">
        <div className="container">
          <div className="search-filter-wrapper">
            <div className="brand-search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search car brand or model (e.g. Swift, Innova, Nexon)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            
            <div className="category-tabs">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BRANDS GRID */}
      <section className="car-brands-grid-section">
        <div className="container">
          {filteredBrands.length > 0 ? (
            <div className="car-brands-grid">
              {filteredBrands.map(brand => (
                <div key={brand.name} className="car-brand-card">
                  <div className="brand-logo-container">
                    <img 
                      src={brand.logoUrl} 
                      alt={`${brand.name} logo`} 
                      className="brand-logo-img" 
                      loading="lazy" 
                      onError={(e) => {
                        // fallback to styled initials if loading fails
                        e.target.style.display = 'none';
                        const fallback = e.target.nextSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="brand-logo-fallback" style={{ display: 'none' }}>
                      {brand.name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div className="brand-info">
                    <h3>{brand.name}</h3>
                    <div className="brand-meta">
                      <span className="brand-origin">{brand.origin}</span>
                      <span className="brand-tag">{brand.category}</span>
                    </div>
                    <p className="brand-desc">{brand.description}</p>
                    <Link to={`/products?search=${encodeURIComponent(brand.name)}`} className="view-parts-link">
                      View Compatible Parts <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-brands-found">
              <h3>No supported brands found</h3>
              <p>We might still have AC parts for your vehicle. Please contact our support team to verify.</p>
              <a 
                href="https://wa.me/919962173870?text=Hello!%20I%20want%20to%20inquire%20about%20AC%20spare%20parts%20for%20my%20vehicle."
                target="_blank"
                rel="noopener noreferrer"
                className="inquiry-btn"
              >
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }}>
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                Inquire via WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="brands-cta-section">
        <div className="container">
          <div className="brands-cta-card">
            <h2>Need Assistance with Compatibility?</h2>
            <p>Send us your vehicle registration number or chassis number (VIN) on WhatsApp, and our experts will identify the exact compressor, condenser, or coil that fits your car perfectly.</p>
            <a
              href="https://wa.me/919962173870?text=Hello!%20I%20need%20help%20finding%20compatible%20AC%20parts%20for%20my%20car."
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-cta-btn"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }}>
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
              </svg>
              Consult AC Expert
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
