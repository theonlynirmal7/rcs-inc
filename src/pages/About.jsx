import { Shield, Users, Award, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import useSEO from '../hooks/useSEO';
import './About.css';

function CardSlider({ srcList, interval = 5000, altText, direction = 'right' }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % srcList.length);
    }, interval);
    return () => clearInterval(timer);
  }, [srcList, interval]);

  const translation = direction === 'left' ? currentIndex * 100 : -currentIndex * 100;

  return (
    <div className="card-slider-container">
      <div 
        className={`card-slider-track slide-${direction}`}
        style={{ transform: `translateX(${translation}%)` }}
      >
        {srcList.map((src, index) => (
          <div key={index} className="card-slider-slide">
            <img 
              src={src} 
              alt={`${altText} - View ${index + 1}`} 
              className="card-slider-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

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

  return <>{count}{suffix}</>;
}

export default function About() {
  useSEO('About Us - Rameswar Cool Spares', 'Learn about RCS, India’s leading distributor of premium automotive AC components with over 20 years of experience serving workshops, fleet operators, and dealers.');

  const [animateStats, setAnimateStats] = useState(false);
  const statsSectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setAnimateStats(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.1
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
          <div className="story-images-layout">
            <div className="layout-image-container top-right">
              <div className="layout-backdrop"></div>
              <CardSlider 
                srcList={[
                  '/radiator-racks.png',
                  '/warehouse-slide-1.png',
                  '/warehouse-slide-3.png',
                  '/warehouse-slide-5.png'
                ]}
                interval={5000}
                direction="right"
                altText="RCS Radiator and Condenser Inventory"
              />
            </div>
            <div className="layout-image-container bottom-left">
              <div className="layout-backdrop"></div>
              <CardSlider 
                srcList={[
                  '/warehouse-inventory.png',
                  '/warehouse-slide-2.png',
                  '/warehouse-slide-4.png'
                ]}
                interval={5000}
                direction="left"
                altText="RCS Warehouse Inventory Stacks"
              />
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

        <div className="container" style={{ marginTop: '50px' }} ref={statsSectionRef}>
          <div className="story-stats-row">
            <div className="story-stat">
              <span className="stat-num">
                Since <Counter target="2003" animate={animateStats} />
              </span>
              <span>Trusted Automotive Cooling Solutions</span>
            </div>
            <div className="story-stat">
              <span className="stat-num">
                <Counter target="1000+" animate={animateStats} />
              </span>
              <span>Products Available</span>
            </div>
            <div className="story-stat">
              <span className="stat-num">
                <Counter target="1000+" animate={animateStats} />
              </span>
              <span>Dealers & Workshops Served</span>
            </div>
            <div className="story-stat">
              <span className="stat-num">
                <Counter target="50+" animate={animateStats} />
              </span>
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
