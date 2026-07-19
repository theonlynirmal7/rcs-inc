import { Shield, Users, Award, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import useSEO from '../hooks/useSEO';
import './About.css';

export default function About() {
  useSEO('About Us - Rameswar Cool Spares', 'Learn about RCS, India’s leading distributor of premium automotive AC components with over 20 years of experience serving workshops, fleet operators, and dealers.');

  const slides = [
    '/warehouse-slide-1.png',
    '/warehouse-slide-2.png',
    '/warehouse-slide-3.png',
    '/warehouse-slide-4.png',
    '/warehouse-slide-5.png'
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const values = [
    { icon: <Shield size={28} />, title: 'Quality Assurance', desc: 'Every part undergoes rigorous testing before reaching you. Only genuine and OEM-grade components.' },
    { icon: <Users size={28} />, title: 'Customer First', desc: 'We build lasting relationships with distributors, mechanics, and fleet operators across India.' },
    { icon: <Award size={28} />, title: 'Industry Expertise', desc: 'Over two decades of experience in vehicle AC spare parts distribution and technical support.' },
    { icon: <Clock size={28} />, title: 'Fast Turnaround', desc: 'Quick order processing and reliable delivery through our established logistics network.' },
  ];

  return (
    <div className="about-page page-transition">
      <section className="about-hero">
        <div className="container">
          <div className="section-label">About RCS • Since 2003 <span className="dot"></span></div>
          <h1 className="section-title">
            Trusted by India's <span className="highlight">Premier Garages</span> and Car Owners
          </h1>
          <p className="about-hero-desc">
            RCS is a leading distributor of AC spare parts for all types of vehicles — from personal cars to 
            heavy commercial fleets. We connect top manufacturers with mechanics, workshops, and fleet operators 
            across the country.
          </p>
        </div>
      </section>

      <section className="about-story">
        <div className="container about-story-grid">
          <div className="story-carousel-container">
            <div className="story-carousel-wrapper">
              <div 
                className="story-carousel-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((src, index) => (
                  <div key={index} className="story-carousel-slide">
                    <img 
                      src={src} 
                      alt={`RCS Warehouse Storage - View ${index + 1}`} 
                      className="carousel-image"
                    />
                  </div>
                ))}
              </div>
              
              <button className="carousel-btn prev-btn" onClick={handlePrev} aria-label="Previous slide">
                <ChevronLeft size={20} />
              </button>
              <button className="carousel-btn next-btn" onClick={handleNext} aria-label="Next slide">
                <ChevronRight size={20} />
              </button>

              <div className="carousel-dots">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              Founded with a simple mission — to make quality AC spare parts accessible and affordable for every 
              vehicle on the road. Over the years, RCS has grown into a trusted name in the automotive cooling 
              industry, serving thousands of customers nationwide.
            </p>
            <p>
              We stock parts from leading global manufacturers including Denso, Sanden, Valeo, Behr, and Danfoss. 
              Whether you need a compressor for a sedan, a condenser for a truck, or a complete AC kit for a 
              fleet of buses — RCS has you covered.
            </p>
          </div>
        </div>

        <div className="container" style={{ marginTop: '50px' }}>
          <div className="story-stats-row">
            <div className="story-stat">
              <span className="stat-num">Since 2003</span>
              <span>Trusted Automotive Cooling Solutions</span>
            </div>
            <div className="story-stat">
              <span className="stat-num">1000+</span>
              <span>Products Available</span>
            </div>
            <div className="story-stat">
              <span className="stat-num">1000+</span>
              <span>Dealers & Workshops Served</span>
            </div>
            <div className="story-stat">
              <span className="stat-num">50+</span>
              <span>OEM & Aftermarket Brands</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <h2 className="section-title">Our <span className="highlight">Values</span></h2>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
