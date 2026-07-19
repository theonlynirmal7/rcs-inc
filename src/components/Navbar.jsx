import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import rcsLogo from '../assets/rcs-logo.png';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const location = useLocation();
  const linkRefs = useRef({});
  const [hoveredPath, setHoveredPath] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ transform: 'translateX(0px)', width: '0px', opacity: 0 });
  const { cartCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileDropdownOpen(false);
  }, [location]);

  const updateIndicator = useCallback(() => {
    let targetPath = hoveredPath || location.pathname;

    if (!hoveredPath) {
      if (location.pathname === '/car-brands' || (location.pathname === '/products' && location.search.includes('category'))) {
        targetPath = '/vehicles-serve';
      }
    }

    const targetEl = linkRefs.current[targetPath];
    if (targetEl && window.innerWidth > 1024) {
      setIndicatorStyle({
        transform: `translateX(${targetEl.offsetLeft}px)`,
        width: `${targetEl.offsetWidth}px`,
        opacity: 1,
      });
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [hoveredPath, location.pathname, location.search]);

  // Immediate update on hover change
  useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  // Delayed update on route changes or window resizing to allow layout to settle
  useEffect(() => {
    const timer = setTimeout(updateIndicator, 30);
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [location.pathname, updateIndicator]);

  const leftLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/brands', label: 'Brands' },
  ];

  const rightLinks = [
    { to: '/education', label: 'AC Systems Guide' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="main-navbar">
      <div className="navbar-inner container">
        {/* LOGO */}
        <Link 
          to="/" 
          className="nav-logo" 
          id="nav-logo"
          onClick={() => {
            setMobileOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="logo-wrapper">
            <img src={rcsLogo} alt="RCS Logo" className="logo-img" />
          </div>
        </Link>

        {/* CENTER NAV */}
        <nav
          className={`nav-links ${mobileOpen ? 'open' : ''}`}
          id="nav-links"
          onMouseLeave={() => setHoveredPath(null)}
        >
          {leftLinks.map(link => {
            const isLinkActive = 
              link.to === '/products'
                ? location.pathname === '/products' && !location.search.includes('category')
                : location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                ref={el => { linkRefs.current[link.to] = el; }}
                className={`nav-link ${isLinkActive ? 'active' : ''}`}
                id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                onMouseEnter={() => setHoveredPath(link.to)}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          {/* DROPDOWN */}
          <div
            ref={el => { linkRefs.current['/vehicles-serve'] = el; }}
            className="nav-dropdown"
            onMouseEnter={() => {
              if (window.innerWidth > 1024) {
                setHoveredPath('/vehicles-serve');
              }
            }}
            onMouseLeave={() => {
              if (window.innerWidth > 1024) {
                setHoveredPath(null);
              }
            }}
          >
            <button
              className={`nav-link nav-dropdown-toggle ${
                location.pathname === '/car-brands' ||
                (location.pathname === '/products' && location.search.includes('category'))
                  ? 'active' : ''
              }`}
              id="nav-vehicles-dropdown"
              onClick={() => {
                setMobileDropdownOpen(!mobileDropdownOpen);
              }}
            >
              Vehicles We Serve <span className="chevron-arrow">▼</span>
            </button>
            <div className={`nav-dropdown-menu ${mobileDropdownOpen ? 'mobile-show' : ''}`}>
              <Link
                to="/car-brands?category=Car"
                className="dropdown-item"
                onClick={() => {
                  setMobileOpen(false);
                  setMobileDropdownOpen(false);
                }}
              >
                <span>🚗 Passenger Cars</span>
                <span className="dropdown-arrow-indicator">&gt;</span>
              </Link>
              <Link
                to="/car-brands?category=Truck"
                className="dropdown-item"
                onClick={() => {
                  setMobileOpen(false);
                  setMobileDropdownOpen(false);
                }}
              >
                <span>🚚 Trucks</span>
                <span className="dropdown-arrow-indicator">&gt;</span>
              </Link>
              <Link
                to="/car-brands?category=Bus"
                className="dropdown-item"
                onClick={() => {
                  setMobileOpen(false);
                  setMobileDropdownOpen(false);
                }}
              >
                <span>🚌 Buses</span>
                <span className="dropdown-arrow-indicator">&gt;</span>
              </Link>
              <Link
                to="/car-brands?category=Payload Vehicle"
                className="dropdown-item"
                onClick={() => {
                  setMobileOpen(false);
                  setMobileDropdownOpen(false);
                }}
              >
                <span>🚛 Commercial Vehicles</span>
                <span className="dropdown-arrow-indicator">&gt;</span>
              </Link>
              <Link
                to="/car-brands?category=Construction Vehicle"
                className="dropdown-item"
                onClick={() => {
                  setMobileOpen(false);
                  setMobileDropdownOpen(false);
                }}
              >
                <span>🚜 Construction Equipment</span>
                <span className="dropdown-arrow-indicator">&gt;</span>
              </Link>
            </div>
          </div>

          {rightLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              ref={el => { linkRefs.current[link.to] = el; }}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              onMouseEnter={() => setHoveredPath(link.to)}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="nav-indicator" style={indicatorStyle} />
          <a
            href="https://wa.me/919962173870"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-whatsapp-mobile"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>
            WhatsApp
          </a>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="nav-actions">
          <Link to="/cart" className="nav-cart" id="nav-cart" aria-label="View Enquiry Basket">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <a
            href="https://wa.me/919962173870"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-whatsapp premium-liquid-btn"
            id="nav-whatsapp"
          >
            <span className="btn-content">
              <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
              </svg>
              <span>WhatsApp</span>
            </span>
            <div className="liquid-bg">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <path className="blob-1" d="M 0 0 C 35 15, 65 15, 80 80 C 80 120, 0 120, 0 120 Z" />
                <path className="blob-2" d="M 100 100 C 65 85, 35 85, 20 20 C 20 -20, 100 -20, 100 -20 Z" />
              </svg>
            </div>
          </a>

          <button
            className="nav-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="nav-toggle"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}
    </header>
  );
}
