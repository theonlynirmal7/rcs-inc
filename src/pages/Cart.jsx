import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, openWhatsApp } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container cart-empty">
          <ShoppingBag size={64} className="empty-icon" />
          <h2>Your Enquiry Basket is Empty</h2>
          <p>Browse our AC spare parts and add items to your basket.</p>
          <Link to="/products" className="empty-cta">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <div>
            <Link to="/products" className="back-link">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
            <h1>Enquiry Basket</h1>
            <p>{cartCount} item{cartCount > 1 ? 's' : ''} in your basket</p>
          </div>
          <button className="clear-cart-btn" onClick={clearCart} id="clear-cart">
            <Trash2 size={16} /> Clear Basket
          </button>
        </div>

        <div className="cart-layout">
          <div className="cart-items" id="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item" id={`cart-item-${item.id}`}>
                <div className="cart-item-img">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80';
                    }}
                  />
                </div>
                <div className="cart-item-info">
                  <span className="cart-item-brand">{item.brand}</span>
                  <h3>{item.name}</h3>
                  <span className="cart-item-category">{item.category}</span>
                </div>
                <div className="cart-item-qty">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  className="cart-remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary" id="cart-summary">
            <h3>Enquiry Summary</h3>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Total Items</span>
                <span>{cartCount} item{cartCount > 1 ? 's' : ''}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span className="free-tag">Calculated later</span>
              </div>
            </div>

            <button
              className="checkout-btn premium-liquid-btn btn-whatsapp"
              onClick={() => openWhatsApp()}
              id="checkout-whatsapp"
            >
              <span className="btn-content">
                <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                Send Enquiry via WhatsApp
              </span>
              <div className="liquid-bg">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path className="blob-1" d="M 0 0 C 35 15, 65 15, 80 80 C 80 120, 0 120, 0 120 Z" />
                  <path className="blob-2" d="M 100 100 C 65 85, 35 85, 20 20 C 20 -20, 100 -20, 100 -20 Z" />
                </svg>
              </div>
            </button>

            <p className="checkout-note">
              Your basket details will be sent to our WhatsApp for enquiry confirmation and delivery arrangement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
