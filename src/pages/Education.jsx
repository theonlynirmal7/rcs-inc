import { useState } from 'react';
import { BookOpen, AlertTriangle, ShieldCheck, Settings, Activity } from 'lucide-react';
import './Education.css';

const partsData = [
  {
    id: 'compressor',
    name: 'AC Compressor',
    tagline: 'The Heart of the System',
    image: '/compressor.png',
    overview: 'The compressor is the power unit of the air conditioning system. It acts as a pump that pressurizes the refrigerant gas and circulates it through the entire AC loop, enabling heat exchange.',
    operation: 'Driven by the engine accessory belt, the compressor draws in low-pressure, cool gaseous refrigerant from the evaporator. It compresses it into a high-pressure, hot gas and pumps it toward the condenser.',
    symptoms: [
      'Warm air blowing from the cabin vents',
      'Loud clanking, squealing, or clicking noises when the AC is turned on',
      'The AC compressor clutch refusing to engage or spin',
      'Refrigerant or oil leaks around the compressor body or shaft seal'
    ],
    maintenance: [
      'Run the AC for at least 10 minutes once a week (even in winter) to circulate oil and keep the rubber seals lubricated.',
      'Always ensure the drive belt has the correct tension and is free of cracks.',
      'If the compressor fails, always flush the system and replace the condenser and receiver drier to prevent metal debris from ruining the new compressor.'
    ]
  },
  {
    id: 'condenser',
    name: 'AC Condenser',
    tagline: 'The Heat Dissipator',
    image: '/condenser.png',
    overview: 'Located at the front of the vehicle (usually right in front of the radiator), the condenser acts as a heat exchanger that releases heat from the refrigerant into the outside air.',
    operation: 'Hot, high-pressure gaseous refrigerant from the compressor enters the condenser coils. As outside air passes through the fins, it cools the gas, condensing it into a high-pressure liquid state.',
    symptoms: [
      'Poor cooling performance, particularly when the car is idling or in traffic',
      'Engine temperature runs higher than normal when the AC is running',
      'Visible physical damage, bent fins, or green oily stains indicating refrigerant leaks',
      'Accumulation of debris (leaves, bugs, dirt) restricting airflow'
    ],
    maintenance: [
      'Gently clean the condenser fins with low-pressure water to remove bugs, dust, and mud.',
      'Straighten bent fins carefully using a fin comb to maintain maximum cooling efficiency.',
      'Ensure the condenser cooling fans are operating correctly when the AC is switched on.'
    ]
  },
  {
    id: 'evaporator',
    name: 'Evaporator Core',
    tagline: 'The Cooling Chamber',
    image: '/evaporator-coil.png',
    overview: 'Nestled deep inside the dashboard HVAC box, the evaporator is another heat exchanger. However, instead of releasing heat, it absorbs heat from the cabin air to generate cold air.',
    operation: 'Liquid refrigerant enters the evaporator at low pressure and low temperature. As warm cabin air is blown across the evaporator fins, the refrigerant absorbs the heat from the air, vaporizing back into a gas.',
    symptoms: [
      'AC blows slightly cool or warm air',
      'A damp, musty, or sour smell coming from the dashboard vents',
      'Water leaking onto the passenger-side cabin floor (due to a clogged condensate drain)',
      'Hissing sounds from the dashboard when the AC is switched on'
    ],
    maintenance: [
      'Replace your cabin air filter regularly to prevent dust, mold, and debris from accumulating on the wet evaporator fins.',
      'Ensure the evaporator condensate drain tube is clear to prevent stagnant water buildup and cabin leaking.',
      'Use professional anti-bacterial sprays through the intake ducts if musty odors develop.'
    ]
  },
  {
    id: 'expansion-valve',
    name: 'Expansion Valve',
    tagline: 'The Pressure Regulator',
    image: '/expansion-valve.png',
    overview: 'The expansion valve (or orifice tube in some vehicles) acts as the gating device between the high-pressure liquid side and the low-pressure gaseous side of the AC system.',
    operation: 'It meters and regulates the flow of high-pressure liquid refrigerant into the evaporator. By restricting the flow, it causes a sudden drop in pressure, which drops the refrigerant temperature dramatically.',
    symptoms: [
      'AC system freezes up, causing frost to build up on the dashboard vents or lines',
      'AC blows warm air, or cycles erratically between cold and warm',
      'The compressor runs continuously without cycling off',
      'Refrigerant pressure readings on the low side are abnormally high or low'
    ],
    maintenance: [
      'Keep the refrigerant system free of moisture by replacing the receiver drier whenever the system is serviced.',
      'Ensure the temperature sensing bulb on the valve is properly insulated and mounted.',
      'Use high-purity refrigerant and PAG oil to prevent internal valve clogging.'
    ]
  },
  {
    id: 'receiver-drier',
    name: 'Receiver Drier',
    tagline: 'The System Filter & Dehydrator',
    image: '/receiver-drier.png',
    overview: 'The receiver drier (or accumulator on orifice tube systems) acts as a safety filter, temporary storage reservoir, and moisture absorber for the system\'s refrigerant.',
    operation: 'It contains filter material to catch debris and a desiccant bag that chemically binds and traps any moisture/water inside the closed AC loop, preventing corrosion and ice clogs.',
    symptoms: [
      'Inadequate cooling or rapid compressor cycling',
      'Frost forming on the receiver drier body (indicating an internal restriction)',
      'Corrosion in other AC components due to excessive internal moisture',
      'A rattling sound from inside the drier, indicating the desiccant bag has ruptured'
    ],
    maintenance: [
      'You must replace the receiver drier every time the AC system is opened for repairs to prevent the desiccant from saturating with atmospheric humidity.',
      'Always replace the drier when installing a new compressor to protect the compressor warranty.'
    ]
  },
  {
    id: 'blower-motor',
    name: 'AC Blower Motor',
    tagline: 'The Air Circulator',
    image: '/blower-motor.png',
    overview: 'The blower motor is the electric fan that actually pushes the conditioned (hot or cold) air through the ductwork and out of the dashboard vents into the vehicle passenger cabin.',
    operation: 'Controlled by the dashboard climate settings, this electric motor spins a squirrel-cage fan wheel at various speeds, regulated by a blower motor resistor or electronic control module.',
    symptoms: [
      'No airflow from the vents, even though the AC compressor and controls are active',
      'Air only blows on the highest speed setting (caused by a failed blower resistor)',
      'Squealing, rattling, or ticking noises behind the glovebox when the fan is running',
      'Weak or low airflow even at the maximum speed setting'
    ],
    maintenance: [
      'Inspect the blower motor intake for leaves or twigs that might have bypassed the cabin filter.',
      'Replace the cabin filter regularly to reduce backpressure, which prevents the motor from overheating.',
      'Address squealing sounds early by replacing or lubricating the motor bearings before it locks up completely.'
    ]
  }
];

export default function Education() {
  const [selectedPart, setSelectedPart] = useState(partsData[0]);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="education-page page-transition">
      {/* HERO */}
      <section className="edu-hero">
        <div className="container">
          <div className="section-label">AC Systems Guide <span className="dot"></span></div>
          <h1 className="section-title">
            How Automotive <span className="highlight">AC Systems Work</span>
          </h1>
          <p className="edu-hero-desc">
            A comprehensive AC Systems Guide explaining the core components of vehicle climate control.
            Understand how they operate, identify symptoms of failure, and learn essential maintenance tips.
          </p>
        </div>
      </section>

      {/* EXPLORER */}
      <section className="edu-content">
        <div className="container edu-grid">
          {/* LEFT SIDEBAR - PART SELECTION */}
          <div className="edu-sidebar">
            <h3 className="sidebar-title">Select Component</h3>
            <div className="part-selector-list">
              {partsData.map(part => (
                <button
                  key={part.id}
                  className={`part-selector-item ${selectedPart.id === part.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPart(part);
                    setActiveTab('overview');
                  }}
                >
                  <span className="selector-indicator" />
                  <div>
                    <h4 className="part-sel-name">{part.name}</h4>
                    <span className="part-sel-tagline">{part.tagline}</span>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="edu-quick-tip">
              <h4>💡 Pro Tip for Workshops</h4>
              <p>
                Explain these component roles and symptoms to vehicle owners to build trust and justify parts replacements.
              </p>
            </div>
          </div>

          {/* RIGHT VIEWPORT - INTERACTIVE DETAILS */}
          <div className="edu-viewport">
            {/* VIEWPORT HEADER */}
            <div className="viewport-header">
              <div className="viewport-part-img-container">
                <img src={selectedPart.image} alt={selectedPart.name} className="viewport-part-img" />
              </div>
              <div className="viewport-header-text">
                <span className="viewport-tagline">{selectedPart.tagline}</span>
                <h2>{selectedPart.name}</h2>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="tab-selector-bar">
              <button
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <BookOpen size={16} />
                <span>Overview</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'operation' ? 'active' : ''}`}
                onClick={() => setActiveTab('operation')}
              >
                <Activity size={16} />
                <span>How It Works</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'symptoms' ? 'active' : ''}`}
                onClick={() => setActiveTab('symptoms')}
              >
                <AlertTriangle size={16} />
                <span>Failure Signs</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
                onClick={() => setActiveTab('maintenance')}
              >
                <Settings size={16} />
                <span>Maintenance</span>
              </button>
            </div>

            {/* TAB CONTENT PANEL */}
            <div className="tab-content-panel">
              {activeTab === 'overview' && (
                <div className="tab-pane animate-fade-in">
                  <h3>Component Overview</h3>
                  <p className="large-para">{selectedPart.overview}</p>
                  
                  <div className="edu-callout">
                    <ShieldCheck size={20} className="callout-icon" />
                    <div>
                      <h5>Quality Standards</h5>
                      <p>
                        RCS partners only with manufacturers that meet rigorous ISO/TS quality standards, ensuring maximum longevity for this critical component.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'operation' && (
                <div className="tab-pane animate-fade-in">
                  <h3>Operational Principles</h3>
                  <p className="large-para">{selectedPart.operation}</p>
                  <p>
                    Within the refrigeration cycle, this part regulates or handles thermodynamics, transitioning the refrigerant pressure and temperature to create the heat absorption or dissipation effect needed for cabin comfort.
                  </p>
                </div>
              )}

              {activeTab === 'symptoms' && (
                <div className="tab-pane animate-fade-in">
                  <h3>Common Symptoms of Failure</h3>
                  <p className="pane-intro">When this part starts to wear out or fail, you will typically observe one or more of the following warning signs:</p>
                  
                  <ul className="symptoms-bullet-list">
                    {selectedPart.symptoms.map((sym, idx) => (
                      <li key={idx}>
                        <AlertTriangle size={14} className="bullet-alert-icon" />
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'maintenance' && (
                <div className="tab-pane animate-fade-in">
                  <h3>Essential Maintenance Tips</h3>
                  <p className="pane-intro">Extend the lifespan of this component and avoid expensive repairs by following these best practices:</p>
                  
                  <ol className="maintenance-numbered-list">
                    {selectedPart.maintenance.map((maint, idx) => (
                      <li key={idx}>
                        <div className="number-badge">{idx + 1}</div>
                        <p>{maint}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
