import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, openWhatsApp } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container cart-empty">
          <ShoppingBag size={64} className="empty-icon" />
          <h2>Your Cart is Empty</h2>
          <p>Browse our AC spare parts and add items to your cart.</p>
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
            <h1>Shopping Cart</h1>
            <p>{cartCount} item{cartCount > 1 ? 's' : ''} in your cart</p>
          </div>
          <button className="clear-cart-btn" onClick={clearCart} id="clear-cart">
            <Trash2 size={16} /> Clear Cart
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
                <div className="cart-item-price">
                  <span className="item-total">₹{(item.price * item.quantity).toLocaleString()}</span>
                  <span className="item-unit">₹{item.price.toLocaleString()} each</span>
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
            <h3>Order Summary</h3>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span className="free-tag">Calculated later</span>
              </div>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => openWhatsApp()}
              id="checkout-whatsapp"
            >
              <MessageCircle size={20} />
              Order via WhatsApp
            </button>

            <p className="checkout-note">
              Your cart details will be sent to our WhatsApp for order confirmation and delivery arrangement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
