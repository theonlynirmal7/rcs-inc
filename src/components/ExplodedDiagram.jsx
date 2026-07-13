import { useEffect, useState, useRef } from 'react';
import { getDiagram } from '../supabase';
import './ExplodedDiagram.css';

export default function ExplodedDiagram({ 
  diagramId, 
  vehicleInfo,
  onSelectComponent, 
  selectedComponentOem 
}) {
  const [diagram, setDiagram] = useState(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedPin, setSelectedPin] = useState(null);
  const [loading, setLoading] = useState(true);

  const viewportRef = useRef(null);

  // Load Diagram data from local DB
  useEffect(() => {
    async function loadDiagram() {
      if (!diagramId) return;
      setLoading(true);
      setSelectedPin(null);
      setScale(1);
      setPan({ x: 0, y: 0 });
      try {
        const data = await getDiagram(diagramId);
        setDiagram(data);
      } catch (err) {
        console.error('Failed to load diagram:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDiagram();
  }, [diagramId]);

  // Synchronize pin selection if selected externally
  useEffect(() => {
    if (diagram && selectedComponentOem) {
      const matched = diagram.hotspots.find(h => h.oem === selectedComponentOem);
      if (matched) {
        setSelectedPin(matched);
      }
    }
  }, [selectedComponentOem, diagram]);

  // Handle Drag/Pan Events
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom helpers
  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const resetZoom = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const handleDoubleClick = () => {
    if (scale !== 1) {
      resetZoom();
    } else {
      setScale(1.75);
    }
  };

  // Click pin event
  const handlePinClick = (pin) => {
    setSelectedPin(pin);
    if (onSelectComponent) {
      onSelectComponent(pin);
    }
  };

  // Helper to categorize vehicles
  const getVehicleCategory = (makeName, modelName) => {
    const make = (makeName || '').toLowerCase();
    const model = (modelName || '').toLowerCase();
    if (make.includes('leyland') || make.includes('bharat') || make.includes('force') || model.includes('truck') || model.includes('bus') || model.includes('dost') || model.includes('ace') || model.includes('prima') || model.includes('signa') || model.includes('ultra') || model.includes('traveller')) {
      return 'Commercial / Truck / Bus';
    }
    if (model.includes('fortuner') || model.includes('innova') || model.includes('crysta') || model.includes('scorpio') || model.includes('xuv') || model.includes('thar') || model.includes('bolero') || model.includes('hector') || model.includes('gloster') || model.includes('harrier') || model.includes('safari') || model.includes('creta') || model.includes('seltos') || model.includes('kushaq') || model.includes('taigun') || model.includes('astor') || model.includes('defender') || model.includes('discovery') || model.includes('range rover') || model.includes('wrangler') || model.includes('meridian') || model.includes('compass') || model.includes('xc60') || model.includes('xc90') || model.includes('q5') || model.includes('q7') || model.includes('glc') || model.includes('gle') || model.includes('x3') || model.includes('x5') || model.includes('duster')) {
      return 'SUV / MUV';
    }
    if (model.includes('city') || model.includes('amaze') || model.includes('civic') || model.includes('verna') || model.includes('dzire') || model.includes('baleno') || model.includes('glanza') || model.includes('ciaz') || model.includes('slavia') || model.includes('virtus') || model.includes('octavia') || model.includes('superb') || model.includes('series') || model.includes('class') || model.includes('xe') || model.includes('xf') || model.includes('cruze') || model.includes('s90') || model.includes('a4') || model.includes('a6')) {
      return 'Sedan';
    }
    return 'Hatchback';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '12px' }}>
        <div className="admin-preview-spinner" style={{ width: '28px', height: '28px', border: '3px solid var(--gray-200)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ fontSize: '13px', color: 'var(--gray-500)' }}>Loading exploded view drawing...</span>
      </div>
    );
  }

  if (!diagram) {
    return null;
  }

  // Get active vehicle details
  const make = vehicleInfo?.make || 'Toyota';
  const model = vehicleInfo?.model || 'Innova Crysta';
  const year = vehicleInfo?.year || '2022';
  const engine = vehicleInfo?.engine || '2.4L Diesel';
  const vehicleImage = vehicleInfo?.vehicleImage || '/vehicles/innova.png';
  const category = getVehicleCategory(make, model);

  // Sort hotspots in Parts Legend list 1 to 11
  const legendItems = diagram.hotspots.slice().sort((a, b) => a.id - b.id);

  return (
    <div className="exploded-diagram-section animate-fade-in-up">
      {/* Title Header */}
      <div className="exploded-diagram-header">
        <div className="header-left">
          <h3>EXPLODED VIEW DIAGRAM – A/C SYSTEM</h3>
          <span className="header-subtitle">
            {make} {model} | {year} | {engine}
          </span>
        </div>
        <div className="header-right">
          <span className="brand-logo-text">RCS</span>
          <span className="brand-logo-sub">THE COOLING EXPERTS</span>
        </div>
      </div>
      
      <div className="exploded-diagram-container">
        {/* Left Side: Viewport Canvas */}
        <div className="diagram-left-col">
          <div 
            ref={viewportRef}
            className={`diagram-viewport ${isDragging ? 'dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
          >
            {/* Zoom Toolbar */}
            <div className="diagram-toolbar" onMouseDown={(e) => e.stopPropagation()}>
              <button className="toolbar-btn" onClick={zoomOut}>−</button>
              <span className="zoom-indicator">{Math.round(scale * 100)}%</span>
              <button className="toolbar-btn" onClick={zoomIn}>+</button>
              <button className="toolbar-btn reset-btn" onClick={resetZoom}>Reset</button>
            </div>

            {/* Interactive Canvas */}
            <div 
              className="diagram-canvas"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                width: '100%',
                height: '100%',
                position: 'relative'
              }}
            >
              <img src={diagram.image_url} alt={diagram.name} draggable="false" />
              
              {/* Hotspots Pin Overlay */}
              {diagram.hotspots.map((pin) => (
                <div 
                  key={pin.id}
                  className={`hotspot-pin ${selectedPin?.id === pin.id ? 'active' : ''}`}
                  style={{
                    left: `${pin.x}%`,
                    top: `${pin.y}%`
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePinClick(pin);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <span className="pin-label">{pin.id}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines Footer Toolbar */}
          <div className="diagram-guidelines-toolbar">
            <div className="guideline-item">
              <span className="guideline-icon">🖱️</span>
              <div className="guideline-texts">
                <span className="guideline-title">How to use</span>
                <span className="guideline-desc">Click on any part number to view details and compatible products.</span>
              </div>
            </div>
            <div className="guideline-item">
              <span className="guideline-icon">🔍</span>
              <div className="guideline-texts">
                <span className="guideline-title">Zoom & Pan</span>
                <span className="guideline-desc">Use mouse scroll or touch gestures.</span>
              </div>
            </div>
            <div className="guideline-item">
              <span className="guideline-icon">🫴</span>
              <div className="guideline-texts">
                <span className="guideline-title">Drag</span>
                <span className="guideline-desc">Click and drag to move diagram.</span>
              </div>
            </div>
            <div className="guideline-item reset" onClick={resetZoom}>
              <span className="guideline-icon">🔄</span>
              <div className="guideline-texts">
                <span className="guideline-title">Reset View</span>
                <span className="guideline-desc">Click to reset diagram position.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Multi-Card Spec/Legend/Enquiry sidebar */}
        <div className="diagram-right-col">
          {/* Card 1: Spec Card */}
          <div className="diagram-spec-card">
            <div className="spec-card-image">
              <img src={vehicleImage} alt={`${make} ${model}`} />
            </div>
            <div className="spec-card-details">
              <div className="spec-detail-row">
                <span className="spec-label">Vehicle Make</span>
                <span className="spec-val">{make}</span>
              </div>
              <div className="spec-detail-row">
                <span className="spec-label">Vehicle Model</span>
                <span className="spec-val">{model}</span>
              </div>
              <div className="spec-detail-row">
                <span className="spec-label">Model Year</span>
                <span className="spec-val">{year}</span>
              </div>
              <div className="spec-detail-row">
                <span className="spec-label">Engine Spec</span>
                <span className="spec-val">{engine}</span>
              </div>
              <div className="spec-detail-row">
                <span className="spec-label">Category</span>
                <span className="spec-val badge">{category}</span>
              </div>
            </div>
          </div>

          {/* Card 2: PARTS LEGEND Card */}
          <div className="parts-legend-card">
            <div className="parts-legend-header">
              PARTS LEGEND
            </div>
            <div className="parts-legend-list">
              {legendItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`parts-legend-row ${selectedPin?.id === item.id ? 'active' : ''}`}
                  onClick={() => handlePinClick(item)}
                >
                  <div className="parts-legend-row-summary">
                    <span className="legend-num">{item.id}</span>
                    <span className="legend-name">{item.component}</span>
                  </div>
                  
                  {selectedPin?.id === item.id && (
                    <div className="parts-legend-row-details animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="legend-detail-item">
                        <span className="legend-detail-label">OEM Reference:</span>
                        <span className="legend-detail-val oem-tag">{item.oem}</span>
                      </div>
                      <div className="legend-detail-item">
                        <span className="legend-detail-label">Availability:</span>
                        <span className={`legend-detail-val stock-status ${item.stock === 'In Stock' ? 'in-stock' : 'out-of-stock'}`}>
                          {item.stock}
                        </span>
                      </div>
                      {item.brands && (
                        <div className="legend-detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                          <span className="legend-detail-label">Brands RCS Stocks:</span>
                          <span className="legend-detail-val" style={{ fontSize: '11.5px', color: 'var(--gray-800)', fontWeight: 700 }}>
                            {item.brands}
                          </span>
                        </div>
                      )}
                      <p className="legend-detail-desc" style={{ marginTop: '2px', marginBottom: '6px' }}>{item.description}</p>
                      
                      <a
                        href={`https://wa.me/919962173870?text=${encodeURIComponent(
                          `Hi RCS, I am looking for the following AC spare part:\n\n*Vehicle:* ${make} ${model} (${year})\n*Component:* ${item.component}\n*OEM Number:* ${item.oem}\n*Brands Stocked:* ${item.brands || 'OEM standard'}\n*Availability:* ${item.stock}\n\nPlease share price quote and shipping delivery timeline.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="legend-whatsapp-btn"
                        style={{
                          backgroundColor: '#25d366',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '10px 14px',
                          borderRadius: '6px',
                          fontWeight: '800',
                          fontSize: '11.5px',
                          textDecoration: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(37,211,102,0.2)',
                          transition: 'all 0.2s ease',
                          alignSelf: 'stretch',
                          textAlign: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                        </svg>
                        <span>Get Price on WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Note Card */}
          <div className="diagram-note-card">
            <div className="note-card-title">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <span>Note</span>
            </div>
            <p className="note-card-text">This diagram is for reference only. Actual parts may vary by model.</p>
          </div>

          {/* Banner: WhatsApp Enquiry */}
          <a
            href={`https://wa.me/919962173870?text=${encodeURIComponent(
              selectedPin 
                ? `Hi RCS, I am looking for the following AC spare part:\n\n*Vehicle:* ${make} ${model} (${year})\n*Component:* ${selectedPin.component}\n*OEM Number:* ${selectedPin.oem}\n\nPlease share price quote and shipping delivery timeline.`
                : `Hi RCS, I need help finding AC parts for my ${make} ${model} (${year}).`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-enquiry-banner"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="whatsapp-icon-circle">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#1B5E20' }}>Need help finding the right part?</div>
                <div style={{ fontSize: '11px', color: '#2E7D32', marginTop: '2px' }}>Chat with our experts on WhatsApp</div>
              </div>
            </div>
            <div style={{ color: '#2E7D32' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
