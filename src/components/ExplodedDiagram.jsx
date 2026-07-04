import { useState, useEffect, useRef } from 'react';
import { getDiagram } from '../supabase';
import { getProducts } from '../data/products';
import { ZoomIn, ZoomOut, RotateCcw, HelpCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import './ExplodedDiagram.css';

export default function ExplodedDiagram({ diagramId = 'hvac-exploded-car', compatiblePartIds = [], vin = '', make = '', model = '', year = '' }) {
  const [diagram, setDiagram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [compatibleProducts, setCompatibleProducts] = useState([]);
  
  // Zoom & Pan states
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const viewportRef = useRef(null);

  useEffect(() => {
    async function loadDiagram() {
      try {
        const data = await getDiagram(diagramId);
        setDiagram(data);
      } catch (err) {
        console.error('Error loading diagram:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDiagram();
  }, [diagramId]);

  // Handle hotspot selection & fetch compatible products
  const handleHotspotClick = (hotspot) => {
    setSelectedHotspot(hotspot);
    
    // Fetch live products matching this component's category or name
    const allProducts = getProducts();
    const matches = allProducts.filter(p => {
      const pCat = p.category.toLowerCase();
      const pName = p.name.toLowerCase();
      const comp = hotspot.component.toLowerCase();
      
      // Category / Name matching mapping
      if (comp === 'compressor') return pCat.includes('compressor');
      if (comp === 'condenser') return pCat.includes('condenser');
      if (comp === 'evaporator') return pCat.includes('evaporator') || pCat.includes('cooling coil');
      if (comp === 'expansion valve') return pCat.includes('expansion valve');
      if (comp === 'blower motor') return pCat.includes('blower') || pName.includes('blower');
      if (comp === 'receiver drier') return pCat.includes('receiver') || pCat.includes('drier');
      if (comp === 'hoses') return pCat.includes('hose') || pName.includes('hose');
      if (comp === 'cooling fan') return pCat.includes('fan') || pName.includes('fan');
      if (comp === 'cabin filter') return pCat.includes('filter') || pName.includes('filter');
      if (comp === 'pressure switch') return pCat.includes('switch') || pName.includes('switch');
      if (comp === 'hvac unit') return pCat.includes('unit') || pCat.includes('assembly');
      
      return pCat.includes(comp) || pName.includes(comp);
    });
    
    // Sort so parts matching compatiblePartIds from VIN are listed first
    matches.sort((a, b) => {
      const aCompat = compatiblePartIds.includes(a.id) ? 1 : 0;
      const bCompat = compatiblePartIds.includes(b.id) ? 1 : 0;
      return bCompat - aCompat;
    });

    setCompatibleProducts(matches);
  };

  // Dragging to Pan (Mouse Events)
  const handleMouseDown = (e) => {
    if (scale <= 1) return; // Only allow panning if zoomed in
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Dragging to Pan (Touch Events for Mobile)
  const handleTouchStart = (e) => {
    if (scale <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Zooming
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3.5));
  };

  const zoomOut = () => {
    setScale(prev => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) {
        setPosition({ x: 0, y: 0 }); // Snap back to center
      }
      return next;
    });
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px' }}>
        <div className="admin-preview-spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--gray-200)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ fontSize: '13px', color: 'var(--gray-500)' }}>Loading AC schematic catalog...</span>
      </div>
    );
  }

  if (!diagram) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px', background: 'var(--gray-50)', border: '1px dashed var(--gray-200)', borderRadius: '12px', color: 'var(--gray-500)', margin: '24px 0' }}>
        <AlertCircle size={20} />
        <span>AC Exploded schematic not found. Please contact support.</span>
      </div>
    );
  }

  // Pre-fill WhatsApp message text
  const whatsappMessage = selectedHotspot
    ? `Hi RCS, I would like to enquire about the following component from the AC exploded diagram:\n\n*Part Category:* ${selectedHotspot.component}\n*OEM Reference Code:* ${selectedHotspot.oem}\n*Vehicle Make/Model:* ${make} ${model} (${year})\n*Chassis ID/VIN:* ${vin}\n\nPlease share availability and pricing.`
    : '';
  const whatsappUrl = `https://wa.me/919962173870?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="exploded-catalog-container animate-fade-in-up">
      {/* Viewport Area */}
      <div className="diagram-viewport-wrapper">
        <div className="diagram-viewport-header">
          <h4>{diagram.name}</h4>
          <div className="diagram-helper-hint">
            <HelpCircle size={13} />
            <span>Double click or pinch to zoom. Drag to pan.</span>
          </div>
        </div>

        <div 
          className={`diagram-viewport ${isDragging ? 'dragging' : ''}`}
          ref={viewportRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="diagram-stage"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.15s ease-out'
            }}
          >
            <img 
              src={diagram.image_url} 
              alt="Exploded diagram" 
              className="diagram-bg-img"
              draggable="false"
            />

            {/* Hotspots Overlay */}
            {diagram.hotspots && diagram.hotspots.map(hotspot => {
              const isActive = selectedHotspot?.id === hotspot.id;
              
              return (
                <button
                  key={hotspot.id}
                  className={`hotspot-marker ${isActive ? 'active' : ''}`}
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                  }}
                  onClick={() => handleHotspotClick(hotspot)}
                  title={hotspot.component}
                  type="button"
                >
                  {hotspot.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Viewport Floating Controls */}
        <div className="diagram-controls">
          <button onClick={zoomIn} className="control-btn" title="Zoom In" type="button">
            <ZoomIn size={18} />
          </button>
          <button onClick={zoomOut} className="control-btn" title="Zoom Out" type="button">
            <ZoomOut size={18} />
          </button>
          <button onClick={resetZoom} className="control-btn" title="Reset Zoom" type="button">
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Side Details Panel */}
      <div className="diagram-side-panel">
        {!selectedHotspot ? (
          <div className="panel-placeholder-wrapper">
            <div className="panel-placeholder-icon">
              <ShoppingBag size={48} strokeWidth={1} />
            </div>
            <h4>Interactive Exploded Catalog</h4>
            <p>Click any numbered hotspot circle on the diagram to locate OEM parts, inspect specifications, and check compatible items in our warehouse inventory.</p>
          </div>
        ) : (
          <div className="component-details-card">
            <div className="component-details-header">
              <div className="component-badge-row">
                <span className="hotspot-id-badge">Hotspot #{selectedHotspot.id}</span>
                <span className={`stock-status-badge ${selectedHotspot.stock === 'In Stock' ? 'in-stock' : 'out-of-stock'}`}>
                  {selectedHotspot.stock}
                </span>
              </div>
              <h3 className="component-name-title">{selectedHotspot.component}</h3>
              <div className="component-oem-row">
                <span>OEM Part No:</span>
                <code className="oem-code">{selectedHotspot.oem}</code>
              </div>
            </div>

            <p className="component-desc">{selectedHotspot.description}</p>

            <div className="component-matches-section">
              <h5 className="catalog-matches-title">Compatible RCS Inventory Products</h5>
              <div className="catalog-matches-list">
                {compatibleProducts.length > 0 ? (
                  compatibleProducts.map(product => (
                    <div key={product.id} className="catalog-match-card">
                      <div className="match-img-box">
                        <img src={product.image} alt={product.name} onError={(e) => { e.target.src = 'https://placehold.co/50x50?text=Part'; }} />
                      </div>
                      <div className="match-info-box">
                        <span className="match-brand-tag">{product.brand}</span>
                        <h6 className="match-title">{product.name}</h6>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="match-no-products">
                    No exact match found in current warehouse index. Click below to request a special order via custom WhatsApp sourcing.
                  </div>
                )}
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="panel-whatsapp-btn"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
              </svg>
              Enquire via WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
