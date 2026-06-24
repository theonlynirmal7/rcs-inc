import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, Truck, Shield, Headphones, Zap, Search, Mic, MicOff, X, Sparkles, Clock, Package, Tag } from 'lucide-react';
import { getProducts, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import heroParts from '../assets/hero-parts.png';
import './Home.css';

const marqueeBrands = [
  { name: 'Maruti Suzuki', logoUrl: '/brand-logos/suzuki.png' },
  { name: 'Toyota', logoUrl: '/brand-logos/toyota.png' },
  { name: 'Hyundai', logoUrl: '/brand-logos/hyundai.png' },
  { name: 'Honda', logoUrl: '/brand-logos/honda.png' },
  { name: 'Tata Motors', logoUrl: '/brand-logos/tata.png' },
  { name: 'Mahindra', logoUrl: '/brand-logos/mahindra.png' },
  { name: 'BMW', logoUrl: '/brand-logos/bmw.png' },
  { name: 'Mercedes-Benz', logoUrl: '/brand-logos/mercedes-benz.png' },
  { name: 'Audi', logoUrl: '/brand-logos/audi.png' },
  { name: 'Volkswagen', logoUrl: '/brand-logos/volkswagen.png' },
  { name: 'Ford', logoUrl: '/brand-logos/ford.png' },
  { name: 'Chevrolet', logoUrl: '/brand-logos/chevrolet.png' },
  { name: 'Kia', logoUrl: '/brand-logos/kia.png' }
];

const faqCategories = [
  {
    id: "products",
    name: "Products & Compatibility",
    items: [
      {
        q: "How do I know if a part is compatible with my vehicle?",
        a: "Search by vehicle brand and model or contact us with your vehicle details."
      },
      {
        q: "Do you supply OEM and aftermarket parts?",
        a: "Yes, we supply both OEM and quality-tested aftermarket AC components."
      },
      {
        q: "Which vehicle types do you support?",
        a: "Cars, SUVs, trucks, buses, commercial vehicles, and fleet vehicles."
      },
      {
        q: "What AC components do you stock?",
        a: "Compressors, condensers, evaporators, blower motors, expansion valves, receiver driers, cooling coils, and more."
      }
    ]
  },
  {
    id: "orders",
    name: "Orders & Distribution",
    items: [
      {
        q: "Do you sell in bulk?",
        a: "Yes, we specialize in wholesale and bulk orders for dealers and workshops."
      },
      {
        q: "Can workshops and garages become regular customers?",
        a: "Yes, we offer dedicated support for workshops, garages, and fleet operators."
      },

      {
        q: "What is the minimum order quantity?",
        a: "MOQ depends on the product category and brand."
      }
    ]
  },
  {
    id: "shipping",
    name: "Shipping & Support",
    items: [
      {
        q: "Do you deliver across India?",
        a: "Yes, we ship to customers nationwide through trusted logistics partners."
      },
      {
        q: "How quickly are orders delivered?",
        a: "We deliver orders as quickly as possible based on your location, product availability, and shipping distance. Our team works to ensure fast and reliable delivery across India."
      },
      {
        q: "How can I get a quote?",
        a: "Contact us through WhatsApp or the enquiry form for pricing and availability."
      },
      {
        q: "Do you provide technical assistance?",
        a: "Yes, our team can help identify the correct component for your application."
      }
    ]
  },
  {
    id: "trust",
    name: "Trust & Quality",
    items: [
      {
        q: "Are your products genuine?",
        a: "We source products from trusted manufacturers and authorized suppliers."
      },
      {
        q: "Which brands do you distribute?",
        a: "We work with leading automotive cooling brands including OEM and aftermarket manufacturers."
      },
      {
        q: "Do your parts come with warranty support?",
        a: "Warranty availability depends on the manufacturer and product category."
      }
    ]
  }
];

function Counter({ target, duration = 2500, animate = false }) {
  const [count, setCount] = useState(0);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (animate && !animatedRef.current) {
      animatedRef.current = true;
      const end = parseInt(target, 10);
      if (isNaN(end)) return;
      
      const startTime = performance.now();

      const runAnimate = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeProgress = progress * (2 - progress); // easeOutQuad
        
        const currentCount = Math.floor(easeProgress * end);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(runAnimate);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(runAnimate);
    }
  }, [animate, target, duration]);

  const suffix = target.replace(/[0-9]/g, '');

  return <span>{count}{suffix}</span>;
}

export default function Home() {
  const products = getProducts();
  const featured = products.slice(0, 4);

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [catOpen, setCatOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState('products');

  const categoryRef = useRef(null);
  const suggestionsRef = useRef(null);

  const categoriesList = [
    'All Categories',
    'Car AC Parts',
    'Truck AC Parts',
    'Bus AC Parts',
    'Payload Vehicle AC Parts',
    'Construction Vehicle AC Parts',
    'Bulldozer AC Parts'
  ];

  const popularSuggestions = [
    { name: 'AC Compressor Denso Universal', oem: '447260-3480', category: 'Car' },
    { name: 'Condenser Assembly Sanden', oem: 'SND-2918', category: 'Car' },
    { name: 'Bus Condenser Coil Heavy Duty', oem: 'BUS-CON-902', category: 'Bus' },
    { name: 'Truck AC Compressor Bitzer', oem: 'BTZ-TRK-750', category: 'Truck' },
    { name: 'Thermostatic Expansion Valve', oem: 'EXP-VAL-332', category: 'Car' },
    { name: 'AC Blower Motor Denso', oem: 'BLW-MTR-128', category: 'Car' },
    { name: 'Evaporator Cooling Coil Subros', oem: 'COIL-EV-901', category: 'Car' }
  ];

  const quickOems = [
    { code: '447260-3480', description: 'Denso 10S15C Compressor' },
    { code: 'SND-2918-09', description: 'Sanden TRSE09 Condenser' },
    { code: 'VAL-BLW-55', description: 'Valeo Double Blower Assembly' },
    { code: 'BTZ-4NCS-12', description: 'Bitzer Heavy Compressor' },
    { code: 'SUB-EV-29', description: 'Subros Cooling Evaporator' }
  ];

  const trendingChips = [
    'AC Compressor',
    'Condenser',
    'Blower Motor',
    'Cooling Coil',
    'Expansion Valve',
    'OEM 447260'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [animateStats, setAnimateStats] = useState(false);
  const statsSectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setAnimateStats(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const targetEl = statsSectionRef.current;
    if (targetEl) {
      observer.observe(targetEl);
    }

    return () => {
      if (targetEl) {
        observer.unobserve(targetEl);
      }
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const selectSuggestion = (name) => {
    setSearchQuery(name);
    setShowSuggestions(false);
  };

  const executeSearch = () => {
    if (!searchQuery.trim()) return;
    let url = `/products?search=${encodeURIComponent(searchQuery)}`;
    if (selectedCategory !== 'All Categories') {
      const catParam = selectedCategory.replace(' AC Parts', '');
      url += `&category=${encodeURIComponent(catParam)}`;
    }
    navigate(url);
  };

  const toggleVoiceSearch = () => {
    if (voiceListening) {
      setVoiceListening(false);
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        setVoiceListening(true);
      };
      
      recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        setSearchQuery(speechToText);
        setShowSuggestions(true);
        setVoiceListening(false);
      };
      
      recognition.onerror = () => {
        setVoiceListening(false);
      };
      
      recognition.onend = () => {
        setVoiceListening(false);
      };
      
      recognition.start();
    } else {
      setVoiceListening(true);
      setTimeout(() => {
        const mockSearches = ["AC Compressor Swift", "Condenser Hilux", "Blower Motor Tata", "Cooling Coil XUV500"];
        const randomSearch = mockSearches[Math.floor(Math.random() * mockSearches.length)];
        setSearchQuery(randomSearch);
        setShowSuggestions(true);
        setVoiceListening(false);
      }, 2000);
    }
  };

  const filteredSuggestions = popularSuggestions.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.oem.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'All Categories') {
      return matchesSearch;
    } else {
      const targetCat = selectedCategory.replace(' AC Parts', '');
      return matchesSearch && item.category === targetCat;
    }
  });

  const previewProducts = products.filter(p => {
    if (!searchQuery) return false;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'All Categories') {
      return matchesQuery;
    } else {
      const targetCat = selectedCategory.replace(' AC Parts', '');
      return matchesQuery && p.category === targetCat;
    }
  });

  const stats = [
    { value: '500+', label: 'Products Available' },
    { value: '50+', label: 'OEM & Aftermarket Brands' },
    { value: '1000+', label: 'Dealers & Workshops Served' },
    { value: '20+', label: 'Years in Automotive Cooling Solutions' },
  ];

  const features = [
    { icon: <Shield size={28} />, title: 'Genuine OEM & Aftermarket Parts', desc: 'Only original manufacturer and quality-tested replacement parts.' },
    { icon: <Package size={28} />, title: '500+ SKUs Ready to Dispatch', desc: 'A massive wholesale inventory of AC compressors, condensers, blowers, and valves.' },
    { icon: <Truck size={28} />, title: 'Same-Day Shipping', desc: 'Quick dispatch and fast transit across India to minimize vehicle downtime.' },
    { icon: <Headphones size={28} />, title: 'Technical Support', desc: 'Get expert guidance and parts compatibility identification via WhatsApp.' },
    { icon: <Tag size={28} />, title: 'Bulk Order Pricing', desc: 'Competitive wholesale rates and volume discounts tailored for workshops.' },
  ];

  const vehicleTypes = [
    { name: 'Car', emoji: '🚗', desc: 'Sedans, Hatchbacks, SUVs', count: products.filter(p => p.category === 'Car').length },
    { name: 'Truck', emoji: '🚛', desc: 'Light & Heavy Commercial', count: products.filter(p => p.category === 'Truck').length },
    { name: 'Bus', emoji: '🚌', desc: 'Mini Bus & Fleet Vehicles', count: products.filter(p => p.category === 'Bus').length },
    { name: 'Payload Vehicle', emoji: '🚚', desc: 'Payloaders & Heavy Haulers', count: products.filter(p => p.category === 'Payload Vehicle').length },
    { name: 'Construction Vehicle', emoji: '🏗️', desc: 'Excavators, Loaders, Cranes', count: products.filter(p => p.category === 'Construction Vehicle').length },
    { name: 'Bulldozer', emoji: '🚜', desc: 'Bulldozers & Earthmovers', count: products.filter(p => p.category === 'Bulldozer').length },
  ];

  return (
    <div className="home-page page-transition">
      {/* HERO SECTION */}
      <section className="hero" id="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="section-label">
              AC Spare Parts Available <span className="dot"></span>
            </div>
            <h1 className="hero-title">
              The part you need. <br />In stock. <span className="highlight">Today.</span>
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
          </div>
          <span>Scroll Down</span>
        </div>
      </section>

      {/* B2B SEARCH EXPERIENCE */}
      <section className="b2b-search-section">
        <div className="container">
          <div className="search-experience-wrapper reveal">
            <div className="search-card">
              <div className="search-header-row">
                <span className="search-pill">Intelligent B2B Search</span>
                <h3 className="search-card-title">Search our Wholesale Inventory</h3>
              </div>
              
              <div className="unified-search-bar">
                {/* CATEGORY SELECTOR */}
                <div className="category-select-wrapper" ref={categoryRef}>
                  <button className="category-dropdown-btn" onClick={() => setCatOpen(!catOpen)}>
                    <span>{selectedCategory}</span>
                    <ChevronDown size={14} />
                  </button>
                  {catOpen && (
                    <ul className="category-dropdown-menu">
                      {categoriesList.map(cat => (
                        <li key={cat} onClick={() => { setSelectedCategory(cat); setCatOpen(false); }}>
                          {cat}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* SEARCH INPUT */}
                <div className="search-input-inner-wrapper">
                  <input
                    type="text"
                    placeholder="Search AC compressors, condensers, blower motors, OEM parts..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={(e) => { if (e.key === 'Enter') executeSearch(); }}
                    className="main-search-input"
                  />
                  {searchQuery && (
                    <button className="clear-search-btn" onClick={clearSearch}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* VOICE SEARCH */}
                <button 
                  className={`voice-search-btn ${voiceListening ? 'listening' : ''}`}
                  onClick={toggleVoiceSearch}
                  title="Voice Search"
                >
                  {voiceListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                {/* SEARCH BUTTON */}
                <button className="search-execute-btn" onClick={executeSearch}>
                  <Search size={16} />
                  <span>Search</span>
                </button>
              </div>

              {/* AUTO-SUGGESTIONS DROPDOWN */}
              {showSuggestions && (
                <div className="search-suggestions-dropdown" ref={suggestionsRef}>
                  <div className="suggestions-grid">
                    <div className="suggestions-left">
                      <div className="suggestions-section-title">
                        <Sparkles size={12} />
                        <span>Intelligent Suggestions</span>
                      </div>
                      <ul className="suggestions-list">
                        {filteredSuggestions.length > 0 ? (
                          filteredSuggestions.map((item, index) => (
                            <li 
                              key={index}
                              onClick={() => selectSuggestion(item.name)}
                              className="suggestion-item"
                            >
                              <div className="suggestion-item-icon">
                                <Search size={12} />
                              </div>
                              <div className="suggestion-item-details">
                                <span className="suggestion-name">{item.name}</span>
                                <span className="suggestion-meta">OEM: {item.oem} • Category: {item.category}</span>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="no-suggestions-item">No matching spare parts found. Try "Compressor".</li>
                        )}
                      </ul>
                    </div>

                    <div className="suggestions-right">
                      <div className="suggestions-section-title">
                        <Clock size={12} />
                        <span>Quick Reference OEM Codes</span>
                      </div>
                      <ul className="quick-oem-list">
                        {quickOems.map((oem, index) => (
                          <li key={index} onClick={() => selectSuggestion(oem.code)} className="oem-item">
                            <span className="oem-code">{oem.code}</span>
                            <span className="oem-desc">{oem.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TRENDING CATEGORY CHIPS */}
              <div className="trending-chips-row">
                <span className="trending-label">Trending Searches:</span>
                <div className="chips-container">
                  {trendingChips.map(chip => (
                    <button 
                      key={chip} 
                      className="trending-chip"
                      onClick={() => selectSuggestion(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* REAL-TIME B2B SEARCH RESULTS PREVIEW */}
            {searchQuery && (
              <div className="search-preview-panel animate-fade-in-up">
                <div className="preview-header">
                  <h4>Live Inventory Preview ({previewProducts.length} matched)</h4>
                  <Link to={`/products?search=${searchQuery}`} className="view-full-catalog-link">
                    View Full Catalog <ArrowRight size={14} />
                  </Link>
                </div>
                {previewProducts.length > 0 ? (
                  <div className="preview-grid">
                    {previewProducts.slice(0, 3).map(p => (
                      <div key={p.id} className="preview-card">
                        <div className="preview-img-container">
                          <img src={p.image} alt={p.name} onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Part'; }} />
                        </div>
                        <div className="preview-details">
                          <span className="preview-category-tag">{p.category}</span>
                          <h5>{p.name}</h5>
                          <p className="preview-desc">{p.description.substring(0, 60)}...</p>
                          <div className="preview-footer">
                            <span className="preview-brand">{p.brand}</span>
                            <a 
                              href={`https://wa.me/919962173870?text=Hi, I would like to get a wholesale quote for ${p.name} (${p.brand})`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="preview-quote-btn"
                            >
                              Get Quote
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="preview-no-results">
                    <p>No immediate inventory matches for "<strong>{searchQuery}</strong>".</p>
                    <a 
                      href={`https://wa.me/919962173870?text=Hi, I am looking for parts matching: ${searchQuery}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-query-btn"
                    >
                      Inquire on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="stats-bar" id="stats-section" ref={statsSectionRef}>
        <div className="container stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className={`stat-item reveal delay-${i * 100}`}>
              <span className="stat-value"><Counter target={stat.value} animate={animateStats} /></span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* COMPATIBLE VEHICLE BRANDS MARQUEE */}
      <section className="home-brands-marquee-section" id="compatible-brands-section">
        <div className="container">
          <div className="section-label">Compatible Manufacturers <span className="dot"></span></div>
          <h2 className="section-title">
            Compatible with <span className="highlight">All Major Brands</span>
          </h2>
          <p className="section-subtitle-compact">
            We distribute high-performance AC spare parts compatible with 37+ global vehicle manufacturers.
          </p>
          
          <div className="brands-marquee-container">
            <div className="brands-marquee-track">
              {/* Duplicate the list to create a seamless infinite loop */}
              {[...marqueeBrands, ...marqueeBrands].map((brand, i) => (
                <div key={i} className="marquee-logo-card">
                  <img src={brand.logoUrl} alt={`${brand.name} logo`} className="marquee-logo-img" />
                  <span>{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="view-all-brands-wrapper">
            <Link to="/car-brands" className="view-all-brands-btn">
              Explore All 37 Compatible Brands <ArrowRight size={15} />
            </Link>
          </div>
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
            {vehicleTypes.map((type, i) => (
              <Link
                to={`/products?category=${type.name}`}
                key={type.name}
                className={`vehicle-card reveal delay-${(i % 3) * 100}`}
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
            {featured.map((product, i) => (
              <div key={product.id} className={`reveal delay-${(i % 4) * 100}`} style={{ display: 'flex', flexDirection: 'column' }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="features-section" id="features-section">
        <div className="container">
          <div className="section-label">Why Workshops Choose RCS <span className="dot"></span></div>
          <h2 className="section-title">
            Why Workshops <span className="highlight">Choose RCS</span>
          </h2>
          <div className="features-grid">
            {features.map((feat, i) => (
              <div key={i} className={`feature-card reveal delay-${i * 100}`}>
                <div className="feature-icon">{feat.icon}</div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section" id="faq-section">
        <div className="container">
          <div className="section-label" style={{ textAlign: 'center', margin: '0 auto 12px', display: 'block', width: 'fit-content' }}>Common Queries <span className="dot"></span></div>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '16px' }}>
            Frequently Asked <span className="highlight">Questions</span>
          </h2>
          <p className="section-subtitle-compact" style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
            Find answers to common questions about parts compatibility, shipping, wholesale accounts, and order support.
          </p>

          {/* FAQ Category Tabs */}
          <div className="faq-categories-tabs">
            {faqCategories.map(cat => (
              <button
                key={cat.id}
                className={`faq-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveFaq(null); // Reset active accordion item
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="faq-accordion">
            {faqCategories.find(cat => cat.id === activeCategory).items.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className={`faq-item ${isOpen ? 'open' : ''}`}
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                >
                  <div className="faq-question">
                    <h3>{faq.q}</h3>
                    <span className="faq-toggle-icon"></span>
                  </div>
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-section" id="cta-section">
        <div className="container">
          <div className="cta-card reveal scale-up">
            <h2>Ready to <span className="highlight">Order?</span></h2>
            <p>Browse our complete catalog or reach out via WhatsApp for instant quotes and availability.</p>
            <div className="cta-buttons">
              <Link to="/products" className="cta-btn primary">
                Browse Products <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/919962173870"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn whatsapp"
              >
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}>
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
