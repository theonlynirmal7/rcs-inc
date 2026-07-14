import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Car, X } from 'lucide-react';
import { getProducts, categories, brands } from '../data/products';
import ProductCard from '../components/ProductCard';
import useSEO from '../hooks/useSEO';
import './Products.css';

export default function Products() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState('All');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useSEO(
    category !== 'All' ? `${category} AC Parts` : 'AC Spare Parts Catalog',
    `Browse our complete range of genuine ${category !== 'All' ? category : ''} automotive AC spare parts, compressors, condensers, and cooling coils.`
  );

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);

    const srch = searchParams.get('search');
    if (srch) setSearch(srch);
  }, [searchParams]);

  const filtered = products
    .filter(p => category === 'All' || p.category === category)
    .filter(p => brand === 'All' || p.brand === brand)
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.compatible_vehicles && p.compatible_vehicles.toLowerCase().includes(search.toLowerCase())) ||
      (p.vehicle_type && p.vehicle_type.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="products-page page-transition">
      <section className="products-hero">
        <div className="container">
          <div className="section-label">Our Catalog <span className="dot"></span></div>
          <h1 className="section-title">
            AC Spare <span className="highlight">Parts</span>
          </h1>
          <p className="products-hero-desc">
            Browse our complete range of genuine AC spare parts for cars, trucks, and buses.
          </p>
        </div>
      </section>

      <section className="products-content">
        <div className="container">
          {/* TOOLBAR */}
          <div className="products-toolbar" id="products-toolbar">
            <div className="custom-search-container">
              <div className="search-ac-badge">
                <Car size={16} strokeWidth={1.8} />
                <span>Search AC Parts</span>
              </div>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search By : Part Number, Category, Name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  id="search-input"
                />
                {search ? (
                  <button
                    className="search-clear-btn"
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                  >
                    <X size={16} strokeWidth={1.8} />
                  </button>
                ) : (
                  <Search size={16} strokeWidth={1.8} className="search-input-icon" />
                )}
              </div>
            </div>

            <div className="toolbar-actions">
              <button
                className="filter-toggle"
                onClick={() => setFiltersOpen(!filtersOpen)}
                id="filter-toggle"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>
          </div>

          {/* FILTERS */}
          <div className={`filters-bar ${filtersOpen ? 'open' : ''}`} id="filters-bar">
            <div className="filter-group">
              <label>Category</label>
              <div className="filter-chips">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`chip ${category === cat ? 'active' : ''}`}
                    onClick={() => setCategory(cat)}
                    id={`filter-cat-${cat.toLowerCase()}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Brand</label>
              <div className="filter-chips">
                <button
                  className={`chip ${brand === 'All' ? 'active' : ''}`}
                  onClick={() => setBrand('All')}
                >
                  All
                </button>
                {brands.map(b => (
                  <button
                    key={b}
                    className={`chip ${brand === b ? 'active' : ''}`}
                    onClick={() => setBrand(b)}
                    id={`filter-brand-${b.toLowerCase()}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RESULTS */}
          <p className="results-count">
            Showing <strong>{filtered.length}</strong> of {products.length} products
          </p>

          {filtered.length > 0 ? (
            <div className="products-grid" id="products-grid">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No products found matching your criteria.</p>
              <button onClick={() => { setSearch(''); setCategory('All'); setBrand('All'); }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
