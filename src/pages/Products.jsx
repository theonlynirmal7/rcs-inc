import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { getProducts, categories, brands } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Products.css';

export default function Products() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const filtered = products
    .filter(p => category === 'All' || p.category === category)
    .filter(p => brand === 'All' || p.brand === brand)
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="products-page">
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
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search parts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                id="search-input"
              />
            </div>

            <div className="toolbar-actions">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="sort-select"
                id="sort-select"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>

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
