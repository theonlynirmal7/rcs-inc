import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ShieldCheck, Car, HelpCircle, ArrowRight } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import './CarBrands.css';

const carBrands = [
  {
    name: 'Isuzu',
    logoUrl: '/brand-logos/isuzu.png',
    category: 'Commercial & UV',
    origin: 'Japan',
    description: 'Compatible AC parts for D-Max, V-Cross, MU-X, and commercial trucks.',
    types: ['Car', 'Truck', 'Payload Vehicle']
  },
  {
    name: 'Aston Martin',
    logoUrl: '/brand-logos/aston-martin.png',
    category: 'Luxury Sports',
    origin: 'United Kingdom',
    description: 'Precision climate components for Vantage, DB11, DBS, and DBX.',
    types: ['Car']
  },
  {
    name: 'Audi',
    logoUrl: '/brand-logos/audi.png',
    category: 'Premium Passenger',
    origin: 'Germany',
    description: 'OEM-grade compressors and evaporators for A3, A4, A6, Q3, Q5, Q7.',
    types: ['Car']
  },
  {
    name: 'Bentley',
    logoUrl: '/brand-logos/bentley.png',
    category: 'Ultra Luxury',
    origin: 'United Kingdom',
    description: 'Bespoke climate control parts for Continental GT, Flying Spur, Bentayga.',
    types: ['Car']
  },
  {
    name: 'BMW',
    logoUrl: '/brand-logos/bmw.png',
    category: 'Premium Passenger',
    origin: 'Germany',
    description: 'Premium condensers and blowers for 3 Series, 5 Series, 7 Series, X1, X3, X5.',
    types: ['Car']
  },
  {
    name: 'Bugatti',
    logoUrl: '/brand-logos/bugatti.png',
    category: 'Supercar',
    origin: 'France',
    description: 'High-performance bespoke climate control units for Veyron, Chiron, Divo.',
    types: ['Car']
  },
  {
    name: 'Chevrolet',
    logoUrl: '/brand-logos/chevrolet.png',
    category: 'Passenger',
    origin: 'United States',
    description: 'Replacement AC parts for Beat, Cruze, Sail, Tavera, Enjoy, Trailblazer.',
    types: ['Car']
  },
  {
    name: 'Citroen',
    logoUrl: '/brand-logos/citroen.png',
    category: 'Passenger',
    origin: 'France',
    description: 'Modern cooling solutions for C3, C3 Aircross, C5 Aircross, and eC3.',
    types: ['Car']
  },
  {
    name: 'Ferrari',
    logoUrl: '/brand-logos/ferrari.png',
    category: 'Supercar',
    origin: 'Italy',
    description: 'High-performance HVAC components for Roma, Portofino, F8, SF90.',
    types: ['Car']
  },
  {
    name: 'Ford',
    logoUrl: '/brand-logos/ford.png',
    category: 'Passenger & SUV',
    origin: 'United States',
    description: 'Genuine parts for Figo, Aspire, EcoSport, Endeavour, Mustang.',
    types: ['Car']
  },
  {
    name: 'Honda',
    logoUrl: '/brand-logos/honda.png',
    category: 'Passenger',
    origin: 'Japan',
    description: 'Highly reliable AC components for City, Amaze, Civic, Jazz, WR-V, CR-V.',
    types: ['Car']
  },
  {
    name: 'Hyundai',
    logoUrl: '/brand-logos/hyundai.png',
    category: 'Passenger & SUV',
    origin: 'South Korea',
    description: 'Full AC system support for i10, i20, Verna, Creta, Venue, Alcazar, Tucson.',
    types: ['Car']
  },
  {
    name: 'Jaguar',
    logoUrl: '/brand-logos/jaguar.png',
    category: 'Premium Passenger',
    origin: 'United Kingdom',
    description: 'Luxury climate control parts for XE, XF, XJ, F-Pace, F-Type.',
    types: ['Car']
  },
  {
    name: 'Jeep',
    logoUrl: '/brand-logos/jeep.png',
    category: 'SUV',
    origin: 'United States',
    description: 'Heavy-duty AC units for Compass, Meridian, Wrangler, Grand Cherokee.',
    types: ['Car']
  },
  {
    name: 'Kia',
    logoUrl: '/brand-logos/kia.png',
    category: 'Passenger & SUV',
    origin: 'South Korea',
    description: 'Complete cooling solutions for Seltos, Sonet, Carens, Carnival, EV6.',
    types: ['Car']
  },
  {
    name: 'Lamborghini',
    logoUrl: '/brand-logos/lamborghini.png',
    category: 'Supercar',
    origin: 'Italy',
    description: 'Heavy-duty cooling units for Huracan, Aventador, Urus.',
    types: ['Car']
  },
  {
    name: 'Land Rover',
    logoUrl: '/brand-logos/land-rover.png',
    category: 'Premium SUV',
    origin: 'United Kingdom',
    description: 'Robust climate spares for Defender, Discovery, Range Rover Evoque, Velar, Sport.',
    types: ['Car']
  },
  {
    name: 'Lexus',
    logoUrl: '/brand-logos/lexus.png',
    category: 'Premium Passenger',
    origin: 'Japan',
    description: 'Ultra-quiet climate components for ES, NX, RX, LX, LC.',
    types: ['Car']
  },
  {
    name: 'Maserati',
    logoUrl: '/brand-logos/maserati.png',
    category: 'Luxury Sports',
    origin: 'Italy',
    description: 'AC parts designed for Ghibli, Quattroporte, Levante, MC20.',
    types: ['Car']
  },
  {
    name: 'Mercedes-Benz',
    logoUrl: '/brand-logos/mercedes-benz.png',
    category: 'Premium Passenger',
    origin: 'Germany',
    description: 'Advanced HVAC spares for A-Class, C-Class, E-Class, S-Class, GLA, GLC, GLE, GLS.',
    types: ['Car', 'Bus', 'Truck']
  },
  {
    name: 'Mini',
    logoUrl: '/brand-logos/mini.png',
    category: 'Passenger',
    origin: 'United Kingdom',
    description: 'Climate spares for Mini Cooper, Clubman, Countryman.',
    types: ['Car']
  },
  {
    name: 'Mitsubishi',
    logoUrl: '/brand-logos/mitsubishi.png',
    category: 'SUV & UV',
    origin: 'Japan',
    description: 'Heavy-duty AC units for Lancer, Pajero, Outlander, Montero.',
    types: ['Car']
  },
  {
    name: 'Nissan',
    logoUrl: '/brand-logos/nissan.png',
    category: 'Passenger & SUV',
    origin: 'Japan',
    description: 'Compatible spares for Micra, Sunny, Terrano, Kicks, Magnite, Kicks.',
    types: ['Car']
  },
  {
    name: 'Porsche',
    logoUrl: '/brand-logos/porsche.png',
    category: 'Luxury Sports',
    origin: 'Germany',
    description: 'OEM-grade AC parts for 911, Boxster, Cayman, Cayenne, Macan, Panamera, Taycan.',
    types: ['Car']
  },
  {
    name: 'Renault',
    logoUrl: '/brand-logos/renault.png',
    category: 'Passenger & SUV',
    origin: 'France',
    description: 'Cooling components for Kwid, Triber, Kiger, Duster.',
    types: ['Car']
  },
  {
    name: 'Skoda',
    logoUrl: '/brand-logos/skoda.png',
    category: 'Passenger',
    origin: 'Czech Republic',
    description: 'Premium AC compressors and condensers for Rapid, Octavia, Superb, Kushaq, Slavia, Kodiaq.',
    types: ['Car']
  },
  {
    name: 'Maruti Suzuki',
    logoUrl: '/brand-logos/suzuki.png',
    category: 'Passenger & SUV',
    origin: 'India / Japan',
    description: 'Massive inventory for Alto, Swift, Baleno, Dzire, Brezza, Ertiga, Grand Vitara.',
    types: ['Car']
  },
  {
    name: 'Toyota',
    logoUrl: '/brand-logos/toyota.png',
    category: 'Passenger & SUV',
    origin: 'Japan',
    description: 'High-performance AC units for Glanza, Urban Cruiser, Innova Crysta, Fortuner.',
    types: ['Car']
  },
  {
    name: 'Volkswagen',
    logoUrl: '/brand-logos/volkswagen.png',
    category: 'Passenger & SUV',
    origin: 'Germany',
    description: 'German-engineered AC spares for Polo, Vento, Taigun, Virtus, Tiguan.',
    types: ['Car']
  },
  {
    name: 'Volvo',
    logoUrl: '/brand-logos/volvo.png',
    category: 'Premium Passenger & SUV',
    origin: 'Sweden',
    description: 'Premium HVAC components for S60, S90, XC40, XC60, XC90.',
    types: ['Car', 'Bus', 'Truck']
  },
  {
    name: 'Rolls Royce',
    logoUrl: '/brand-logos/rolls-royce.png',
    category: 'Ultra Luxury',
    origin: 'United Kingdom',
    description: 'Bespoke climate control parts for Ghost, Phantom, Wraith, Dawn, Cullinan.',
    types: ['Car']
  },
  {
    name: 'Mahindra',
    logoUrl: '/brand-logos/mahindra.png',
    category: 'SUV & Commercial',
    origin: 'India',
    description: 'Heavy-duty AC systems for Thar, Scorpio Classic/N, XUV300, XUV700, Bolero.',
    types: ['Car', 'Truck', 'Payload Vehicle']
  },
  {
    name: 'Tata Motors',
    logoUrl: '/brand-logos/tata.png',
    category: 'Passenger & Commercial',
    origin: 'India',
    description: 'Sturdy HVAC components for Tiago, Tigor, Altroz, Nexon, Harrier, Safari, Punch.',
    types: ['Car', 'Bus', 'Truck', 'Payload Vehicle']
  },
  {
    name: 'MG',
    logoUrl: '/brand-logos/mg.png',
    category: 'Passenger & SUV',
    origin: 'United Kingdom / China',
    description: 'Compatible cooling solutions for Hector, Astor, Gloster, ZS EV, Comet.',
    types: ['Car']
  },
  {
    name: 'Ashok Leyland',
    logoUrl: '/brand-logos/ashok-leyland.png',
    category: 'Bus & Truck',
    origin: 'India',
    description: 'Top manufacturer of commercial vehicles in India. Heavy-duty AC spares for Viking, Cheetah, Oyster, Dost, Partner.',
    types: ['Bus', 'Truck', 'Payload Vehicle']
  },
  {
    name: 'BharatBenz',
    logoUrl: '/brand-logos/bharatbenz.png',
    category: 'Bus & Truck',
    origin: 'India / Germany',
    description: 'Daimler-backed premium commercial vehicle brand. Advanced HVAC solutions for heavy trucks and luxury coaches.',
    types: ['Bus', 'Truck']
  },
  {
    name: 'Eicher Motors',
    logoUrl: '/brand-logos/eicher.png',
    category: 'Bus & Truck',
    origin: 'India',
    description: 'Joint venture with Volvo. Durable AC compressors, blowers, and lines for light, medium, and heavy transport fleets.',
    types: ['Bus', 'Truck']
  },
  {
    name: 'SML Isuzu',
    logoUrl: '/brand-logos/sml-isuzu.png',
    category: 'Bus & Truck',
    origin: 'India / Japan',
    description: 'Trusted manufacturer of school buses, ambulances, staff buses, and light cargo vehicles in India.',
    types: ['Bus', 'Truck', 'Payload Vehicle']
  },
  {
    name: 'JCB',
    logoUrl: '/brand-logos/jcb.png',
    category: 'Heavy Equipment',
    origin: 'United Kingdom / India',
    description: 'India\'s leading backhoe loader and excavator manufacturer. Rugged AC cabin compressors and expansion valves.',
    types: ['Bulldozer', 'Construction Vehicle']
  },
  {
    name: 'Caterpillar (CAT)',
    logoUrl: '/brand-logos/caterpillar.png',
    category: 'Heavy Equipment',
    origin: 'United States',
    description: 'Global construction giant. Heavy-duty climate systems built to withstand harsh mining and quarry environments.',
    types: ['Bulldozer', 'Construction Vehicle']
  },
  {
    name: 'Komatsu',
    logoUrl: '/brand-logos/komatsu.png',
    category: 'Heavy Equipment',
    origin: 'Japan',
    description: 'High-precision Japanese industrial machinery. Reliable cabin climate control modules for dozers, dumpers, and excavators.',
    types: ['Bulldozer', 'Construction Vehicle']
  },
  {
    name: 'Tata Hitachi',
    logoUrl: '/brand-logos/tata-hitachi.png',
    category: 'Heavy Equipment',
    origin: 'India / Japan',
    description: 'Leading hydraulic excavator manufacturer. Built-to-last AC evaporators and condenser units for earthmoving operations.',
    types: ['Bulldozer', 'Construction Vehicle']
  },
  {
    name: 'BEML',
    logoUrl: '/brand-logos/beml.png',
    category: 'Heavy Equipment',
    origin: 'India',
    description: 'Public sector undertaking manufacturing heavy mining dozers, dumpers, and metro coaches with specialized AC units.',
    types: ['Bulldozer', 'Construction Vehicle']
  }
];

const categories = ['All', 'Car', 'Bus', 'Truck', 'Bulldozer', 'Payload Vehicle', 'Construction Vehicle'];

export default function CarBrands() {
  useSEO('Supported Vehicle Brands', 'Find compatible car, bus, truck, and bulldozer AC spare parts for Maruti Suzuki, Tata Motors, Ashok Leyland, Mahindra, JCB, Volvo, and more.');

  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredBrands = carBrands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(search.toLowerCase()) || 
                          brand.description.toLowerCase().includes(search.toLowerCase());
    
    if (selectedCategory === 'All') return matchesSearch;
    
    return matchesSearch && brand.types && brand.types.includes(selectedCategory);
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
              {categories.map(cat => {
                const labels = {
                  'All': 'All Vehicles',
                  'Car': '🚗 Passenger Cars',
                  'Bus': '🚌 Buses',
                  'Truck': '🚚 Trucks',
                  'Bulldozer': '🚜 Bulldozers',
                  'Payload Vehicle': '🚛 Commercial Vehicles',
                  'Construction Vehicle': '🚜 Construction Equipment'
                };
                return (
                  <button
                    key={cat}
                    className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {labels[cat] || cat}
                  </button>
                );
              })}
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
              className="whatsapp-cta-btn premium-liquid-btn btn-whatsapp"
            >
              <span className="btn-content">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }}>
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                Consult AC Expert
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
      </section>
    </div>
  );
}
