import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brands } from '../data/products';
import './Brands.css';

const brandInfo = {
  'Mahle Filter': {
    desc: 'Leading international supplier of premium auto parts, thermal systems, and engine components.',
    origin: 'Germany',
    specialty: 'Cabin Filters, Thermostats, Thermal Components',
  },
  'Mahle Behr': {
    desc: 'Joint venture division of MAHLE, specializing in advanced climate control and cooling technologies.',
    origin: 'Germany',
    specialty: 'HVAC Modules, Radiators, Evaporators',
  },
  Fujikoki: {
    desc: 'Japanese precision manufacturer of advanced control components, expansion valves, and switches for automotive climate systems.',
    origin: 'Japan',
    specialty: 'Expansion Valves, Pressure Switches, Control Valves',
  },
  Danfoss: {
    desc: 'Danish multinational manufacturer specializing in highly efficient climate and energy control systems and valves.',
    origin: 'Denmark',
    specialty: 'Expansion Valves, Solenoid Valves, Pressure Regulators',
  },
  'Behr Hella Service': {
    desc: 'Premium German joint venture specializing in automotive thermal management, cooling, and air conditioning solutions.',
    origin: 'Germany',
    specialty: 'Visco Clutches, Radiators, Condensers',
  },
  'Zip Filters': {
    desc: 'High-performance filtration brand delivering premium cabin air filters and air filtration systems for vehicles.',
    origin: 'India',
    specialty: 'Cabin Air Filters, Air Filters',
  },
  Denso: {
    desc: 'Global leader in automotive thermal systems. Japanese precision engineering trusted by top automakers worldwide.',
    origin: 'Japan',
    specialty: 'Compressors, Condensers, Evaporators',
  },
  Subros: {
    desc: 'India\'s leading automotive AC manufacturer, founded in technical collaboration with Denso.',
    origin: 'India',
    specialty: 'Compressors, Condensers, HVAC Units',
  },
  Giladard: {
    desc: 'High-quality manufacturer of specialty automotive cooling line components and accessories.',
    origin: 'Global',
    specialty: 'AC Hose Assemblies, Connectors',
  },
  Spal: {
    desc: 'Italian manufacturer of high-performance electric cooling fans and centrifugal blowers.',
    origin: 'Italy',
    specialty: 'Electric Cooling Fans, Blowers',
  },
  Spintek: {
    desc: 'Innovative manufacturer of specialty AC tools, service equipment, and thermal elements.',
    origin: 'Global',
    specialty: 'AC Service Tools, Airflow Components',
  },
  Sanden: {
    desc: 'Pioneering compressor technology with over 80 years of experience in climate control systems.',
    origin: 'Japan',
    specialty: 'Compressors, Magnetic Clutches',
  },
  Doowon: {
    desc: 'South Korean automotive supplier delivering reliable climate control systems for major Asian automakers.',
    origin: 'South Korea',
    specialty: 'AC Compressors, Evaporator Coils',
  },
  Hanon: {
    desc: 'Global supplier of full-line automotive thermal management systems driving eco-friendly climate solutions.',
    origin: 'South Korea',
    specialty: 'Smart HVAC, Compressors, Fluid Transport',
  },
  Estra: {
    desc: 'Global thermal systems manufacturer providing premium cabin comfort and engine cooling components.',
    origin: 'South Korea',
    specialty: 'HVAC Systems, Condensers, Evaporators',
  },
  Valeo: {
    desc: 'French automotive supplier delivering innovative cooling solutions for passenger and commercial vehicles.',
    origin: 'France',
    specialty: 'Evaporators, Expansion Valves, Blowers',
  },
  SRF: {
    desc: 'Leading manufacturer of Floron brand refrigerants, supplying high-purity gases for automotive AC systems.',
    origin: 'India',
    specialty: 'AC Refrigerant Gases (R134a, R1234yf)',
  },
  Toyota: {
    desc: 'Genuine OEM replacement parts manufactured to Toyota\'s strict quality and reliability standards.',
    origin: 'Japan',
    specialty: 'Genuine OEM AC Components',
  },
  Lexus: {
    desc: 'Genuine OEM replacement parts designed to maintain quietness and peak thermal performance in Lexus vehicles.',
    origin: 'Japan',
    specialty: 'Genuine Luxury OEM Components',
  },
  Motherson: {
    desc: 'Leading global auto component major producing high-quality automotive wiring harnesses and HVAC modules.',
    origin: 'India',
    specialty: 'HVAC Modules, Wiring, Blowers',
  },
  Value: {
    desc: 'World-leading manufacturer of professional refrigeration and AC service tools and vacuum pumps.',
    origin: 'Global',
    specialty: 'AC Service Tools, Vacuum Pumps',
  },
  Honda: {
    desc: 'Genuine OEM replacement parts engineered to ensure original cooling performance in Honda vehicles.',
    origin: 'Japan',
    specialty: 'Genuine OEM AC Parts',
  },
  'MGP (Maruti Genuine Parts)': {
    desc: 'Official genuine parts for Maruti Suzuki vehicles, ensuring perfect fit and long service life.',
    origin: 'India',
    specialty: 'Genuine AC Parts, Filters, Clutches',
  },
  BPI: {
    desc: 'Premium aftermarket manufacturer supplying reliable replacement components for auto systems.',
    origin: 'Global',
    specialty: 'Aftermarket AC & Mechanical Components',
  },
  Pasio: {
    desc: 'Trusted aftermarket manufacturer specializing in durable climate control and replacement AC parts.',
    origin: 'Global',
    specialty: 'Aftermarket AC Valves, Hoses',
  },
  Zilax: {
    desc: 'Modern manufacturer of high-quality replacement parts and thermal elements for passenger vehicles.',
    origin: 'Global',
    specialty: 'AC Expansion Valves, Switches',
  },
  Vika: {
    desc: 'Premium spare parts brand specializing in Volkswagen Group and Skoda vehicles cooling components.',
    origin: 'Germany / Czech',
    specialty: 'Control Valves, Thermostats, Fan Assemblies',
  },
  NSK: {
    desc: 'One of the world\'s leading bearing manufacturers, supplying durable bearings for AC clutches.',
    origin: 'Japan',
    specialty: 'AC Compressor Clutch Bearings',
  },
  Delphi: {
    desc: 'Delphi Technologies delivers OE-quality HVAC and thermal components trusted by top automakers.',
    origin: 'USA',
    specialty: 'AC Compressors, Condensers, Sensors',
  },
  Banco: {
    desc: 'Indian manufacturer of engine cooling systems, radiators, and industrial heat exchangers.',
    origin: 'India',
    specialty: 'Radiators, Intercoolers, Oil Coolers',
  },
  Bitzer: {
    desc: 'World-renowned for heavy-duty compressors built for extreme conditions in commercial vehicles.',
    origin: 'Germany',
    specialty: 'Industrial Compressors, Bus AC Systems',
  },
};

const brandLogos = {
  'Mahle Filter': '/manufacturer-logos/mahle.png',
  'Mahle Behr': '/manufacturer-logos/mahle_behr.png',
  'Fujikoki': '/manufacturer-logos/fujikoki.png',
  'Danfoss': '/manufacturer-logos/danfoss.png',
  'Behr Hella Service': '/manufacturer-logos/behr_hella.png',
  'Zip Filters': '/manufacturer-logos/zip_filters.png',
  'Spintek': '/manufacturer-logos/spintek.png',
  'Denso': '/manufacturer-logos/denso.png',
  'Sanden': '/manufacturer-logos/sanden.png',
  'Hanon': '/manufacturer-logos/hanon.png',
  'Valeo': '/manufacturer-logos/valeo.png',
  'SRF': '/manufacturer-logos/srf.png',
  'Toyota': '/manufacturer-logos/toyota.png',
  'Lexus': '/manufacturer-logos/lexus.png',
  'Motherson': '/manufacturer-logos/motherson.png',
  'Honda': '/manufacturer-logos/honda.png',
  'MGP (Maruti Genuine Parts)': '/manufacturer-logos/mgp__maruti_genuine_parts_.png',
  'NSK': '/manufacturer-logos/nsk.svg',
  'Delphi': '/manufacturer-logos/delphi.svg',
  'Bitzer': '/manufacturer-logos/bitzer.svg',
  'Giladard': '/manufacturer-logos/giladard.png',
  'Spal': '/manufacturer-logos/spal.png',
  'Estra': '/manufacturer-logos/estra.png',
  'Doowon': '/manufacturer-logos/doowon.png',
  'Subros': '/manufacturer-logos/subros.png',
  'Banco': '/manufacturer-logos/banco.png',
  'BPI': '/manufacturer-logos/bpi.png',
  'Value': '/manufacturer-logos/value.png',
  'Pasio': '/manufacturer-logos/pasio.png',
  'Zilax': '/manufacturer-logos/zilax.png',
  'Vika': '/manufacturer-logos/vika.png',
};

export default function Brands() {
  return (
    <div className="brands-page page-transition">
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
                  <div className="partner-brand-logo-container">
                    {brandLogos[brand] ? (
                      <img src={brandLogos[brand]} alt={`${brand} logo`} className="partner-brand-logo-img" />
                    ) : (
                      <div className="partner-brand-logo-fallback">{brand[0]}</div>
                    )}
                  </div>
                  <div className="brand-card-top-info">
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
