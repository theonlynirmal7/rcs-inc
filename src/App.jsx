import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Brands from './pages/Brands';
import CarBrands from './pages/CarBrands';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import Education from './pages/Education';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function ScrollRevealManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => observer.observe(el));

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

import { dbService } from './supabase';

export default function App() {
  useEffect(() => {
    // Record visit once per session
    if (!sessionStorage.getItem('rcs_session_recorded')) {
      dbService.recordVisit(window.location.pathname)
        .then(() => {
          sessionStorage.setItem('rcs_session_recorded', 'true');
        })
        .catch(console.error);
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <ScrollRevealManager />
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/car-brands" element={<CarBrands />} />
            <Route path="/education" element={<Education />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
