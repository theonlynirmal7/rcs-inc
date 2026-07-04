import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { brands } from '../data/products';
import { useCart } from '../context/CartContext';
import './ProductDetailsModal.css';

export default function ProductDetailsModal({ product, onClose }) {
  const [selectedBrand, setSelectedBrand] = useState(product.brand);
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  // Sync brand selection with what's in the cart if the item exists
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

  // Prevent scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="pd-modal-overlay" onClick={onClose} id="product-details-modal">
      <div className="pd-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* CLOSE BUTTON */}
        <button className="pd-modal-close" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>

        <div className="pd-modal-grid">
          {/* PRODUCT INFO */}
          <div className="pd-product-info">
            <span className="pd-badge">{product.category}</span>
            <h2 className="pd-title">{product.name}</h2>
            <span className="pd-brand-label">Brand: {selectedBrand}</span>

            <div className="pd-image-wrapper">
              <img
                src={product.image}
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80';
                }}
              />
            </div>

            <div className="pd-pricing-section">
              <span className="pd-stock-tag">
                <span className="stock-dot"></span> In Stock (Ready to Dispatch)
              </span>
            </div>

            <p className="pd-description">{product.description}</p>

            {/* Brand Select */}
            <div className="pd-brand-selector-wrapper">
              <label htmlFor="pd-brand-select">Choose Brand:</label>
              <div className="brand-select-wrapper">
                <select
                  id="pd-brand-select"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="pd-brand-select"
                >
                  {brands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pd-actions-row">
              {cartItem && !showAddedFeedback ? (
                <div className="pd-qty-selector blinkit">
                  <button className="pd-qty-btn" onClick={handleDecrement}>—</button>
                  <span className="pd-qty-value">{cartItem.quantity}</span>
                  <button className="pd-qty-btn" onClick={handleIncrement}>+</button>
                </div>
              ) : (
                <button
                  className={`pd-add-btn ${showAddedFeedback ? 'success' : ''}`}
                  onClick={handleInitialAdd}
                  disabled={showAddedFeedback}
                >
                  {showAddedFeedback ? 'Added ✓' : 'Add to Basket'}
                </button>
              )}

              <a
                href={`https://wa.me/919962173870?text=${encodeURIComponent(
                  `Hello! I'm interested in enquiring about the following product:\n\n*Product:* ${product.name}\n*Brand:* ${selectedBrand}\n*Category:* ${product.category}\n*Quantity:* ${cartItem ? cartItem.quantity : 1}\n\nPlease share pricing and availability.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-whatsapp-btn"
              >
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                WhatsApp Enquiry
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
