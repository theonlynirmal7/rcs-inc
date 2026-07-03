import { useState, useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { brands } from '../data/products';
import { useCart } from '../context/CartContext';
import './ProductDetailsModal.css';

export default function ProductDetailsModal({ product, onClose }) {
  const [selectedBrand, setSelectedBrand] = useState(product.brand);
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);
  const [hoveredPart, setHoveredPart] = useState(null);

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

  // Determine active component in the AC diagram based on product name/category
  const nameLower = product.name.toLowerCase();
  const descLower = product.description.toLowerCase();
  const categoryLower = product.category.toLowerCase();

  let activePart = '';
  if (nameLower.includes('compressor') || nameLower.includes('clutch')) {
    activePart = 'compressor';
  } else if (nameLower.includes('condenser') || nameLower.includes('cowling') || nameLower.includes('shroud')) {
    activePart = 'condenser';
  } else if (nameLower.includes('drier') || nameLower.includes('receiver') || nameLower.includes('accumulator')) {
    activePart = 'drier';
  } else if (nameLower.includes('valve') || nameLower.includes('expansion')) {
    activePart = 'valve';
  } else if (nameLower.includes('evaporator') || nameLower.includes('cooling coil') || nameLower.includes('heater core') || nameLower.includes('heat exchange')) {
    activePart = 'evaporator';
  } else if (nameLower.includes('filter') || nameLower.includes('cabin')) {
    activePart = 'filter';
  } else if (nameLower.includes('blower') || nameLower.includes('resistor') || nameLower.includes('vent') || nameLower.includes('duct')) {
    activePart = 'blower';
  } else if (nameLower.includes('hose') || nameLower.includes('discharge') || nameLower.includes('suction') || nameLower.includes('belt') || nameLower.includes('pipe')) {
    activePart = 'hoses';
  }

  // Get info tooltip content based on the active or hovered part
  const getPartDescription = (part) => {
    switch (part) {
      case 'compressor':
        return {
          title: 'AC Compressor',
          desc: 'The heart of the AC system. Pumps and compresses low-pressure refrigerant gas into high-pressure, hot gas, circulating it through the loop.',
          position: 'Mounted on the engine, driven by the drive belt.'
        };
      case 'condenser':
        return {
          title: 'AC Condenser',
          desc: 'Acts as a radiator for the AC. Cools down hot refrigerant gas from the compressor, condensing it into a high-pressure liquid state.',
          position: 'Fitted at the front of the vehicle, right next to the engine radiator.'
        };
      case 'drier':
        return {
          title: 'Receiver Drier / Accumulator',
          desc: 'Removes moisture and contaminants from the flowing liquid refrigerant. Serves as a temporary reservoir to protect the compressor.',
          position: 'Located on the high-pressure line between the condenser and expansion valve.'
        };
      case 'valve':
        return {
          title: 'Expansion Valve',
          desc: 'Lowers the pressure of liquid refrigerant, causing it to flash-cool. Regulates the precise rate of cold refrigerant entering the cooling coil.',
          position: 'Positioned at the firewall, right before the evaporator intake.'
        };
      case 'evaporator':
        return {
          title: 'Evaporator / Cooling Coil',
          desc: 'Absorbs heat from the cabin. Liquid refrigerant expands and freezes the coil surfaces, cooling down air blown across it into the cabin.',
          position: 'Installed inside the dashboard HVAC blower housing assembly.'
        };
      case 'filter':
        return {
          title: 'Cabin Air Filter',
          desc: 'Filters out dust, pollen, exhaust fumes, and allergens from incoming external or recirculated air before it reaches passengers.',
          position: 'Mounted inside the glovebox slot directly above the blower motor.'
        };
      case 'blower':
        return {
          title: 'Blower Motor / Fan',
          desc: 'Propels air through the cabin filter and across the cold evaporator coil surfaces to project cooled air out through dashboard vents.',
          position: 'Fitted in the main climate control casing under the passenger dashboard.'
        };
      case 'hoses':
        return {
          title: 'AC Hoses & Connectors',
          desc: 'Reinforced suction and discharge lines that transport refrigerant between components under extreme pressures and vibration.',
          position: 'Interconnected plumbing extending throughout the entire engine bay.'
        };
      default:
        return {
          title: 'AC System Component',
          desc: 'This part integrates into the primary vehicle thermal management loop to maintain climate control stability and flow.',
          position: 'Standard fitment in the vehicle engine bay or dashboard HVAC core.'
        };
    }
  };

  const displayedPart = hoveredPart || activePart;
  const partInfo = getPartDescription(displayedPart);

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
          {/* LEFT COLUMN: PRODUCT INFO */}
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

          {/* RIGHT COLUMN: INTERACTIVE DIAGRAM */}
          <div className="pd-diagram-section">
            <h3 className="pd-diagram-title">System Locator Diagram</h3>
            <p className="pd-diagram-desc">Hover over components to explore their roles in the refrigeration loop.</p>

            <div className="pd-diagram-wrapper">
              <svg viewBox="0 0 400 300" className="ac-loop-svg">
                {/* SVG Definitions for Gradients */}
                <defs>
                  <linearGradient id="red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#B91C1C" />
                  </linearGradient>
                  <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#60A5FA" />
                  </marker>
                </defs>

                {/* HOSES & REFRIGERANT PLUMBING PIPES */}
                <g 
                  id="diag-hoses" 
                  className={`diag-group ${activePart === 'hoses' ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredPart('hoses')}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  {/* High pressure hot line: Compressor to Condenser */}
                  <path d="M 130 220 L 130 200 L 40 200 L 40 170" fill="none" stroke="url(#red-grad)" strokeWidth="4" />
                  {/* High pressure warm line: Condenser to Receiver Drier */}
                  <path d="M 60 145 L 85 145 L 100 145 L 100 150" fill="none" stroke="url(#red-grad)" strokeWidth="4" />
                  {/* Liquid line: Receiver Drier to Expansion Valve */}
                  <path d="M 100 140 L 100 95 L 180 95" fill="none" stroke="url(#red-grad)" strokeWidth="4" />
                  {/* Cold low-pressure line: Expansion Valve to Evaporator */}
                  <path d="M 204 95 L 250 95" fill="none" stroke="url(#blue-grad)" strokeWidth="4" />
                  {/* Low pressure gas return line: Evaporator to Compressor */}
                  <path d="M 277 165 L 277 240 L 160 240" fill="none" stroke="url(#blue-grad)" strokeWidth="5" />
                </g>

                {/* CONDENSER ASSEMBLY */}
                <g 
                  id="diag-condenser" 
                  className={`diag-group ${activePart === 'condenser' ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredPart('condenser')}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  <rect x="20" y="60" width="40" height="110" rx="3" fill="#1F2937" stroke="#374151" strokeWidth="2.5" />
                  {/* Fin lines */}
                  <line x1="20" y1="75" x2="60" y2="75" stroke="#4B5563" strokeWidth="1.5" />
                  <line x1="20" y1="90" x2="60" y2="90" stroke="#4B5563" strokeWidth="1.5" />
                  <line x1="20" y1="105" x2="60" y2="105" stroke="#4B5563" strokeWidth="1.5" />
                  <line x1="20" y1="120" x2="60" y2="120" stroke="#4B5563" strokeWidth="1.5" />
                  <line x1="20" y1="135" x2="60" y2="135" stroke="#4B5563" strokeWidth="1.5" />
                  <line x1="20" y1="150" x2="60" y2="150" stroke="#4B5563" strokeWidth="1.5" />
                  {/* Condenser Fan */}
                  <circle cx="40" cy="115" r="22" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="5,5" className="spinning-fan" />
                  <circle cx="40" cy="115" r="4" fill="#E5E7EB" />
                  <text x="40" y="50" fontSize="8.5" fill="#9CA3AF" fontWeight="700" textAnchor="middle">CONDENSER</text>
                </g>

                {/* COMPRESSOR */}
                <g 
                  id="diag-compressor" 
                  className={`diag-group ${activePart === 'compressor' ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredPart('compressor')}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  {/* Pump cylinder */}
                  <rect x="110" y="210" width="55" height="40" rx="5" fill="#374151" stroke="#1F2937" strokeWidth="2.5" />
                  {/* Clutch Pulley */}
                  <circle cx="110" cy="230" r="14" fill="#111827" stroke="#4B5563" strokeWidth="2" />
                  <circle cx="110" cy="230" r="8" fill="#9CA3AF" />
                  {/* Label */}
                  <text x="137" y="234" fontSize="8" fill="#F9FAFB" fontWeight="800" textAnchor="middle">PUMP</text>
                  <text x="137" y="262" fontSize="9.5" fill="#9CA3AF" fontWeight="700" textAnchor="middle">COMPRESSOR</text>
                </g>

                {/* RECEIVER DRIER */}
                <g 
                  id="diag-drier" 
                  className={`diag-group ${activePart === 'drier' ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredPart('drier')}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  <rect x="90" y="130" width="20" height="45" rx="8" fill="#4B5563" stroke="#1F2937" strokeWidth="2" />
                  <rect x="96" y="127" width="8" height="3" fill="#9CA3AF" />
                  <text x="100" y="156" fontSize="7.5" fill="#FFFFFF" fontWeight="700" textAnchor="middle">DRY</text>
                  <text x="100" y="188" fontSize="8.5" fill="#9CA3AF" fontWeight="700" textAnchor="middle">DRIER</text>
                </g>

                {/* EXPANSION VALVE */}
                <g 
                  id="diag-valve" 
                  className={`diag-group ${activePart === 'valve' ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredPart('valve')}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  <rect x="180" y="85" width="24" height="24" rx="4" fill="#9CA3AF" stroke="#374151" strokeWidth="2" />
                  <path d="M 183 88 L 201 106 M 201 88 L 183 106" stroke="#1F2937" strokeWidth="2" />
                  <text x="192" y="76" fontSize="8.5" fill="#9CA3AF" fontWeight="700" textAnchor="middle">EXP. VALVE</text>
                </g>

                {/* EVAPORATOR (COOLING COIL) */}
                <g 
                  id="diag-evaporator" 
                  className={`diag-group ${activePart === 'evaporator' ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredPart('evaporator')}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  <rect x="250" y="70" width="55" height="95" rx="3" fill="#1F2937" stroke="#374151" strokeWidth="2.5" />
                  {/* Fin zig-zags */}
                  <line x1="261" y1="70" x2="261" y2="165" stroke="#3B82F6" strokeWidth="1.5" />
                  <line x1="272" y1="70" x2="272" y2="165" stroke="#3B82F6" strokeWidth="1.5" />
                  <line x1="283" y1="70" x2="283" y2="165" stroke="#3B82F6" strokeWidth="1.5" />
                  <line x1="294" y1="70" x2="294" y2="165" stroke="#3B82F6" strokeWidth="1.5" />
                  <text x="277" y="121" fontSize="9" fill="#3B82F6" fontWeight="800" textAnchor="middle">EVAPORATOR</text>
                </g>

                {/* CABIN AIR FILTER */}
                <g 
                  id="diag-filter" 
                  className={`diag-group ${activePart === 'filter' ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredPart('filter')}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  <rect x="250" y="28" width="55" height="18" rx="2" fill="#E5E7EB" stroke="#4B5563" strokeWidth="1.5" />
                  {/* Pleats */}
                  <path d="M 255 41 L 260 33 L 265 41 L 270 33 L 275 41 L 280 33 L 285 41 L 290 33 L 295 41" fill="none" stroke="#374151" strokeWidth="1.5" />
                  <text x="277" y="18" fontSize="8.5" fill="#9CA3AF" fontWeight="700" textAnchor="middle">CABIN FILTER</text>
                </g>

                {/* BLOWER MOTOR FAN */}
                <g 
                  id="diag-blower" 
                  className={`diag-group ${activePart === 'blower' ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredPart('blower')}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  {/* Outer shroud */}
                  <circle cx="345" cy="115" r="26" fill="#374151" stroke="#1F2937" strokeWidth="2.5" />
                  <circle cx="345" cy="115" r="16" fill="#1F2937" />
                  {/* Fan Blades */}
                  <line x1="345" y1="90" x2="345" y2="140" stroke="#9CA3AF" strokeWidth="2" className="spinning-fan" />
                  <line x1="320" y1="115" x2="370" y2="115" stroke="#9CA3AF" strokeWidth="2" className="spinning-fan" />
                  <line x1="327" y1="97" x2="363" y2="133" stroke="#9CA3AF" strokeWidth="2" className="spinning-fan" />
                  <line x1="327" y1="133" x2="363" y2="97" stroke="#9CA3AF" strokeWidth="2" className="spinning-fan" />
                  {/* Air blow indicator arrow */}
                  <path d="M 319 115 L 298 115" fill="none" stroke="#60A5FA" strokeWidth="3.5" markerEnd="url(#arrow)" />
                  <text x="345" y="154" fontSize="8.5" fill="#9CA3AF" fontWeight="700" textAnchor="middle">BLOWER MOTOR</text>
                </g>
              </svg>
            </div>

            {/* PART INFORMATION BOX */}
            <div className="pd-info-box animate-fade-in-up">
              <div className="pd-info-box-header">
                <span className="pd-info-dot"></span>
                <h4>{partInfo.title}</h4>
              </div>
              <p className="pd-info-desc">{partInfo.desc}</p>
              <p className="pd-info-pos"><strong>Fitment:</strong> {partInfo.position}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
