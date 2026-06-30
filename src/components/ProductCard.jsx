import { useState } from 'react';
import { brands } from '../data/products';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const [selectedBrand, setSelectedBrand] = useState(product.brand);
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  const cartItem = cart.find(item => item.id === product.id);

  const handleInitialAdd = () => {
    addToCart({ ...product, brand: selectedBrand }, 1);
    setShowAddedFeedback(true);
    setTimeout(() => {
      setShowAddedFeedback(false);
    }, 1000);
  };

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      if (cartItem.quantity <= 1) {
        removeFromCart(product.id);
      } else {
        updateQuantity(product.id, cartItem.quantity - 1);
      }
    }
  };

  return (
    <div className="product-card" id={`product-${product.id}`}>
      <div className="product-card-img">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80';
          }}
        />
        <span className={`product-badge ${product.category.toLowerCase().replace(/\s+/g, '-')}`}>
          {product.category}
        </span>
      </div>
      <div className="product-card-body">
        <span className="product-brand">{product.brand}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        
        {/* Brand Selector Dropdown */}
        <div className="product-brand-selector">
          <label htmlFor={`brand-select-${product.id}`} className="brand-select-label">Brand</label>
          <div className="brand-select-wrapper">
            <select
              id={`brand-select-${product.id}`}
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="brand-select-dropdown"
            >
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="product-card-footer">
          {cartItem && !showAddedFeedback ? (
            <div className="product-qty-selector blinkit animate-fade-in">
              <button className="qty-btn" onClick={handleDecrement} type="button">—</button>
              <span className="qty-value">{cartItem.quantity}</span>
              <button className="qty-btn" onClick={handleIncrement} type="button">+</button>
            </div>
          ) : (
            <button
              className={`blinkit-add-btn ${showAddedFeedback ? 'added-success' : ''}`}
              onClick={handleInitialAdd}
              id={`add-to-cart-${product.id}`}
              disabled={showAddedFeedback}
              type="button"
            >
              <span>{showAddedFeedback ? 'Added ✓' : 'Add to Basket'}</span>
              <span className="plus-icon">{showAddedFeedback ? '✓' : '+'}</span>
            </button>
          )}

          <a
            href={`https://wa.me/919962173870?text=${encodeURIComponent(
              `Hello! I'm interested in enquiring about the following product:\n\n*Product:* ${product.name}\n*Brand:* ${selectedBrand}\n*Category:* ${product.category}\n*Quantity:* ${cartItem ? cartItem.quantity : 1}\n\nPlease share pricing and availability.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-order-btn"
            id={`order-wa-${product.id}`}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>
            Enquire via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
