import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    addToast(`${product.name} added to cart!`);
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
        <span className={`product-badge ${product.category.toLowerCase()}`}>
          {product.category}
        </span>
      </div>
      <div className="product-card-body">
        <span className="product-brand">{product.brand}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-card-footer">
          <span className="product-price">₹{product.price.toLocaleString()}</span>
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            id={`add-cart-${product.id}`}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
