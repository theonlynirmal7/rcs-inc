import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, Truck, Shield, Headphones, Zap, Search, Mic, MicOff, X, Sparkles, Clock, Package, Tag, Car, ShieldCheck, AlertTriangle, HelpCircle, Camera, Upload, Sliders } from 'lucide-react';
import { getProducts, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import heroParts from '../assets/hero-parts.png';
import { dbService } from '../supabase';
import ExplodedDiagram from '../components/ExplodedDiagram';
import useSEO from '../hooks/useSEO';
import './Home.css';

const marqueeBrands = [
  { name: 'Maruti Suzuki', logoUrl: '/brand-logos/suzuki.png' },
  { name: 'Toyota', logoUrl: '/brand-logos/toyota.png' },
  { name: 'Hyundai', logoUrl: '/brand-logos/hyundai.png' },
  { name: 'Honda', logoUrl: '/brand-logos/honda.png' },
  { name: 'Tata Motors', logoUrl: '/brand-logos/tata.png' },
  { name: 'Mahindra', logoUrl: '/brand-logos/mahindra.png' },
  { name: 'BMW', logoUrl: '/brand-logos/bmw.png' },
  { name: 'Bugatti', logoUrl: '/brand-logos/bugatti.png' },
  { name: 'Mercedes-Benz', logoUrl: '/brand-logos/mercedes-benz.png' },
  { name: 'Audi', logoUrl: '/brand-logos/audi.png' },
  { name: 'Volkswagen', logoUrl: '/brand-logos/volkswagen.png' },
  { name: 'Ford', logoUrl: '/brand-logos/ford.png' },
  { name: 'Chevrolet', logoUrl: '/brand-logos/chevrolet.png' },
  { name: 'Kia', logoUrl: '/brand-logos/kia.png' }
];

const faqCategories = [
  {
    id: "products",
    name: "Products & Compatibility",
    items: [
      {
        q: "How do I know if a part is compatible with my vehicle?",
        a: "Search by vehicle brand and model or contact us with your vehicle details."
      },
      {
        q: "Do you supply OEM and aftermarket parts?",
        a: "Yes, we supply both OEM and quality-tested aftermarket AC components."
      },
      {
        q: "Which vehicle types do you support?",
        a: "Cars, SUVs, trucks, buses, commercial vehicles, and fleet vehicles."
      },
      {
        q: "What AC components do you stock?",
        a: "Compressors, condensers, evaporators, blower motors, expansion valves, receiver driers, cooling coils, and more."
      }
    ]
  },
  {
    id: "orders",
    name: "Orders & Distribution",
    items: [
      {
        q: "Do you sell in bulk?",
        a: "Yes, we specialize in wholesale and bulk orders for dealers and workshops."
      },
      {
        q: "Can workshops and garages become regular customers?",
        a: "Yes, we offer dedicated support for workshops, garages, and fleet operators."
      },

      {
        q: "What is the minimum order quantity?",
        a: "MOQ depends on the product category and brand."
      }
    ]
  },
  {
    id: "shipping",
    name: "Shipping & Support",
    items: [
      {
        q: "Do you deliver across India?",
        a: "Yes, we ship to customers nationwide through trusted logistics partners."
      },
      {
        q: "How quickly are orders delivered?",
        a: "We deliver orders as quickly as possible based on your location, product availability, and shipping distance. Our team works to ensure fast and reliable delivery across India."
      },
      {
        q: "How can I get a quote?",
        a: "Contact us through WhatsApp or the enquiry form for pricing and availability."
      },
      {
        q: "Do you provide technical assistance?",
        a: "Yes, our team can help identify the correct component for your application."
      }
    ]
  },
  {
    id: "trust",
    name: "Trust & Quality",
    items: [
      {
        q: "Are your products genuine?",
        a: "We source products from trusted manufacturers and authorized suppliers."
      },
      {
        q: "Which brands do you distribute?",
        a: "We work with leading automotive cooling brands including OEM and aftermarket manufacturers."
      },
      {
        q: "Do your parts come with warranty support?",
        a: "Warranty availability depends on the manufacturer and product category."
      }
    ]
  }
];

function Counter({ target, duration = 2500, animate = false }) {
  const [count, setCount] = useState(0);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (animate && !animatedRef.current) {
      animatedRef.current = true;
      const end = parseInt(target, 10);
      if (isNaN(end)) return;
      
      const startTime = performance.now();

      const runAnimate = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeProgress = progress * (2 - progress); // easeOutQuad
        
        const currentCount = Math.floor(easeProgress * end);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(runAnimate);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(runAnimate);
    }
  }, [animate, target, duration]);

  const suffix = target.replace(/[0-9]/g, '');

  return <span>{count}{suffix}</span>;
}

export default function Home() {
  const products = getProducts();
  const featured = products.slice(0, 4);

  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState('parts'); // 'parts', 'vin', 'image', or 'vehicle'
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const vehicleData = {
    'Maruti Suzuki': ['Swift', 'WagonR', 'Dzire', 'Baleno', 'Brezza', 'Ertiga', 'Alto', 'Grand Vitara', 'Fronx', 'Jimny', 'Celerio', 'Ignis', 'S-Presso', 'Eeco', 'XL6', 'Ciaz', 'Invicto'],
    'Hyundai': ['Grand i10', 'i20', 'Aura', 'Verna', 'Venue', 'Exter', 'Creta', 'Alcazar', 'Tucson', 'Ioniq 5', 'Santro'],
    'Honda': ['City', 'Amaze', 'Elevate', 'Civic', 'Jazz', 'WR-V'],
    'Tata Motors': ['Tiago', 'Tigor', 'Altroz', 'Punch', 'Nexon', 'Curvv', 'Harrier', 'Safari', 'Hexa'],
    'Mahindra': ['Thar', 'Thar ROXX', 'Scorpio Classic', 'Scorpio-N', 'XUV300', 'XUV 3XO', 'XUV700', 'Bolero', 'Bolero Neo'],
    'Toyota': ['Innova', 'Innova Crysta', 'Innova Hycross', 'Fortuner', 'Legender', 'Glanza', 'Urban Cruiser', 'Hilux', 'Camry', 'Vellfire', 'Land Cruiser', 'Corolla'],
    'MG Motor': ['Hector', 'Astor', 'ZS EV', 'Gloster', 'Comet EV'],
    'Kia': ['Sonet', 'Seltos', 'Carens', 'Carnival', 'EV6', 'EV9'],
    'Skoda': ['Kushaq', 'Slavia', 'Octavia', 'Superb', 'Kodiaq'],
    'Volkswagen': ['Polo', 'Vento', 'Virtus', 'Taigun', 'Tiguan', 'Jetta', 'Passat'],
    'BMW': ['2 Series', '3 Series', '5 Series', '6 Series GT', '7 Series', 'X1', 'X3', 'X4', 'X5', 'X7', 'Z4', 'i4', 'iX'],
    'Audi': ['A3', 'A4', 'A6', 'A8 L', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron'],
    'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'G-Class', 'EQS'],
    'Jaguar': ['XE', 'XF', 'XJ', 'F-Pace', 'I-Pace', 'F-Type'],
    'Land Rover': ['Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque', 'Defender', 'Discovery', 'Discovery Sport'],
    'Ford': ['Figo', 'EcoSport', 'Endeavour', 'Mustang'],
    'Renault': ['Kwid', 'Triber', 'Kiger', 'Duster'],
    'Nissan': ['Micra', 'Sunny', 'Terrano', 'Magnite', 'X-Trail'],
    'Chevrolet': ['Spark', 'Beat', 'Sail', 'Cruze', 'Tavera', 'Enjoy', 'Captiva'],
    'Jeep': ['Compass', 'Meridian', 'Wrangler', 'Grand Cherokee'],
    'Volvo Cars': ['S60', 'S90', 'XC40', 'XC60', 'XC90', 'C40 Recharge'],
    'Isuzu': ['D-Max', 'V-Cross', 'MU-X'],
    'Aston Martin': ['Vantage', 'DB11', 'DBS', 'DBX'],
    'Bentley': ['Continental GT', 'Flying Spur', 'Bentayga'],
    'Citroen': ['C3', 'C3 Aircross', 'C5 Aircross', 'eC3'],
    'Ferrari': ['Roma', '296 GTB', 'F8 Tributo', 'Purosangue'],
    'Lamborghini': ['Huracan', 'Urus', 'Revuelto'],
    'Lexus': ['ES', 'NX', 'RX', 'LX', 'LS'],
    'Maserati': ['Ghibli', 'Quattroporte', 'Levante', 'Grecale'],
    'Mini': ['Cooper', 'Countryman', 'Clubman'],
    'Mitsubishi': ['Pajero', 'Lancer', 'Outlander'],
    'Porsche': ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'],
    'Rolls Royce': ['Ghost', 'Phantom', 'Cullinan', 'Spectre'],
    'Tata Commercial': ['Prima (Heavy Truck)', 'Signa (Cargo Truck)', 'Ultra (Light Truck)', 'Starbus (Bus)', 'Ace (Mini Truck)'],
    'Ashok Leyland': ['Dost (Mini Truck)', 'Bada Dost (Light Truck)', 'U-Truck (Heavy Cargo)', 'Oyster (Staff Bus)', 'Viking (Passenger Bus)'],
    'BharatBenz': ['BharatBenz 2823C (Tipper)', 'BharatBenz 1917R (Cargo)', 'BharatBenz 5528TT (Tractor)'],
    'Force Motors': ['Traveller (Passenger Van)', 'Gurkha (Off-roader)', 'Citiline (MUV)'],
    'Volvo Buses': ['Volvo 9400 (Intercity Bus)', 'Volvo 9600 (Luxury Sleeper)']
  };

  const vehicleYears = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'];

  const resolveVehicleSpecs = (makeName, modelName) => {
    const make = makeName.toLowerCase();
    const model = modelName.toLowerCase();

    // Default presets
    let specs = {
      compressor: 'Denso / Sanden OEM Spec Compressor',
      refrigerant: 'R-134a (550 ± 25g)',
      oil: 'PAG 46 (100 ml)',
      belt: '6PK1120',
      pollenFilter: '220 x 190 x 25 mm'
    };
    
    let fuelType = 'Petrol';
    let engine = '2.0L Fuel-Injected Engine';

    // Specific model checks for Maruti Suzuki
    if (make.includes('suzuki')) {
      engine = '1.2L K-Series Petrol';
      if (model.includes('alto')) {
        specs = {
          compressor: 'Subros C80 / KB Compressor',
          refrigerant: 'R-134a (320 ± 15g)',
          oil: 'PAG 46 (60 ml)',
          belt: '4PK810',
          pollenFilter: '200 x 180 x 20 mm'
        };
        engine = '1.0L K10C Petrol';
      } else if (model.includes('ertiga') || model.includes('xl6')) {
        specs = {
          compressor: 'Denso 10S13C Dual AC',
          refrigerant: 'R-134a (530 ± 25g)',
          oil: 'PAG 46 (120 ml)',
          belt: '6PK1210',
          pollenFilter: '215 x 200 x 30 mm'
        };
        engine = '1.5L K15C Smart Hybrid';
      } else if (model.includes('brezza') || model.includes('grand vitara') || model.includes('fronx') || model.includes('jimny')) {
        specs = {
          compressor: 'Denso 10S13C / Subros C120',
          refrigerant: 'R-134a (410 ± 20g)',
          oil: 'PAG 46 (100 ml)',
          belt: '6PK1185',
          pollenFilter: '215 x 200 x 30 mm'
        };
        engine = '1.5L K15B Petrol';
      } else if (model.includes('celerio') || model.includes('ignis') || model.includes('s-presso')) {
        specs = {
          compressor: 'Subros C80 / KB Compressor',
          refrigerant: 'R-134a (340 ± 15g)',
          oil: 'PAG 46 (70 ml)',
          belt: '5PK910',
          pollenFilter: '200 x 180 x 20 mm'
        };
        engine = '1.0L - 1.2L K-Series Petrol';
      } else if (model.includes('eeco')) {
        specs = {
          compressor: 'Subros C100 Compressor',
          refrigerant: 'R-134a (400 ± 20g)',
          oil: 'PAG 46 (80 ml)',
          belt: '5PK970',
          pollenFilter: '210 x 185 x 25 mm'
        };
        engine = '1.2L G12B Petrol';
      } else if (model.includes('ciaz')) {
        specs = {
          compressor: 'Denso 10S11C Compressor',
          refrigerant: 'R-134a (390 ± 15g)',
          oil: 'PAG 46 (90 ml)',
          belt: '6PK1130',
          pollenFilter: '215 x 200 x 28 mm'
        };
        engine = '1.5L K15 Smart Hybrid';
      } else if (model.includes('invicto')) {
        specs = {
          compressor: 'Denso Electric Compressor (ES18)',
          refrigerant: 'R-134a (650 ± 25g)',
          oil: 'ND-OIL 11 / PAG 46 (120 ml)',
          belt: 'N/A (Electric Drive)',
          pollenFilter: '215 x 190 x 28 mm'
        };
        engine = '2.0L Petrol Hybrid';
        fuelType = 'Hybrid';
      } else {
        // Swift, Dzire, Baleno, WagonR
        specs = {
          compressor: 'Subros / Denso 10S11C',
          refrigerant: 'R-134a (370 ± 20g)',
          oil: 'PAG 46 (80 ml)',
          belt: '6PK1150',
          pollenFilter: '210 x 200 x 29 mm'
        };
      }
    } 
    // Hyundai & Kia
    else if (make.includes('hyundai') || make.includes('kia')) {
      specs = {
        compressor: 'Hanon / Doowon DV16 (Variable)',
        refrigerant: 'R-134a (450 ± 25g)',
        oil: 'PAG 46 (100 ml)',
        belt: '6PK1255',
        pollenFilter: '225 x 195 x 25 mm'
      };
      engine = '1.5L CRDi Diesel';
      fuelType = 'Diesel';

      if (model.includes('i10') || model.includes('santro')) {
        specs = {
          compressor: 'Doowon DV11 / Hanon HS11',
          refrigerant: 'R-134a (380 ± 15g)',
          oil: 'PAG 46 (80 ml)',
          belt: '6PK1190',
          pollenFilter: '210 x 180 x 25 mm'
        };
        engine = '1.2L Kappa Petrol';
        fuelType = 'Petrol';
      } else if (model.includes('i20') || model.includes('sonet')) {
        specs = {
          compressor: 'Hanon DV13 / Doowon DV13',
          refrigerant: 'R-134a (400 ± 20g)',
          oil: 'PAG 46 (90 ml)',
          belt: '6PK1215',
          pollenFilter: '215 x 185 x 25 mm'
        };
        engine = '1.2L Kappa Petrol';
        fuelType = 'Petrol';
      } else if (model.includes('verna')) {
        specs = {
          compressor: 'Hanon DV15 / Doowon DV15',
          refrigerant: 'R-134a (430 ± 15g)',
          oil: 'PAG 46 (90 ml)',
          belt: '6PK1240',
          pollenFilter: '225 x 195 x 25 mm'
        };
        engine = '1.5L MPi Petrol';
        fuelType = 'Petrol';
      }
    } 
    // Honda
    else if (make.includes('honda')) {
      specs = {
        compressor: 'Sanden TRSE07 / TRF090',
        refrigerant: 'R-134a (400 ± 20g)',
        oil: 'SP-10 / PAG 46 (90 ml)',
        belt: '5PK1140',
        pollenFilter: '210 x 205 x 30 mm'
      };
      engine = '1.5L i-VTEC Petrol';
      fuelType = 'Petrol';
    } 
    // Toyota
    else if (make.includes('toyota')) {
      specs = {
        compressor: 'Denso 10S15C / 10S17C Dual AC',
        refrigerant: 'R-134a (650 ± 30g)',
        oil: 'PAG 46 (120 ml)',
        belt: '7PK2050',
        pollenFilter: '215 x 190 x 28 mm'
      };
      engine = '2.4L - 2.8L D-4D Diesel';
      fuelType = 'Diesel';
      if (model.includes('corolla') || model.includes('glanza')) {
        specs = {
          compressor: 'Denso TSE14C / 5SER09C',
          refrigerant: 'R-134a (440 ± 20g)',
          oil: 'ND-OIL 8 / PAG 46 (95 ml)',
          belt: '6PK1220',
          pollenFilter: '215 x 190 x 28 mm'
        };
        engine = '1.8L VVTi Petrol';
        fuelType = 'Petrol';
      }
    } 
    // Mahindra
    else if (make.includes('mahindra')) {
      specs = {
        compressor: 'Hanon VS16 / VS14',
        refrigerant: 'R-134a (560 ± 20g)',
        oil: 'PAG 46 (110 ml)',
        belt: '6PK1590',
        pollenFilter: '220 x 195 x 30 mm'
      };
      engine = '2.2L mHawk Diesel';
      fuelType = 'Diesel';
      if (model.includes('thar')) {
        specs = {
          compressor: 'Hanon VS14 / Doowon DV14',
          refrigerant: 'R-134a (480 ± 20g)',
          oil: 'PAG 46 (100 ml)',
          belt: '6PK1410',
          pollenFilter: '215 x 185 x 28 mm'
        };
        engine = '2.2L mHawk Diesel';
      }
    } 
    // Tata Motors
    else if (make.includes('tata')) {
      specs = {
        compressor: 'Subros Sub-Compact Rotary',
        refrigerant: 'R-134a (420 ± 15g)',
        oil: 'PAG 46 (90 ml)',
        belt: '5PK1030',
        pollenFilter: '215 x 185 x 30 mm'
      };
      engine = '1.2L Revotron Turbo Petrol';
      fuelType = 'Petrol';
      if (model.includes('tiago')) {
        specs = {
          compressor: 'Subros Rotary C100',
          refrigerant: 'R-134a (360 ± 15g)',
          oil: 'PAG 46 (80 ml)',
          belt: '5PK975',
          pollenFilter: '200 x 180 x 25 mm'
        };
        engine = '1.2L Revotron Petrol';
      } else if (model.includes('harrier') || model.includes('safari')) {
        specs = {
          compressor: 'Hanon VS16 / Denso 7SBU16C',
          refrigerant: 'R-134a (550 ± 25g)',
          oil: 'PAG 46 (120 ml)',
          belt: '6PK1305',
          pollenFilter: '230 x 210 x 30 mm'
        };
        engine = '2.0L Kryotec Diesel';
        fuelType = 'Diesel';
      }
    } 
    // Land Rover & Jaguar
    else if (make.includes('land') || make.includes('jaguar')) {
      specs = {
        compressor: 'Denso 6SBU16C / Sanden PXE16',
        refrigerant: 'R-134a (750 ± 20g)',
        oil: 'PAG 46 (140 ml)',
        belt: '6PK1320',
        pollenFilter: '230 x 215 x 30 mm'
      };
      engine = '2.0L Ingenium Turbocharged';
      fuelType = 'Petrol';
    }
    // BMW, Mercedes, Audi
    else if (make.includes('bmw') || make.includes('audi') || make.includes('mercedes')) {
      specs = {
        compressor: 'Denso 6SEU16C / 7SEU17C Variable',
        refrigerant: 'R-134a (590 ± 20g)',
        oil: 'PAG 46 (120 ml)',
        belt: '6PK1020',
        pollenFilter: '240 x 220 x 30 mm'
      };
      engine = '2.0L TwinPower Turbo';
      fuelType = 'Petrol';
    }
    // Heavy Commercial / Volvo Bus
    else if (make.includes('commercial') || model.includes('truck') || model.includes('bus') || make.includes('leyland') || make.includes('bharat') || make.includes('force')) {
      specs = {
        compressor: 'Sanden Heavy Duty Compressor',
        refrigerant: 'R-134a (950 ± 50g)',
        oil: 'PAG 100 (220 ml)',
        belt: '8PK1540',
        pollenFilter: '280 x 240 x 35 mm'
      };
      engine = 'Cummins Heavy Duty Diesel';
      fuelType = 'Diesel';
    }

    return { specs, fuelType, engine };
  };

  const handleVehicleSearch = () => {
    if (!selectedMake || !selectedModel) return;

    setSelectedHotspot(null);
    setVinResult('loading');
    
    setTimeout(() => {
      const resolved = resolveVehicleDetails(selectedMake, selectedModel);
      const { specs, fuelType, engine } = resolveVehicleSpecs(selectedMake, selectedModel);
      
      let finalCompatIds = [1, 2, 25, 45, 125, 135, 165, 175, 256, 306, 376, 386];
      if (resolved.diagramId === 'fortuner-hvac' || resolved.diagramId === 'bus-hvac' || resolved.diagramId === 'truck-hvac' || resolved.diagramId === 'dozer-hvac' || resolved.diagramId === 'lcv-hvac') {
        finalCompatIds = [5, 7, 8, 12, 15, 16, 17];
      }

      setVinResult({
        make: selectedMake,
        model: selectedModel,
        year: selectedYear || '2022',
        engine,
        fuelType,
        chassis: 'N/A (Searched via Selector)',
        region: 'Selected via Finder Wizard',
        specs,
        compatiblePartIds: finalCompatIds,
        diagramId: resolved.diagramId,
        vehicleImage: resolved.vehicleImage
      });

      // Scroll down to the results section smoothly
      const resultsEl = document.getElementById('vehicle-wizard-results-anchor');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };
  const [showBanner, setShowBanner] = useState(false);
  const [bannerImage, setBannerImage] = useState('');

  useEffect(() => {
    async function loadBanner() {
      try {
        const banner = await dbService.getSiteBanner();
        setShowBanner(banner.showBanner);
        setBannerImage(banner.bannerImage);
      } catch (err) {
        console.error('Failed to load banner settings:', err);
      }
    }
    loadBanner();
  }, []);

  useSEO('Home', "Welcome to RCS (Rameswar Cool Spares) - India's premier distributor of automotive AC spare parts, compressors, condensers, and cooling coils.");

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [catOpen, setCatOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState('products');
  
  const [vinQuery, setVinQuery] = useState('');
  const [vinResult, setVinResult] = useState(null);
  const [vinError, setVinError] = useState(null);
  const [showVinGuide, setShowVinGuide] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [plateForm, setPlateForm] = useState({
    name: '',
    product: '',
    regNumber: '',
    vin: '',
    phone: ''
  });

  // Visual part upload states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imageDesc, setImageDesc] = useState('');
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageUploadErr, setImageUploadErr] = useState('');
  const [imageDragActive, setImageDragActive] = useState(false);
  const imageInputRef = useRef(null);

  const categoryRef = useRef(null);
  const suggestionsRef = useRef(null);

  const resolveLocalFallback = (makeName, modelName) => {
    const make = makeName.toLowerCase();
    const model = modelName.toLowerCase();

    // 1. Specific model overrides
    if (model.includes('hector')) return '/vehicles/hector.png';
    if (model.includes('carens')) return '/vehicles/carens.png';
    if (model.includes('ertiga')) return '/vehicles/ertiga.png';
    if (model.includes('scorpio')) return '/vehicles/scorpio.png';
    if (model.includes('dzire')) return '/vehicles/dzire.png';
    if (model.includes('wagonr')) return '/vehicles/wagonr.png';
    if (model.includes('venue')) return '/vehicles/venue.png';
    if (model.includes('baleno')) return '/vehicles/baleno.png';
    if (model.includes('safari')) return '/vehicles/safari.png';
    if (model.includes('kushaq')) return '/vehicles/kushaq.png';
    if (model.includes('comet')) return '/vehicles/comet.png';
    if (model.includes('verna')) return '/vehicles/verna.png';
    if (model.includes('city') && !model.includes('intercity')) return '/vehicles/city.png';
    if (model.includes('amaze')) return '/vehicles/amaze.png';
    if (model.includes('harrier')) return '/vehicles/harrier.png';
    if (model.includes('brezza')) return '/vehicles/brezza.png';
    if (model.includes('seltos')) return '/vehicles/seltos.png';
    if (model.includes('corolla')) return '/vehicles/corolla.png';
    if (model.includes('kwid')) return '/vehicles/kwid.png';
    if (model.includes('duster')) return '/vehicles/duster.png';
    if (model.includes('i20')) return '/vehicles/i20.png';
    if (model.includes('slavia')) return '/vehicles/slavia.png';
    if (model.includes('virtus')) return '/vehicles/virtus.png';
    if (model.includes('creta')) return '/vehicles/creta.png';
    if (model.includes('fortuner')) return '/vehicles/fortuner.png';
    if (model.includes('thar')) return '/vehicles/thar.png';
    if (model.includes('nexon')) return '/vehicles/nexon.png';
    if (model.includes('swift')) return '/vehicles/swift.png';
    if (model.includes('innova')) return '/vehicles/innova.png';
    if (model.includes('octavia')) return '/vehicles/octavia.jpg';
    if (model.includes('superb')) return '/vehicles/superb.jpg';
    if (model.includes('a3')) return '/vehicles/audi_a3.png';
    if (model.includes('endeavour')) return '/vehicles/endeavour.png';
    if (model.includes('bada dost')) return '/vehicles/bada_dost.png';
    if (model.includes('dost') || model === 'ace' || model.startsWith('ace ') || model.endsWith(' ace')) return '/vehicles/dost.png';
    if (model.includes('signa')) return '/vehicles/signa.png';
    if (model.includes('ultra')) return '/vehicles/ultra.png';
    if (model.includes('u-truck') || model.includes('u truck')) return '/vehicles/u_truck.png';
    if (model.includes('prima')) return '/vehicles/prima.png';
    if (model.includes('oyster')) return '/vehicles/oyster.png';
    if (model.includes('viking')) return '/vehicles/viking.png';
    if (model.includes('9400')) return '/vehicles/volvo_9400.png';
    if (model.includes('9600')) return '/vehicles/volvo_9600.png';
    if (model.includes('traveller')) return '/vehicles/traveller.png';
    if (model.includes('gurkha')) return '/vehicles/gurkha.png';
    if (model.includes('citiline')) return '/vehicles/citiline.png';

    // 2. Class-based overrides & Brand-aware fallbacks
    // If the model is a known heavy truck/bus/commercial, return commercial vehicles:
    if (make.includes('commercial') || model.includes('truck') || model.includes('bus') || make.includes('leyland') || make.includes('bharat') || make.includes('force')) {
      if (model.includes('dost')) return '/vehicles/dost.png';
      if (model.includes('bada dost')) return '/vehicles/bada_dost.png';
      if (model.includes('signa')) return '/vehicles/signa.png';
      if (model.includes('ultra')) return '/vehicles/ultra.png';
      if (model.includes('u-truck') || model.includes('u truck')) return '/vehicles/u_truck.png';
      if (model.includes('prima')) return '/vehicles/prima.png';
      if (model.includes('oyster')) return '/vehicles/oyster.png';
      if (model.includes('viking')) return '/vehicles/viking.png';
      if (model.includes('9400')) return '/vehicles/volvo_9400.png';
      if (model.includes('9600')) return '/vehicles/volvo_9600.png';
      if (model.includes('traveller')) return '/vehicles/traveller.png';
      if (model.includes('gurkha')) return '/vehicles/gurkha.png';
      if (model.includes('citiline')) return '/vehicles/citiline.png';
      return '/vehicles/prima.png';
    }

    // Hatchbacks fallback
    if (model.includes('swift') || model.includes('wagonr') || model.includes('alto') || model.includes('celerio') || model.includes('ignis') || model.includes('s-presso') || model.includes('i10') || model.includes('santro') || model.includes('jazz') || model.includes('tiago') || model.includes('altroz') || model.includes('glanza') || model.includes('comet') || model.includes('polo') || model.includes('micra') || model.includes('kwid') || model.includes('figo') || model.includes('beat') || model.includes('spark') || model.includes('hatchback')) {
      if (make.includes('suzuki') || make.includes('maruti')) return '/vehicles/swift.png';
      if (make.includes('hyundai')) return '/vehicles/i20.png';
      return '/vehicles/hatchback.png';
    }

    // Sedans fallback
    if (model.includes('dzire') || model.includes('ciaz') || model.includes('aura') || model.includes('verna') || model.includes('city') || model.includes('amaze') || model.includes('civic') || model.includes('tigor') || model.includes('corolla') || model.includes('camry') || model.includes('slavia') || model.includes('octavia') || model.includes('superb') || model.includes('vento') || model.includes('virtus') || model.includes('jetta') || model.includes('passat') || model.includes('series') || model.includes('a3') || model.includes('a4') || model.includes('a6') || model.includes('a8') || model.includes('c-class') || model.includes('e-class') || model.includes('s-class') || model.includes('xe') || model.includes('xf') || model.includes('xj') || model.includes('sunny') || model.includes('cruze') || model.includes('sail') || model.includes('s60') || model.includes('s90') || model.includes('sedan')) {
      if (make.includes('audi')) return '/vehicles/audi_a4.png';
      if (make.includes('bmw')) return '/vehicles/bmw_3series.png';
      if (make.includes('mercedes')) return '/vehicles/mercedes_cclass.png';
      if (make.includes('suzuki') || make.includes('maruti')) return '/vehicles/dzire.png';
      return '/vehicles/sedan.png';
    }

    // Luxury Brands & Sports Cars fallback (supercars, luxury sedans, sports cars)
    if (make.includes('ferrari') || make.includes('lamborghini') || make.includes('porsche') || make.includes('bugatti') || make.includes('aston') || make.includes('bentley') || make.includes('rolls') || make.includes('maserati') || make.includes('lexus') || model.includes('mustang') || model.includes('z4') || model.includes('cooper') || model.includes('f-type')) {
      if (make.includes('ferrari') || make.includes('lamborghini') || make.includes('porsche') || make.includes('bugatti') || model.includes('z4') || model.includes('f-type')) {
        return '/vehicles/bmw_3series.png'; // Premium sporty car fallback
      }
      return '/vehicles/sedan.png'; // Premium sedan fallback
    }

    // Brand-aware SUV fallbacks (if it's not a sedan/hatchback/commercial, it's an SUV/MPV)
    if (make.includes('kia')) {
      return '/vehicles/seltos.png';
    }
    if (make.includes('hyundai')) {
      return '/vehicles/creta.png';
    }
    if (make.includes('suzuki') || make.includes('maruti')) {
      return '/vehicles/brezza.png';
    }
    if (make.includes('tata')) {
      return '/vehicles/nexon.png';
    }
    if (make.includes('mahindra')) {
      return '/vehicles/scorpio_n.png';
    }
    if (make.includes('toyota')) {
      return '/vehicles/fortuner.png';
    }
    if (make.includes('mg')) {
      return '/vehicles/hector.png';
    }
    if (make.includes('audi')) {
      return '/vehicles/audi_q5.png';
    }
    if (make.includes('bmw')) {
      return '/vehicles/bmw_x3.png';
    }
    if (make.includes('mercedes')) {
      return '/vehicles/mercedes_glc.png';
    }
    if (make.includes('skoda') || make.includes('volkswagen') || make.includes('vw')) {
      return '/vehicles/kushaq.png';
    }
    if (make.includes('land') || make.includes('range')) {
      return '/vehicles/range_rover_evoque.png';
    }
    if (make.includes('jeep')) {
      return '/vehicles/jeep_compass.png';
    }
    if (make.includes('ford')) {
      return '/vehicles/endeavour.png';
    }

    // Absolute fallback
    return '/vehicles/creta.png';
  };

  const handleImageError = (e, make, model) => {
    e.target.onerror = null;
    e.target.src = resolveLocalFallback(make, model);
  };

  const resolveVehicleDetails = (makeName, modelName) => {
    const make = makeName.toLowerCase();
    const model = modelName.toLowerCase();
    
    let diagramId = 'ac-system-exploded';
    let vehicleImage = '/vehicles/swift.png';
    
    // 1. Resolve Diagram ID
    if (model.includes('dozer') || model.includes('bulldozer') || make.includes('dozer') || make.includes('bulldozer')) {
      diagramId = 'dozer-hvac';
    } else if (model.includes('bus') || model.includes('starbus') || model.includes('oyster') || model.includes('viking') || make.includes('volvo')) {
      diagramId = 'bus-hvac';
    } else if (model.includes('dost') || model.includes('bada dost') || model.includes('ace') || model.includes('supro') || model.includes('traveller') || model.includes('pikup') || model.includes('pik-up')) {
      diagramId = 'lcv-hvac';
    } else if (make.includes('commercial') || model.includes('truck') || model.includes('prima') || model.includes('signa') || model.includes('ultra') || make.includes('leyland') || make.includes('bharat') || make.includes('force')) {
      diagramId = 'truck-hvac';
    }
    
    if (model.includes('hector')) {
      vehicleImage = '/vehicles/hector.png';
    } else if (model.includes('carens')) {
      vehicleImage = '/vehicles/carens.png';
    } else if (model.includes('ertiga')) {
      vehicleImage = '/vehicles/ertiga.png';
    } else if (model.includes('scorpio-n')) {
      vehicleImage = '/vehicles/scorpio_n.png';
    } else if (model.includes('scorpio classic')) {
      vehicleImage = '/vehicles/scorpio_classic.png';
    } else if (model.includes('scorpio')) {
      vehicleImage = '/vehicles/scorpio.png';
    } else if (model.includes('dzire')) {
      vehicleImage = '/vehicles/dzire.png';
    } else if (model.includes('wagonr')) {
      vehicleImage = '/vehicles/wagonr.png';
    } else if (model.includes('venue')) {
      vehicleImage = '/vehicles/venue.png';
    } else if (model.includes('baleno')) {
      vehicleImage = '/vehicles/baleno.png';
    } else if (model.includes('safari')) {
      vehicleImage = '/vehicles/safari.png';
    } else if (model.includes('kushaq')) {
      vehicleImage = '/vehicles/kushaq.png';
    } else if (model.includes('comet')) {
      vehicleImage = '/vehicles/comet.png';
    } else if (model.includes('verna')) {
      vehicleImage = '/vehicles/verna.png';
    } else if (model.includes('city')) {
      vehicleImage = '/vehicles/city.png';
    } else if (model.includes('amaze')) {
      vehicleImage = '/vehicles/amaze.png';
    } else if (model.includes('harrier')) {
      vehicleImage = '/vehicles/harrier.png';
    } else if (model.includes('brezza')) {
      vehicleImage = '/vehicles/brezza.png';
    } else if (model.includes('seltos')) {
      vehicleImage = '/vehicles/seltos.png';
    } else if (model.includes('corolla')) {
      vehicleImage = '/vehicles/corolla.png';
    } else if (model.includes('kwid')) {
      vehicleImage = '/vehicles/kwid.png';
    } else if (model.includes('duster')) {
      vehicleImage = '/vehicles/duster.png';
    } else if (model.includes('i20')) {
      vehicleImage = '/vehicles/i20.png';
    } else if (make.includes('audi') && model.includes('a3')) {
      vehicleImage = '/vehicles/audi_a3.png';
    } else if (make.includes('audi') && model.includes('a4')) {
      vehicleImage = '/vehicles/audi_a4.png';
    } else if (make.includes('audi') && model.includes('a6')) {
      vehicleImage = '/vehicles/audi_a6.png';
    } else if (make.includes('audi') && model.includes('a8')) {
      vehicleImage = '/vehicles/audi_a8l.png';
    } else if (make.includes('audi') && model.includes('q3')) {
      vehicleImage = '/vehicles/audi_q3.png';
    } else if (make.includes('audi') && model.includes('q5')) {
      vehicleImage = '/vehicles/audi_q5.png';
    } else if (make.includes('audi') && model.includes('q7')) {
      vehicleImage = '/vehicles/audi_q7.png';
    } else if (make.includes('audi') && model.includes('q8')) {
      vehicleImage = '/vehicles/audi_q8.png';
    } else if (make.includes('audi') && (model.includes('e-tron') || model.includes('etron'))) {
      vehicleImage = '/vehicles/audi_etron.png';
    } else if (model.includes('2 series')) {
      vehicleImage = '/vehicles/bmw_2series.png';
    } else if (model.includes('3 series')) {
      vehicleImage = '/vehicles/bmw_3series.png';
    } else if (model.includes('5 series')) {
      vehicleImage = '/vehicles/bmw_5series.png';
    } else if (model.includes('6 series')) {
      vehicleImage = '/vehicles/bmw_6series_gt.png';
    } else if (model.includes('7 series')) {
      vehicleImage = '/vehicles/bmw_7series.png';
    } else if (model.includes('x1')) {
      vehicleImage = '/vehicles/bmw_x1.png';
    } else if (model.includes('x3')) {
      vehicleImage = '/vehicles/bmw_x3.png';
    } else if (model.includes('x4')) {
      vehicleImage = '/vehicles/bmw_x4.png';
    } else if (model.includes('x5')) {
      vehicleImage = '/vehicles/bmw_x5.png';
    } else if (model.includes('x7')) {
      vehicleImage = '/vehicles/bmw_x7.png';
    } else if (model.includes('z4')) {
      vehicleImage = '/vehicles/bmw_z4.png';
    } else if (model.includes('ix')) {
      vehicleImage = '/vehicles/bmw_ix.png';
    } else if (model.includes('i4')) {
      vehicleImage = '/vehicles/bmw_i4.png';
    } else if (model.includes('a-class')) {
      vehicleImage = '/vehicles/mercedes_aclass.png';
    } else if (model.includes('c-class')) {
      vehicleImage = '/vehicles/mercedes_cclass.png';
    } else if (model.includes('e-class')) {
      vehicleImage = '/vehicles/mercedes_eclass.png';
    } else if (model.includes('s-class')) {
      vehicleImage = '/vehicles/mercedes_sclass.png';
    } else if (model === 'gla' || (model.includes('gla') && !model.includes('glanza'))) {
      vehicleImage = '/vehicles/mercedes_gla.png';
    } else if (model.includes('glc')) {
      vehicleImage = '/vehicles/mercedes_glc.png';
    } else if (model.includes('gle') && !model.includes('wrangler')) {
      vehicleImage = '/vehicles/mercedes_gle.png';
    } else if (model.includes('gls')) {
      vehicleImage = '/vehicles/mercedes_gls.png';
    } else if (model.includes('g-class') || model.includes('g class') || model === 'g') {
      vehicleImage = '/vehicles/mercedes_gclass.png';
    } else if (model.includes('eqs')) {
      vehicleImage = '/vehicles/mercedes_eqs.png';
    } else if (model.includes('evoque') || model.includes('range rover') || model.includes('defender') || model.includes('discovery')) {
      vehicleImage = '/vehicles/range_rover_evoque.png';
    } else if (model.includes('compass') || model.includes('meridian')) {
      vehicleImage = '/vehicles/jeep_compass.png';
    } else if (model.includes('celerio')) {
      vehicleImage = '/vehicles/celerio.png';
    } else if (model.includes('grand i10')) {
      vehicleImage = '/vehicles/grand_i10.png';
    } else if (model.includes('ciaz')) {
      vehicleImage = '/vehicles/ciaz.png';
    } else if (model.includes('sonet')) {
      vehicleImage = '/vehicles/kia_sonet.png';
    } else if (model.includes('xuv700')) {
      vehicleImage = '/vehicles/xuv700.png';
    } else if (model.includes('xuv300') || model.includes('xuv 3xo') || model.includes('3xo')) {
      vehicleImage = '/vehicles/mahindra_xuv_3xo.png';
    } else if (model.includes('bolero neo')) {
      vehicleImage = '/vehicles/bolero_neo.png';
    } else if (model.includes('bolero')) {
      vehicleImage = '/vehicles/bolero.png';
    } else if (model.includes('punch')) {
      vehicleImage = '/vehicles/tata_punch.png';
    } else if (model.includes('altroz')) {
      vehicleImage = '/vehicles/tata_altroz.png';
    } else if (model.includes('glanza')) {
      vehicleImage = '/vehicles/toyota_glanza.png';
    } else if (model.includes('taigun')) {
      vehicleImage = '/vehicles/vw_taigun.png';
    } else if (model.includes('exter')) {
      vehicleImage = '/vehicles/hyundai_exter.png';
    } else if (model.includes('fronx')) {
      vehicleImage = '/vehicles/fronx.png';
    } else if (model.includes('alto')) {
      vehicleImage = '/vehicles/alto.png';
    } else if (model.includes('grand vitara') || model.includes('vitara')) {
      vehicleImage = '/vehicles/grand_vitara.png';
    } else if (model.includes('jimny')) {
      vehicleImage = '/vehicles/jimny.png';
    } else if (model.includes('elevate')) {
      vehicleImage = '/vehicles/honda_elevate.png';
    } else if (model.includes('hyryder')) {
      vehicleImage = '/vehicles/toyota_hyryder.png';
    } else if (model.includes('tiago')) {
      vehicleImage = '/vehicles/tata_tiago.png';
    } else if (model.includes('tigor')) {
      vehicleImage = '/vehicles/tata_tigor.png';
    } else if (model.includes('curvv')) {
      vehicleImage = '/vehicles/tata_curvv.png';
    } else if (model.includes('aura')) {
      vehicleImage = '/vehicles/hyundai_aura.png';
    } else if (model.includes('ignis')) {
      vehicleImage = '/vehicles/maruti_ignis.png';
    } else if (model.includes('s-presso') || model.includes('spresso')) {
      vehicleImage = '/vehicles/maruti_spresso.png';
    } else if (model.includes('hexa')) {
      vehicleImage = '/vehicles/tata_hexa.png';
    } else if (model.includes('xl6')) {
      vehicleImage = '/vehicles/maruti_xl6.png';
    } else if (model.includes('eeco')) {
      vehicleImage = '/vehicles/maruti_eeco.png';
    } else if (model.includes('tucson')) {
      vehicleImage = '/vehicles/hyundai_tucson.png';
    } else if (model.includes('alcazar')) {
      vehicleImage = '/vehicles/hyundai_alcazar.png';
    } else if (model.includes('ioniq 5') || model.includes('ioniq5')) {
      vehicleImage = '/vehicles/hyundai_ioniq5.png';
    } else if (model.includes('santro')) {
      vehicleImage = '/vehicles/hyundai_santro.png';
    } else if (model.includes('invicto')) {
      vehicleImage = '/vehicles/maruti_invicto.png';
    } else if (model.includes('jazz')) {
      vehicleImage = '/vehicles/honda_jazz.png';
    } else if (model.includes('wr-v') || model.includes('wrv')) {
      vehicleImage = '/vehicles/honda_wrv.png';
    } else if (model.includes('ev6')) {
      vehicleImage = '/vehicles/kia_ev6.png';
    } else if (model.includes('ev9')) {
      vehicleImage = '/vehicles/kia_ev9.png';
    } else if (model.includes('hilux')) {
      vehicleImage = '/vehicles/toyota_hilux.png';
    } else if (model.includes('kodiaq')) {
      vehicleImage = '/vehicles/skoda_kodiaq.png';
    } else if (model.includes('legender')) {
      vehicleImage = '/vehicles/toyota_legender.png';
    } else if (model.includes('civic')) {
      vehicleImage = '/vehicles/honda_civic.png';
    } else if (model.includes('astor')) {
      vehicleImage = '/vehicles/mg_astor.png';
    } else if (model.includes('zs ev') || model.includes('zsev')) {
      vehicleImage = '/vehicles/mg_zsev.png';
    } else if (model.includes('gloster')) {
      vehicleImage = '/vehicles/mg_gloster.png';
    } else if (model.includes('carnival')) {
      vehicleImage = '/vehicles/kia_carnival.png';
    } else if (model.includes('polo')) {
      vehicleImage = '/vehicles/vw_polo.png';
    } else if (model.includes('vento')) {
      vehicleImage = '/vehicles/vw_vento.png';
    } else if (model.includes('jetta')) {
      vehicleImage = '/vehicles/vw_jetta.png';
    } else if (model.includes('tiguan')) {
      vehicleImage = '/vehicles/vw_tiguan.png';
    } else if (model.includes('passat')) {
      vehicleImage = '/vehicles/vw_passat.png';
    } else if (model.includes('sunny')) {
      vehicleImage = '/vehicles/nissan_sunny.png';
    } else if (model.includes('terrano')) {
      vehicleImage = '/vehicles/nissan_terrano.png';
    } else if (model.includes('magnite')) {
      vehicleImage = '/vehicles/nissan_magnite.png';
    } else if (model.includes('x-trail') || model.includes('xtrail')) {
      vehicleImage = '/vehicles/nissan_xtrail.png';
    } else if (model.includes('micra')) {
      vehicleImage = '/vehicles/nissan_micra.png';
    } else if (model.includes('vellfire')) {
      vehicleImage = '/vehicles/toyota_vellfire.png';
    } else if (model.includes('urban cruiser') || model.includes('urban_cruiser')) {
      vehicleImage = '/vehicles/toyota_urban_cruiser.png';
    } else if (model.includes('camry')) {
      vehicleImage = '/vehicles/toyota_camry.png';
    } else if (model.includes('land cruiser') || model.includes('land_cruiser')) {
      vehicleImage = '/vehicles/toyota_land_cruiser.png';
    } else if (model === 'xe' && make.includes('jaguar')) {
      vehicleImage = '/vehicles/jaguar_xe.png';
    } else if (model === 'xf' && make.includes('jaguar')) {
      vehicleImage = '/vehicles/jaguar_xf.png';
    } else if (model === 'xj' && make.includes('jaguar')) {
      vehicleImage = '/vehicles/jaguar_xj.png';
    } else if ((model.includes('f-type') || model.includes('ftype')) && make.includes('jaguar')) {
      vehicleImage = '/vehicles/jaguar_ftype.png';
    } else if (model.includes('f-pace') || model.includes('fpace')) {
      vehicleImage = '/vehicles/jaguar_fpace.png';
    } else if (model.includes('i-pace') || model.includes('ipace')) {
      vehicleImage = '/vehicles/jaguar_ipace.png';
    } else if (model.includes('endeavour')) {
      vehicleImage = '/vehicles/endeavour.png';
    } else if (model.includes('ecosport')) {
      vehicleImage = '/vehicles/ford_ecosport.png';
    } else if (model.includes('figo')) {
      vehicleImage = '/vehicles/ford_figo.png';
    } else if (model.includes('mustang')) {
      vehicleImage = '/vehicles/ford_mustang.png';
    } else if (model.includes('slavia')) {
      vehicleImage = '/vehicles/slavia.png';
    } else if (model.includes('virtus')) {
      vehicleImage = '/vehicles/virtus.png';
    } else if (model.includes('beat')) {
      vehicleImage = '/vehicles/chevrolet_beat.png';
    } else if (model.includes('spark')) {
      vehicleImage = '/vehicles/chevrolet_spark.png';
    } else if (model.includes('sail')) {
      vehicleImage = '/vehicles/chevrolet_sail.png';
    } else if (model.includes('cruze')) {
      vehicleImage = '/vehicles/chevrolet_cruze.png';
    } else if (model.includes('tavera')) {
      vehicleImage = '/vehicles/chevrolet_tavera.png';
    } else if (model.includes('enjoy')) {
      vehicleImage = '/vehicles/chevrolet_enjoy.png';
    } else if (model.includes('captiva')) {
      vehicleImage = '/vehicles/chevrolet_captiva.png';
    } else if (model.includes('es') && make.includes('lexus')) {
      vehicleImage = '/vehicles/lexus_es.png';
    } else if (model.includes('nx') && make.includes('lexus')) {
      vehicleImage = '/vehicles/lexus_nx.png';
    } else if (model.includes('rx') && make.includes('lexus')) {
      vehicleImage = '/vehicles/lexus_rx.png';
    } else if (model.includes('lx') && make.includes('lexus')) {
      vehicleImage = '/vehicles/lexus_lx.png';
    } else if (model.includes('ls') && make.includes('lexus')) {
      vehicleImage = '/vehicles/lexus_ls.png';
    } else if (model.includes('triber')) {
      vehicleImage = '/vehicles/renault_triber.png';
    } else if (model.includes('kiger')) {
      vehicleImage = '/vehicles/renault_kiger.png';
    } else if (model.includes('pajero')) {
      vehicleImage = '/vehicles/mitsubishi_pajero.png';
    } else if (model.includes('lancer')) {
      vehicleImage = '/vehicles/mitsubishi_lancer.png';
    } else if (model.includes('outlander')) {
      vehicleImage = '/vehicles/mitsubishi_outlander.png';
    } else if (model.includes('d-max') || model.includes('dmax')) {
      vehicleImage = '/vehicles/isuzu_dmax.png';
    } else if (model.includes('v-cross') || model.includes('vcross')) {
      vehicleImage = '/vehicles/isuzu_vcross.png';
    } else if (model.includes('mu-x') || model.includes('mux')) {
      vehicleImage = '/vehicles/isuzu_mux.png';
    } else if (model.includes('c5 aircross') || model.includes('c5_aircross')) {
      vehicleImage = '/vehicles/citroen_c5_aircross.png';
    } else if (model.includes('c3 aircross') || model.includes('c3_aircross')) {
      vehicleImage = '/vehicles/citroen_c3_aircross.png';
    } else if (model.includes('c3')) {
      vehicleImage = '/vehicles/citroen_c3.png';
    } else if (model.includes('creta')) {
      vehicleImage = '/vehicles/creta.png';
    } else if (model.includes('fortuner')) {
      vehicleImage = '/vehicles/fortuner.png';
    } else if (model.includes('thar roxx') || model.includes('roxx')) {
      vehicleImage = '/vehicles/thar_roxx.png';
    } else if (model.includes('thar')) {
      vehicleImage = '/vehicles/thar.png';
    } else if (model.includes('nexon')) {
      vehicleImage = '/vehicles/nexon.png';
    } else if (model.includes('swift')) {
      vehicleImage = '/vehicles/swift.png';
    } else if (model.includes('innova')) {
      vehicleImage = '/vehicles/innova.png';
    } else if (model.includes('octavia')) {
      vehicleImage = '/vehicles/octavia.jpg';
    } else if (model.includes('superb')) {
      vehicleImage = '/vehicles/superb.jpg';
    } else if (model.includes('bada dost')) {
      vehicleImage = '/vehicles/bada_dost.png';
    } else if (model.includes('dost') || model === 'ace' || model.startsWith('ace ') || model.endsWith(' ace')) {
      vehicleImage = '/vehicles/dost.png';
    } else if (model.includes('signa')) {
      vehicleImage = '/vehicles/signa.png';
    } else if (model.includes('ultra')) {
      vehicleImage = '/vehicles/ultra.png';
    } else if (model.includes('u-truck') || model.includes('u truck')) {
      vehicleImage = '/vehicles/u_truck.png';
    } else if (model.includes('2823c') || (make.includes('bharat') && model.includes('tipper'))) {
      vehicleImage = '/vehicles/bharatbenz_tipper.png';
    } else if (model.includes('1917r') || (make.includes('bharat') && model.includes('cargo'))) {
      vehicleImage = '/vehicles/bharatbenz_cargo.png';
    } else if (model.includes('5528tt') || (make.includes('bharat') && model.includes('tractor'))) {
      vehicleImage = '/vehicles/bharatbenz_tractor.png';
    } else if (model.includes('prima') || model.includes('truck') || make.includes('bharat') || make.includes('leyland') && (model.includes('tipper') || model.includes('cargo') || model.includes('tractor'))) {
      vehicleImage = '/vehicles/prima.png';
    } else if (model.includes('oyster')) {
      vehicleImage = '/vehicles/oyster.png';
    } else if (model.includes('viking')) {
      vehicleImage = '/vehicles/viking.png';
    } else if (model.includes('xc90') && make.includes('volvo')) {
      vehicleImage = '/vehicles/volvo_xc90.png';
    } else if (model.includes('xc60') && make.includes('volvo')) {
      vehicleImage = '/vehicles/volvo_xc60.png';
    } else if (model.includes('xc40') && make.includes('volvo')) {
      vehicleImage = '/vehicles/volvo_xc40.png';
    } else if (model.includes('c40') && make.includes('volvo')) {
      vehicleImage = '/vehicles/volvo_c40.png';
    } else if (model.includes('s60') && make.includes('volvo')) {
      vehicleImage = '/vehicles/volvo_s60.png';
    } else if (model.includes('s90') && make.includes('volvo')) {
      vehicleImage = '/vehicles/volvo_s90.png';
    } else if (model.includes('9400')) {
      vehicleImage = '/vehicles/volvo_9400.png';
    } else if (model.includes('9600')) {
      vehicleImage = '/vehicles/volvo_9600.png';
    } else if (model.includes('volvo') || model.includes('bus') || model.includes('starbus')) {
      vehicleImage = '/vehicles/volvo_bus.png';
    } else if (model.includes('traveller')) {
      vehicleImage = '/vehicles/traveller.png';
    } else if (model.includes('gurkha')) {
      vehicleImage = '/vehicles/gurkha.png';
    } else if (model.includes('citiline')) {
      vehicleImage = '/vehicles/citiline.png';
    } else if (model.includes('911') && make.includes('porsche')) {
      vehicleImage = '/vehicles/porsche_911.png';
    } else if (model.includes('cayenne') && make.includes('porsche')) {
      vehicleImage = '/vehicles/porsche_cayenne.png';
    } else if (model.includes('macan') && make.includes('porsche')) {
      vehicleImage = '/vehicles/porsche_macan.png';
    } else if (model.includes('panamera') && make.includes('porsche')) {
      vehicleImage = '/vehicles/porsche_panamera.png';
    } else if (model.includes('taycan') && make.includes('porsche')) {
      vehicleImage = '/vehicles/porsche_taycan.png';
    } else if (model.includes('ghost') && make.includes('rolls')) {
      vehicleImage = '/vehicles/rolls_royce_ghost.png';
    } else if (model.includes('phantom') && make.includes('rolls')) {
      vehicleImage = '/vehicles/rolls_royce_phantom.png';
    } else if (model.includes('cullinan') && make.includes('rolls')) {
      vehicleImage = '/vehicles/rolls_royce_cullinan.png';
    } else if (model.includes('spectre') && make.includes('rolls')) {
      vehicleImage = '/vehicles/rolls_royce_spectre.png';
    } else if (model.includes('roma') && make.includes('ferrari')) {
      vehicleImage = '/vehicles/ferrari_roma.png';
    } else if ((model.includes('296') || model.includes('gtb')) && make.includes('ferrari')) {
      vehicleImage = '/vehicles/ferrari_296_gtb.png';
    } else if ((model.includes('f8') || model.includes('tributo')) && make.includes('ferrari')) {
      vehicleImage = '/vehicles/ferrari_f8_tributo.png';
    } else if (model.includes('purosangue') && make.includes('ferrari')) {
      vehicleImage = '/vehicles/ferrari_purosangue.png';
    } else if (model.includes('huracan') && make.includes('lamborghini')) {
      vehicleImage = '/vehicles/lamborghini_huracan.png';
    } else if (model.includes('urus') && make.includes('lamborghini')) {
      vehicleImage = '/vehicles/lamborghini_urus.png';
    } else if (model.includes('revuelto') && make.includes('lamborghini')) {
      vehicleImage = '/vehicles/lamborghini_revuelto.png';
    } else if (model.includes('continental') && make.includes('bentley')) {
      vehicleImage = '/vehicles/bentley_continental_gt.png';
    } else if (model.includes('flying spur') && make.includes('bentley')) {
      vehicleImage = '/vehicles/bentley_flying_spur.png';
    } else if (model.includes('bentayga') && make.includes('bentley')) {
      vehicleImage = '/vehicles/bentley_bentayga.png';
    } else if (model.includes('vantage') && make.includes('aston')) {
      vehicleImage = '/vehicles/aston_martin_vantage.png';
    } else if (model.includes('db11') && make.includes('aston')) {
      vehicleImage = '/vehicles/aston_martin_db11.png';
    } else if (model.includes('dbs') && make.includes('aston')) {
      vehicleImage = '/vehicles/aston_martin_dbs.png';
    } else if (model.includes('dbx') && make.includes('aston')) {
      vehicleImage = '/vehicles/aston_martin_dbx.png';
    } else if (model.includes('cooper') && make.includes('mini')) {
      vehicleImage = '/vehicles/mini_cooper.png';
    } else if (model.includes('countryman') && make.includes('mini')) {
      vehicleImage = '/vehicles/mini_countryman.png';
    } else if (model.includes('clubman') && make.includes('mini')) {
      vehicleImage = '/vehicles/mini_clubman.png';
    } else if (model.includes('ghibli') && make.includes('maserati')) {
      vehicleImage = '/vehicles/maserati_ghibli.png';
    } else if (model.includes('quattroporte') && make.includes('maserati')) {
      vehicleImage = '/vehicles/maserati_quattroporte.png';
    } else if (model.includes('levante') && make.includes('maserati')) {
      vehicleImage = '/vehicles/maserati_levante.png';
    } else if (model.includes('grecale') && make.includes('maserati')) {
      vehicleImage = '/vehicles/maserati_levante.png';
    } else {
      // Use local fallback category renders to ensure no carwow watermarks or external dependencies
      vehicleImage = resolveLocalFallback(makeName, modelName);
    }
    return { diagramId, vehicleImage };
  };

  const decodeVin = async (vinToDecode) => {
    const query = (vinToDecode || vinQuery).trim().toUpperCase();
    if (!query) {
      setVinError('Please enter a Plate Number.');
      setVinResult(null);
      return;
    }

    // Detect if the query is an Indian RTO License Plate or 17-digit Chassis VIN
    const isPlate = query.length <= 11 && /^[A-Z]{2}[0-9]/i.test(query);
    const cleanQuery = query.replace(isPlate ? /[^A-Z0-9]/gi : /[^A-HJ-NPR-Z0-9]/gi, '');

    if (cleanQuery.length < 5) {
      setVinError('Invalid format. Please enter a valid Plate Number.');
      setVinResult(null);
      return;
    }

    setVinError(null);
    setVinResult('loading'); // Show spinner
    setSelectedHotspot(null); // Reset active hotspot selection

    const samples = {
      // 17-digit Chassis Matches
      'MA3FDB91S00109283': {
        make: 'Maruti Suzuki',
        model: 'Swift VXI',
        year: '2021',
        engine: '1.2L K12N DualJet Petrol',
        fuelType: 'Petrol',
        chassis: 'MA3FDB91S00109283',
        region: 'India (MSIL Plant)',
        specs: {
          compressor: 'Subros / Denso 10S11C',
          refrigerant: 'R-134a (370 ± 20g)',
          oil: 'PAG 46 (80 ml)',
          belt: '6PK1150',
          pollenFilter: '210 x 200 x 29 mm'
        },
        compatiblePartIds: [1, 2, 25, 45, 125, 135, 165, 175, 256, 306, 376, 386, 15, 16, 17],
        diagramId: 'ac-system-exploded',
        vehicleImage: '/vehicles/swift.png'
      },
      'MALCN81CPKM109482': {
        make: 'Hyundai',
        model: 'Creta SX',
        year: '2022',
        engine: '1.5L CRDi Diesel',
        fuelType: 'Diesel',
        chassis: 'MALCN81CPKM109482',
        region: 'India (Chennai HMIL Plant)',
        specs: {
          compressor: 'Hanon/Doowon DV16',
          refrigerant: 'R-134a (450 ± 25g)',
          oil: 'PAG 46 (100 ml)',
          belt: '6PK1255',
          pollenFilter: '225 x 195 x 25 mm'
        },
        compatiblePartIds: [1, 2, 25, 45, 125, 135, 165, 175, 256, 306, 376, 386, 15, 16, 17],
        diagramId: 'ac-system-exploded',
        vehicleImage: '/vehicles/creta.png'
      },
      'MAT602148E0B09381': {
        make: 'Tata Motors',
        model: 'Nexon XM',
        year: '2020',
        engine: '1.2L Revotron Turbo Petrol',
        fuelType: 'Petrol',
        chassis: 'MAT602148E0B09381',
        region: 'India (Pune Tata Plant)',
        specs: {
          compressor: 'Subros Sub-Compact Rotary',
          refrigerant: 'R-134a (420 ± 15g)',
          oil: 'PAG 46 (90 ml)',
          belt: '5PK1030',
          pollenFilter: '215 x 185 x 30 mm'
        },
        compatiblePartIds: [1, 2, 25, 45, 125, 135, 165, 175, 256, 306, 376, 386, 15, 16, 17],
        diagramId: 'ac-system-exploded',
        vehicleImage: '/vehicles/nexon.png'
      },
      'MBJ111GB300189284': {
        make: 'Toyota',
        model: 'Fortuner Sigma4',
        year: '2019',
        engine: '2.8L 1GD-FTV Turbo Diesel',
        fuelType: 'Diesel',
        chassis: 'MBJ111GB300189284',
        region: 'Japan / India Import (TKM)',
        specs: {
          compressor: 'Denso 10S17C Dual AC System',
          refrigerant: 'R-134a (650 ± 30g)',
          oil: 'ND-OIL 8 / PAG 46 (120 ml)',
          belt: '7PK2050',
          pollenFilter: '215 x 190 x 28 mm'
        },
        compatiblePartIds: [1, 2, 25, 45, 125, 135, 165, 175, 256, 306, 376, 386, 15, 16, 17],
        diagramId: 'ac-system-exploded',
        vehicleImage: '/vehicles/fortuner.png'
      },
      
      // Indian RTO License Plate Matches
      'DL3CAY1234': {
        make: 'Maruti Suzuki',
        model: 'Swift VXI',
        year: '2021',
        engine: '1.2L K12N DualJet Petrol',
        fuelType: 'Petrol',
        chassis: 'MA3FDB91S00109283',
        region: 'Delhi RTO (DL-3C)',
        specs: {
          compressor: 'Subros / Denso 10S11C',
          refrigerant: 'R-134a (370 ± 20g)',
          oil: 'PAG 46 (80 ml)',
          belt: '6PK1150',
          pollenFilter: '210 x 200 x 29 mm'
        },
        compatiblePartIds: [1, 2, 25, 45, 125, 135, 165, 175, 256, 306, 376, 386, 15, 16, 17],
        diagramId: 'ac-system-exploded',
        vehicleImage: '/vehicles/swift.png'
      },
      'MH12PK9876': {
        make: 'Hyundai',
        model: 'Creta SX',
        year: '2022',
        engine: '1.5L CRDi Diesel',
        fuelType: 'Diesel',
        chassis: 'MALCN81CPKM109482',
        region: 'Pune RTO (MH-12)',
        specs: {
          compressor: 'Hanon/Doowon DV16',
          refrigerant: 'R-134a (450 ± 25g)',
          oil: 'PAG 46 (100 ml)',
          belt: '6PK1255',
          pollenFilter: '225 x 195 x 25 mm'
        },
        compatiblePartIds: [1, 2, 25, 45, 125, 135, 165, 175, 256, 306, 376, 386, 15, 16, 17],
        diagramId: 'ac-system-exploded',
        vehicleImage: '/vehicles/creta.png'
      },
      'KA03MM5555': {
        make: 'Tata Motors',
        model: 'Nexon XM',
        year: '2020',
        engine: '1.2L Revotron Turbo Petrol',
        fuelType: 'Petrol',
        chassis: 'MAT602148E0B09381',
        region: 'Bengaluru RTO (KA-03)',
        specs: {
          compressor: 'Subros Sub-Compact Rotary',
          refrigerant: 'R-134a (420 ± 15g)',
          oil: 'PAG 46 (90 ml)',
          belt: '5PK1030',
          pollenFilter: '215 x 185 x 30 mm'
        },
        compatiblePartIds: [1, 2, 25, 45, 125, 135, 165, 175, 256, 306, 376, 386, 15, 16, 17],
        diagramId: 'ac-system-exploded',
        vehicleImage: '/vehicles/nexon.png'
      },
      'TN09XX4321': {
        make: 'Toyota',
        model: 'Fortuner Sigma4',
        year: '2019',
        engine: '2.8L 1GD-FTV Turbo Diesel',
        fuelType: 'Diesel',
        chassis: 'MBJ111GB300189284',
        region: 'Chennai RTO (TN-09)',
        specs: {
          compressor: 'Denso 10S17C Dual AC System',
          refrigerant: 'R-134a (650 ± 30g)',
          oil: 'ND-OIL 8 / PAG 46 (120 ml)',
          belt: '7PK2050',
          pollenFilter: '215 x 190 x 28 mm'
        },
        compatiblePartIds: [1, 2, 25, 45, 125, 135, 165, 175, 256, 306, 376, 386, 15, 16, 17],
        diagramId: 'ac-system-exploded',
        vehicleImage: '/vehicles/fortuner.png'
      }
    };

    if (samples[cleanQuery]) {
      setVinResult({ ...samples[cleanQuery], isSimulated: true });
      return;
    }

    const rtoApiKey = import.meta.env.VITE_INDIAN_VEHICLE_API_KEY || import.meta.env.VITE_RAPIDAPI_KEY || '';
    if (rtoApiKey) {
      // 1. Try Vehicle RC Information V2 API (fatehbrar92)
      try {
        const response = await fetch('https://vehicle-rc-information-v2.p.rapidapi.com/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'vehicle-rc-information-v2.p.rapidapi.com',
            'x-rapidapi-key': rtoApiKey
          },
          body: JSON.stringify({ vehicle_number: cleanQuery })
        });
        if (response.ok) {
          const data = await response.json();
          // Verify we got valid data, not a subscription/quota message
          if (data && !data.message?.includes('not subscribed') && !data.message?.includes('exceeded') && !data.error) {
            const resData = data.data || data;
            
            // Extract Make & Model
            let make = resData.make || resData.maker || resData.maker_name || resData.manufacturer || '';
            let model = resData.model || resData.model_name || '';
            const makerModel = resData.maker_model || '';

            if (makerModel && (!make || !model)) {
              const parts = makerModel.split(' ');
              if (parts.length > 1) {
                if (makerModel.toUpperCase().startsWith("MARUTI SUZUKI")) {
                  make = "Maruti Suzuki";
                  model = parts.slice(2).join(' ');
                } else {
                  make = parts[0];
                  model = parts.slice(1).join(' ');
                }
              } else {
                if (!make) make = makerModel;
                if (!model) model = 'Model';
              }
            }

            if (!make && resData.maker_description) {
              make = resData.maker_description.split(/[\/\-]/)[0].trim();
            }
            make = make || 'Vehicle';
            make = make.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

            if (!model && resData.maker_description) {
              const parts = resData.maker_description.split(/[\/\-]/);
              model = parts[1] ? parts[1].trim() : parts[0].trim();
            }
            model = model || 'Model';
            model = model.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

            // Extract Year
            let year = resData.year || resData.manufacturing_year || resData.registration_year || resData.reg_year || '';
            if (!year) {
              const dateStr = resData.registration_date || resData.reg_date || '';
              const match = dateStr.match(/(?:19|20)\d{2}/);
              if (match) {
                year = match[0];
              }
            }
            year = year || '2021';

            // Extract Fuel Type
            let fuelType = resData.fuel_type || resData.fuel || resData.fuel_descr || 'Petrol';
            fuelType = fuelType.split(' ')[0];
            fuelType = fuelType.charAt(0).toUpperCase() + fuelType.slice(1).toLowerCase();

            // Extract Engine
            let engine = resData.engine_capacity || resData.displacement || resData.engine_no || resData.engine || '1.2L';
            if (engine && !engine.includes('Engine') && engine.length > 5) {
              if (/^[A-Z0-9]+$/i.test(engine)) {
                engine = 'Standard Engine';
              }
            }

            // Extract Region
            let region = resData.rto_name || resData.rto_office || resData.rto || resData.state || resData.rto_location || 'India RTO';
            region = region.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

            const resolved = resolveVehicleDetails(make, model);
            
            setVinResult({
              make,
              model,
              year,
              engine: engine.includes('Engine') ? engine : `${engine} Engine`,
              fuelType,
              chassis: resData.chassis_no || resData.chassis_number || resData.chassis || cleanQuery,
              region,
              specs: {
                compressor: make.toLowerCase().includes('suzuki') ? 'Subros / Denso 10S11C' : 'Denso / Hanon Climate',
                refrigerant: 'R-134a (400 ± 20g)',
                oil: 'PAG 46 (90 ml)',
                belt: '6PK1080',
                pollenFilter: '215 x 190 x 25 mm'
              },
              compatiblePartIds: [1, 2, 25, 45, 125, 135, 165, 175, 256, 306, 376, 386],
              diagramId: resolved.diagramId || 'ac-system-exploded',
              vehicleImage: resolved.vehicleImage,
              isSimulated: false
            });
            return;
          } else {
            const errMsg = data.message || data.error || 'Not subscribed / Rate limit exceeded';
            console.warn('Vehicle RC V2 API subscription/error:', errMsg);
            setVinError(`RapidAPI: "${errMsg}". Falling back to demo database.`);
          }
        } else {
          const errBody = await response.json().catch(() => ({}));
          const errMsg = errBody.message || errBody.error || 'Access Forbidden (Unsubscribed)';
          console.warn('Vehicle RC V2 API response error:', errMsg);
          setVinError(`RapidAPI: "${errMsg}". Falling back to demo database.`);
        }
      } catch (err) {
        console.warn('Error fetching from primary Vehicle RC V2 API:', err);
      }

      // 2. Fallback to secondary RTO API if primary fails
      try {
        const apiPath = isPlate ? `registration/${cleanQuery}` : `chassis/${cleanQuery}`;
        const response = await fetch(`https://indian-vehicle-details-rto.p.rapidapi.com/${apiPath}`, {
          headers: {
            'X-RapidAPI-Key': rtoApiKey,
            'X-RapidAPI-Host': 'indian-vehicle-details-rto.p.rapidapi.com'
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.make) {
            const make = data.make;
            const model = data.model || 'Model';
            const year = data.registration_year || data.year || '2021';
            const fuelType = data.fuel_type || data.fuel || 'Petrol';
            const engine = data.engine_capacity || data.displacement || '1.2L';
            
            setVinResult({
              make,
              model,
              year,
              engine: engine.includes('Engine') ? engine : `${engine} Engine`,
              fuelType,
              chassis: data.chassis_number || cleanQuery,
              region: data.rto_office || data.state || 'India RTO',
              specs: {
                compressor: make.toLowerCase().includes('suzuki') ? 'Subros / Denso 10S11C' : 'Denso / Hanon Climate',
                refrigerant: 'R-134a (400 ± 20g)',
                oil: 'PAG 46 (90 ml)',
                belt: '6PK1080',
                pollenFilter: '215 x 190 x 25 mm'
              },
              compatiblePartIds: [1, 2, 25, 45, 125, 135, 165, 175, 256, 306, 376, 386],
              diagramId: 'ac-system-exploded',
              isSimulated: false
            });
            return;
          }
        }
      } catch (err) {
        console.error('Error fetching secondary Indian RTO details:', err);
      }
    }

    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${cleanQuery}?format=json`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      
      if (data && data.Results && data.Results[0]) {
        const info = data.Results[0];
        
        let make = info.Make ? info.Make.trim() : '';
        let model = info.Model ? info.Model.trim() : '';
        let year = info.ModelYear ? info.ModelYear.trim() : '';
        let displacement = info.DisplacementL ? info.DisplacementL.trim() : '';
        let engine = displacement ? `${displacement}L ${info.EngineConfiguration || ''}` : '';
        let region = info.PlantCountry ? info.PlantCountry.trim() : '';
        let fuel = info.FuelTypePrimary ? info.FuelTypePrimary.trim() : '';

        if (!make || make === 'INVALID VIN' || make.toLowerCase().includes('error')) {
          decodeFallback(cleanQuery);
          return;
        }

        make = make.charAt(0).toUpperCase() + make.slice(1).toLowerCase();
        if (model) {
          model = model.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        }

        let compatIds = [1, 2, 6];
        let isHeavy = false;
        
        const vehicleType = info.VehicleType ? info.VehicleType.toLowerCase() : '';
        const bodyClass = info.BodyClass ? info.BodyClass.toLowerCase() : '';
        
        if (vehicleType.includes('truck') || vehicleType.includes('bus') || bodyClass.includes('truck') || bodyClass.includes('bus')) {
          compatIds = [5, 7, 8, 12];
          isHeavy = true;
        } else if (parseFloat(displacement) > 2.0) {
          compatIds = [1, 2, 11];
        }

        const specs = isHeavy ? {
          compressor: 'Sanden Heavy-Duty Compressor',
          refrigerant: 'R-134a (950 ± 50g)',
          oil: 'PAG 100 (220 ml)',
          belt: '8PK1540',
          pollenFilter: '280 x 240 x 35 mm'
        } : {
          compressor: make.toLowerCase().includes('toyota') ? 'Denso 10S15C / 10S17C' : 'Denso / Subros Compact Rotary',
          refrigerant: 'R-134a (430 ± 15g)',
          oil: 'PAG 46 (90 ml)',
          belt: '6PK1080',
          pollenFilter: '215 x 190 x 25 mm'
        };

        let normalizedFuel = 'Petrol';
        if (fuel.toLowerCase().includes('diesel')) {
          normalizedFuel = 'Diesel';
        } else if (fuel.toLowerCase().includes('elect') || fuel.toLowerCase().includes('plug')) {
          normalizedFuel = 'Electric';
        } else if (fuel.toLowerCase().includes('hybr')) {
          normalizedFuel = 'Hybrid';
        } else if (fuel) {
          normalizedFuel = fuel;
        }

        const resolved = resolveVehicleDetails(make, model);
        
        let finalCompatIds = [...compatIds, 15, 16, 17];
        if (resolved.diagramId === 'ac-system-exploded') {
          finalCompatIds = [1, 2, 25, 45, 125, 135, 165, 175, 256, 306, 376, 386];
        }

        setVinResult({
          make,
          model,
          year,
          engine: engine || 'Standard Fuel-Injected Engine',
          fuelType: normalizedFuel,
          chassis: cleanQuery,
          region: region || info.PlantState || 'International WMI',
          specs,
          compatiblePartIds: finalCompatIds,
          diagramId: resolved.diagramId,
          vehicleImage: resolved.vehicleImage
        });
      } else {
        decodeFallback(cleanQuery);
      }
    } catch (err) {
      console.warn("NHTSA API failed, using fallback decoder:", err);
      decodeFallback(cleanQuery);
    }
  };

  const decodeFallback = (cleanQuery) => {
    // If it's a license plate, map common Indian states to demo vehicles
    if (cleanQuery.length <= 11 && /^[A-Z]{2}[0-9]/i.test(cleanQuery)) {
      const statePrefix = cleanQuery.substring(0, 2).toUpperCase();
      const stateMap = {
        'DL': { make: 'Maruti Suzuki', model: 'Swift VXI', year: '2021', engine: '1.2L K12N DualJet Petrol', fuel: 'Petrol', specs: { compressor: 'Subros / Denso 10S11C', refrigerant: 'R-134a (370 ± 20g)', oil: 'PAG 46 (80 ml)', belt: '6PK1150', pollenFilter: '210 x 200 x 29 mm' }, modelDiagramId: 'swift-hvac', image: '/vehicles/swift.png' },
        'HR': { make: 'Maruti Suzuki', model: 'Swift VXI', year: '2021', engine: '1.2L K12N DualJet Petrol', fuel: 'Petrol', specs: { compressor: 'Subros / Denso 10S11C', refrigerant: 'R-134a (370 ± 20g)', oil: 'PAG 46 (80 ml)', belt: '6PK1150', pollenFilter: '210 x 200 x 29 mm' }, modelDiagramId: 'swift-hvac', image: '/vehicles/swift.png' },
        'MH': { make: 'Hyundai', model: 'Creta SX', year: '2022', engine: '1.5L CRDi Diesel', fuel: 'Diesel', specs: { compressor: 'Hanon/Doowon DV16', refrigerant: 'R-134a (450 ± 25g)', oil: 'PAG 46 (100 ml)', belt: '6PK1255', pollenFilter: '225 x 195 x 25 mm' }, modelDiagramId: 'creta-hvac', image: '/vehicles/creta.png' },
        'KL': { make: 'Hyundai', model: 'Creta SX', year: '2022', engine: '1.5L CRDi Diesel', fuel: 'Diesel', specs: { compressor: 'Hanon/Doowon DV16', refrigerant: 'R-134a (450 ± 25g)', oil: 'PAG 46 (100 ml)', belt: '6PK1255', pollenFilter: '225 x 195 x 25 mm' }, modelDiagramId: 'creta-hvac', image: '/vehicles/creta.png' },
        'KA': { make: 'Tata Motors', model: 'Nexon XM', year: '2020', engine: '1.2L Revotron Turbo Petrol', fuel: 'Petrol', specs: { compressor: 'Subros Sub-Compact Rotary', refrigerant: 'R-134a (420 ± 15g)', oil: 'PAG 46 (90 ml)', belt: '5PK1030', pollenFilter: '215 x 185 x 30 mm' }, modelDiagramId: 'nexon-hvac', image: '/vehicles/nexon.png' },
        'GJ': { make: 'Tata Motors', model: 'Nexon XM', year: '2020', engine: '1.2L Revotron Turbo Petrol', fuel: 'Petrol', specs: { compressor: 'Subros Sub-Compact Rotary', refrigerant: 'R-134a (420 ± 15g)', oil: 'PAG 46 (90 ml)', belt: '5PK1030', pollenFilter: '215 x 185 x 30 mm' }, modelDiagramId: 'nexon-hvac', image: '/vehicles/nexon.png' },
        'TN': { make: 'Toyota', model: 'Fortuner Sigma4', year: '2019', engine: '2.8L 1GD-FTV Turbo Diesel', fuel: 'Diesel', specs: { compressor: 'Denso 10S17C Dual AC System', refrigerant: 'R-134a (650 ± 30g)', oil: 'ND-OIL 8 / PAG 46 (120 ml)', belt: '7PK2050', pollenFilter: '215 x 190 x 28 mm' }, modelDiagramId: 'fortuner-hvac', image: '/vehicles/fortuner.png' },
        'UP': { make: 'Toyota', model: 'Fortuner Sigma4', year: '2019', engine: '2.8L 1GD-FTV Turbo Diesel', fuel: 'Diesel', specs: { compressor: 'Denso 10S17C Dual AC System', refrigerant: 'R-134a (650 ± 30g)', oil: 'ND-OIL 8 / PAG 46 (120 ml)', belt: '7PK2050', pollenFilter: '215 x 190 x 28 mm' }, modelDiagramId: 'fortuner-hvac', image: '/vehicles/fortuner.png' }
      };

      const mapped = stateMap[statePrefix] || stateMap['DL']; // Default to Swift if unknown state
      const resolved = resolveVehicleDetails(mapped.make, mapped.model);
      
      setVinResult({
        make: mapped.make,
        model: mapped.model,
        year: mapped.year,
        engine: mapped.engine,
        fuelType: mapped.fuel,
        chassis: cleanQuery,
        region: `${statePrefix} RTO Region (Local Fallback)`,
        specs: mapped.specs,
        compatiblePartIds: [1, 2, 25, 45, 125, 135, 165, 175, 256, 306, 376, 386],
        diagramId: resolved.diagramId || mapped.modelDiagramId,
        vehicleImage: resolved.vehicleImage || mapped.image,
        isSimulated: true
      });
      return;
    }

    const wmi = cleanQuery.substring(0, 3).toUpperCase();
    const vds = cleanQuery.substring(3, 8).toUpperCase();
    const upperVin = cleanQuery.toUpperCase();

    let make = 'Generic Vehicle';
    let model = 'Universal Model';
    let engine = '1.2L - 1.5L Fuel-Injected Engine';
    let compatIds = [1, 2, 6];
    let modelDiagramId = 'swift-hvac';
    let fuel = 'Petrol';

    let specs = {
      compressor: 'Denso / Subros Compact Rotary',
      refrigerant: 'R-134a (430 ± 15g)',
      oil: 'PAG 46 (90 ml)',
      belt: '6PK1080',
      pollenFilter: '215 x 190 x 25 mm'
    };

    // 1. Maruti Suzuki
    if (wmi.startsWith('MA3') || wmi.startsWith('MS1')) {
      make = 'Maruti Suzuki';
      compatIds = [1, 2, 3, 6, 9, 15, 16, 17];
      modelDiagramId = 'swift-hvac';
      
      if (upperVin.includes('FD') || upperVin.includes('FE')) {
        model = 'Swift';
        engine = '1.2L K12N DualJet Petrol';
        specs = {
          compressor: 'Subros / Denso 10S11C',
          refrigerant: 'R-134a (370 ± 20g)',
          oil: 'PAG 46 (80 ml)',
          belt: '6PK1150',
          pollenFilter: '210 x 200 x 29 mm'
        };
      } else if (upperVin.includes('ED') || upperVin.includes('EE')) {
        model = 'Dzire';
        engine = '1.2L K12M Petrol';
        specs = {
          compressor: 'Subros / Denso 10S11C',
          refrigerant: 'R-134a (370 ± 20g)',
          oil: 'PAG 46 (80 ml)',
          belt: '6PK1150',
          pollenFilter: '210 x 200 x 29 mm'
        };
      } else if (upperVin.includes('HA') || upperVin.includes('HB')) {
        model = 'Ertiga';
        engine = '1.5L K15C Smart Hybrid';
        modelDiagramId = 'fortuner-hvac';
        specs = {
          compressor: 'Denso 10S13C Dual AC',
          refrigerant: 'R-134a (530 ± 25g)',
          oil: 'PAG 46 (120 ml)',
          belt: '6PK1210',
          pollenFilter: '215 x 200 x 30 mm'
        };
      } else if (upperVin.includes('YA') || upperVin.includes('YB')) {
        model = 'Baleno';
        engine = '1.2L DualJet Petrol';
        specs = {
          compressor: 'Subros C120',
          refrigerant: 'R-134a (360 ± 15g)',
          oil: 'PAG 46 (80 ml)',
          belt: '6PK1130',
          pollenFilter: '210 x 200 x 29 mm'
        };
      } else if (upperVin.includes('AA') || upperVin.includes('AB')) {
        model = 'Alto 10';
        engine = '1.0L K10C Petrol';
        specs = {
          compressor: 'Subros C80',
          refrigerant: 'R-134a (320 ± 10g)',
          oil: 'PAG 46 (60 ml)',
          belt: '4PK810',
          pollenFilter: '200 x 180 x 20 mm'
        };
      } else if (upperVin.includes('BA') || upperVin.includes('BB')) {
        model = 'Brezza';
        engine = '1.5L K15B Petrol';
        specs = {
          compressor: 'Denso 10S13C',
          refrigerant: 'R-134a (410 ± 20g)',
          oil: 'PAG 46 (100 ml)',
          belt: '6PK1185',
          pollenFilter: '215 x 200 x 30 mm'
        };
      } else {
        model = 'Swift Series';
        engine = '1.2L K-Series Petrol';
      }
    }
    // 2. Hyundai
    else if (wmi.startsWith('MAL') || wmi.startsWith('KMH')) {
      make = 'Hyundai';
      compatIds = [1, 2, 3, 6, 15, 16, 17];
      modelDiagramId = 'creta-hvac';
      fuel = 'Diesel'; // Many Hyundai lookups are diesel

      if (upperVin.includes('CN') || upperVin.includes('CP')) {
        model = 'Creta';
        engine = '1.5L CRDi Turbo Diesel';
        specs = {
          compressor: 'Hanon/Doowon DV16',
          refrigerant: 'R-134a (450 ± 25g)',
          oil: 'PAG 46 (100 ml)',
          belt: '6PK1255',
          pollenFilter: '225 x 195 x 25 mm'
        };
      } else if (upperVin.includes('B1') || upperVin.includes('B2')) {
        model = 'i20';
        engine = '1.2L Kappa Petrol';
        fuel = 'Petrol';
        modelDiagramId = 'swift-hvac';
        specs = {
          compressor: 'Hanon DV13',
          refrigerant: 'R-134a (400 ± 20g)',
          oil: 'PAG 46 (90 ml)',
          belt: '6PK1215',
          pollenFilter: '215 x 185 x 25 mm'
        };
      } else if (upperVin.includes('A1') || upperVin.includes('A2')) {
        model = 'Grand i10';
        engine = '1.2L Kappa Petrol';
        fuel = 'Petrol';
        modelDiagramId = 'swift-hvac';
        specs = {
          compressor: 'Doowon DV11',
          refrigerant: 'R-134a (380 ± 15g)',
          oil: 'PAG 46 (80 ml)',
          belt: '6PK1190',
          pollenFilter: '210 x 180 x 25 mm'
        };
      } else if (upperVin.includes('S1') || upperVin.includes('S2')) {
        model = 'Venue';
        engine = '1.0L Turbo GDi Petrol';
        fuel = 'Petrol';
        specs = {
          compressor: 'Hanon DV13',
          refrigerant: 'R-134a (420 ± 20g)',
          oil: 'PAG 46 (90 ml)',
          belt: '6PK1230',
          pollenFilter: '220 x 190 x 25 mm'
        };
      } else if (upperVin.includes('V1') || upperVin.includes('V2')) {
        model = 'Verna';
        engine = '1.5L MPi Petrol';
        fuel = 'Petrol';
        modelDiagramId = 'swift-hvac';
        specs = {
          compressor: 'Hanon DV15',
          refrigerant: 'R-134a (430 ± 15g)',
          oil: 'PAG 46 (90 ml)',
          belt: '6PK1240',
          pollenFilter: '225 x 195 x 25 mm'
        };
      } else {
        model = 'Creta SX';
        engine = '1.5L Diesel';
      }
    }
    // 3. Tata Motors
    else if (wmi.startsWith('MAT') || wmi.startsWith('TTR')) {
      make = 'Tata Motors';
      compatIds = [1, 2, 3, 6, 15, 16, 17];
      modelDiagramId = 'nexon-hvac';
      
      if (upperVin.includes('602') || upperVin.includes('NX')) {
        model = 'Nexon';
        engine = '1.2L Revotron Turbo Petrol';
        specs = {
          compressor: 'Subros Sub-Compact Rotary',
          refrigerant: 'R-134a (420 ± 15g)',
          oil: 'PAG 46 (90 ml)',
          belt: '5PK1030',
          pollenFilter: '215 x 185 x 30 mm'
        };
      } else if (upperVin.includes('612') || upperVin.includes('AL')) {
        model = 'Altroz';
        engine = '1.2L Revotron Petrol';
        modelDiagramId = 'swift-hvac';
        specs = {
          compressor: 'Subros Compact Rotary',
          refrigerant: 'R-134a (400 ± 15g)',
          oil: 'PAG 46 (90 ml)',
          belt: '5PK1015',
          pollenFilter: '215 x 185 x 30 mm'
        };
      } else if (upperVin.includes('622') || upperVin.includes('PU')) {
        model = 'Punch';
        engine = '1.2L Revotron Petrol';
        modelDiagramId = 'swift-hvac';
        specs = {
          compressor: 'Subros Compact Rotary',
          refrigerant: 'R-134a (380 ± 15g)',
          oil: 'PAG 46 (80 ml)',
          belt: '5PK1010',
          pollenFilter: '210 x 180 x 30 mm'
        };
      } else if (upperVin.includes('642') || upperVin.includes('HR') || upperVin.includes('SF')) {
        model = 'Harrier';
        engine = '2.0L Kryotec Diesel';
        fuel = 'Diesel';
        modelDiagramId = 'fortuner-hvac';
        specs = {
          compressor: 'Sanden SD7V16',
          refrigerant: 'R-134a (550 ± 20g)',
          oil: 'PAG 46 (120 ml)',
          belt: '6PK1560',
          pollenFilter: '230 x 205 x 30 mm'
        };
      } else {
        model = 'Nexon Series';
        engine = '1.2L Revotron Petrol';
      }
    }
    // 4. Toyota
    else if (wmi.startsWith('MBJ') || wmi.startsWith('MHF') || wmi.startsWith('JTD')) {
      make = 'Toyota';
      compatIds = [1, 2, 3, 11, 15, 16, 17];
      modelDiagramId = 'fortuner-hvac';
      fuel = 'Diesel';

      if (upperVin.includes('111') || upperVin.includes('FT')) {
        model = 'Fortuner';
        engine = '2.8L 1GD-FTV Turbo Diesel';
        specs = {
          compressor: 'Denso 10S17C Dual AC System',
          refrigerant: 'R-134a (650 ± 30g)',
          oil: 'ND-OIL 8 / PAG 46 (120 ml)',
          belt: '7PK2050',
          pollenFilter: '215 x 190 x 28 mm'
        };
      } else if (upperVin.includes('121') || upperVin.includes('IN')) {
        model = 'Innova Crysta';
        engine = '2.4L 2GD-FTV Diesel';
        specs = {
          compressor: 'Denso 10S15C Dual AC System',
          refrigerant: 'R-134a (600 ± 25g)',
          oil: 'ND-OIL 8 / PAG 46 (120 ml)',
          belt: '7PK1920',
          pollenFilter: '215 x 190 x 28 mm'
        };
      } else if (upperVin.includes('131') || upperVin.includes('HR')) {
        model = 'Urban Cruiser Hyryder';
        engine = '1.5L NeoDrive Hybrid';
        fuel = 'Hybrid';
        modelDiagramId = 'creta-hvac';
        specs = {
          compressor: 'Denso Electric ES14',
          refrigerant: 'R-134a (410 ± 15g)',
          oil: 'ND-OIL 11 (100 ml)',
          belt: 'Electric Drive',
          pollenFilter: '210 x 185 x 28 mm'
        };
      } else if (upperVin.includes('141') || upperVin.includes('GL')) {
        model = 'Glanza';
        engine = '1.2L DualJet Petrol';
        fuel = 'Petrol';
        modelDiagramId = 'swift-hvac';
        specs = {
          compressor: 'Subros C120',
          refrigerant: 'R-134a (360 ± 15g)',
          oil: 'PAG 46 (80 ml)',
          belt: '6PK1130',
          pollenFilter: '210 x 200 x 29 mm'
        };
      } else {
        model = 'Fortuner Sigma4';
        engine = '2.8L Diesel';
      }
    }
    // 5. Mahindra
    else if (wmi.startsWith('MPH') || wmi.startsWith('MA1')) {
      make = 'Mahindra';
      compatIds = [1, 2, 3, 6, 15, 16, 17];
      modelDiagramId = 'fortuner-hvac';
      fuel = 'Diesel';

      if (upperVin.includes('XUV') || upperVin.includes('700')) {
        model = 'XUV700';
        engine = '2.2L mHawk Turbo Diesel';
        specs = {
          compressor: 'Hanon VS16',
          refrigerant: 'R-134a (580 ± 20g)',
          oil: 'PAG 46 (110 ml)',
          belt: '6PK1610',
          pollenFilter: '225 x 195 x 30 mm'
        };
      } else if (upperVin.includes('SCO') || upperVin.includes('N')) {
        model = 'Scorpio-N';
        engine = '2.2L mHawk Turbo Diesel';
        specs = {
          compressor: 'Hanon VS16',
          refrigerant: 'R-134a (560 ± 20g)',
          oil: 'PAG 46 (110 ml)',
          belt: '6PK1590',
          pollenFilter: '220 x 195 x 30 mm'
        };
      } else if (upperVin.includes('THR') || upperVin.includes('TAR')) {
        model = 'Thar';
        engine = '2.2L mHawk Diesel';
        modelDiagramId = 'creta-hvac';
        specs = {
          compressor: 'Hanon VS14',
          refrigerant: 'R-134a (480 ± 20g)',
          oil: 'PAG 46 (100 ml)',
          belt: '6PK1410',
          pollenFilter: '215 x 185 x 28 mm'
        };
      } else {
        model = 'Thar AX';
        engine = '2.2L Diesel';
      }
    }
    // 6. Honda
    else if (wmi.startsWith('SHS') || wmi.startsWith('MRH')) {
      make = 'Honda';
      model = 'City';
      compatIds = [1, 2, 3, 6, 15, 16, 17];
      modelDiagramId = 'swift-hvac';
      engine = '1.5L i-VTEC Petrol';
      specs = {
        compressor: 'Sanden TRSE07',
        refrigerant: 'R-134a (380 ± 15g)',
        oil: 'SP-10 (80 ml)',
        belt: '5PK1140',
        pollenFilter: '210 x 205 x 28 mm'
      };
    }
    // 7. MG Motor
    else if (wmi.startsWith('LSJ') || upperVin.includes('MG')) {
      make = 'MG Motor';
      compatIds = [1, 2, 3, 6, 15, 16, 17];
      modelDiagramId = 'creta-hvac';
      engine = '1.5L Turbo Petrol';
      
      if (upperVin.includes('HE') || upperVin.includes('HECTOR')) {
        model = 'Hector';
        specs = {
          compressor: 'Hanon/Sanden Variable displacement',
          refrigerant: 'R-134a (460 ± 15g)',
          oil: 'PAG 46 (100 ml)',
          belt: '6PK1220',
          pollenFilter: '215 x 195 x 28 mm'
        };
      } else if (upperVin.includes('AS') || upperVin.includes('ASTOR')) {
        model = 'Astor';
        specs = {
          compressor: 'Hanon VS14',
          refrigerant: 'R-134a (420 ± 15g)',
          oil: 'PAG 46 (90 ml)',
          belt: '6PK1210',
          pollenFilter: '210 x 185 x 25 mm'
        };
      } else if (upperVin.includes('GL') || upperVin.includes('GLOSTER')) {
        model = 'Gloster';
        modelDiagramId = 'fortuner-hvac';
        engine = '2.0L Twin-Turbo Diesel';
        specs = {
          compressor: 'Denso 10S17C Dual AC',
          refrigerant: 'R-134a (650 ± 25g)',
          oil: 'ND-OIL 8 (120 ml)',
          belt: '7PK2010',
          pollenFilter: '220 x 200 x 30 mm'
        };
      } else {
        model = 'Hector';
        specs = {
          compressor: 'Hanon/Sanden Variable displacement',
          refrigerant: 'R-134a (460 ± 15g)',
          oil: 'PAG 46 (100 ml)',
          belt: '6PK1220',
          pollenFilter: '215 x 195 x 28 mm'
        };
      }
    }
    // 8. Kia Motors
    else if (wmi.startsWith('KNA') || upperVin.includes('KIA') || upperVin.includes('SE') || upperVin.includes('SO')) {
      make = 'Kia';
      compatIds = [1, 2, 3, 6, 15, 16, 17];
      modelDiagramId = 'creta-hvac';
      engine = '1.5L CRDi Diesel';
      
      if (upperVin.includes('SE') || upperVin.includes('CN') || upperVin.includes('SELTOS')) {
        model = 'Seltos';
        specs = {
          compressor: 'Hanon/Doowon DV16',
          refrigerant: 'R-134a (450 ± 25g)',
          oil: 'PAG 46 (100 ml)',
          belt: '6PK1255',
          pollenFilter: '225 x 195 x 25 mm'
        };
      } else if (upperVin.includes('SO') || upperVin.includes('B1') || upperVin.includes('SONET')) {
        model = 'Sonet';
        specs = {
          compressor: 'Hanon DV13',
          refrigerant: 'R-134a (400 ± 20g)',
          oil: 'PAG 46 (90 ml)',
          belt: '6PK1215',
          pollenFilter: '215 x 185 x 25 mm'
        };
      } else {
        model = 'Seltos';
        specs = {
          compressor: 'Hanon/Doowon DV16',
          refrigerant: 'R-134a (450 ± 25g)',
          oil: 'PAG 46 (100 ml)',
          belt: '6PK1255',
          pollenFilter: '225 x 195 x 25 mm'
        };
      }
    }
    // 9. Skoda / Volkswagen
    else if (wmi.startsWith('WVW') || wmi.startsWith('WV2') || wmi.startsWith('TMB') || upperVin.includes('SL') || upperVin.includes('VI')) {
      compatIds = [1, 2, 3, 10, 15, 16, 17];
      modelDiagramId = 'swift-hvac';
      engine = '1.0L TSI Petrol';
      
      if (upperVin.includes('SL') || upperVin.includes('KUS') || upperVin.includes('SLAVIA') || upperVin.includes('KUSHAQ')) {
        make = 'Skoda';
        model = (upperVin.includes('KUS') || upperVin.includes('KUSHAQ')) ? 'Kushaq' : 'Slavia';
        if (model === 'Kushaq') modelDiagramId = 'creta-hvac';
        specs = {
          compressor: 'Sanden PXE14 / Denso 6SES14C',
          refrigerant: 'R-1234yf / R-134a (420 ± 15g)',
          oil: 'PAG 46 (90 ml)',
          belt: '6PK1020',
          pollenFilter: '215 x 200 x 30 mm'
        };
      } else if (upperVin.includes('VI') || upperVin.includes('TAI') || upperVin.includes('VIRTUS') || upperVin.includes('TAIGUN')) {
        make = 'Volkswagen';
        model = (upperVin.includes('TAI') || upperVin.includes('TAIGUN')) ? 'Taigun' : 'Virtus';
        if (model === 'Taigun') modelDiagramId = 'creta-hvac';
        specs = {
          compressor: 'Sanden PXE14 / Denso 6SES14C',
          refrigerant: 'R-1234yf / R-134a (420 ± 15g)',
          oil: 'PAG 46 (90 ml)',
          belt: '6PK1020',
          pollenFilter: '215 x 200 x 30 mm'
        };
      } else {
        make = 'Volkswagen';
        model = 'Virtus';
        specs = {
          compressor: 'Sanden PXE14 / Denso 6SES14C',
          refrigerant: 'R-1234yf / R-134a (420 ± 15g)',
          oil: 'PAG 46 (90 ml)',
          belt: '6PK1020',
          pollenFilter: '215 x 200 x 30 mm'
        };
      }
    }
    // 10. Light Commercial / Trucks & Buses / Force Motors / Ashok Leyland / BharatBenz / Volvo
    else if (wmi.startsWith('MDF') || wmi.startsWith('MBN') || wmi.startsWith('YV1') || wmi.startsWith('MAF') || upperVin.includes('DST') || upperVin.includes('PRM') || upperVin.includes('BUS') || upperVin.includes('BBZ') || upperVin.includes('VOLVO') || selectedMake.toLowerCase().includes('leyland') || selectedMake.toLowerCase().includes('commercial') || selectedMake.toLowerCase().includes('bharat') || selectedMake.toLowerCase().includes('volvo') || selectedMake.toLowerCase().includes('force')) {
      compatIds = [5, 7, 8, 12, 15, 16, 17];
      modelDiagramId = 'fortuner-hvac';
      fuel = 'Diesel';
      
      if (wmi.startsWith('MDF') || upperVin.includes('DST') || selectedModel.toLowerCase().includes('dost')) {
        make = 'Ashok Leyland';
        model = 'Dost (LCV)';
        engine = '1.5L 3-Cylinder Diesel';
        modelDiagramId = 'swift-hvac';
        specs = {
          compressor: 'Subros Compact Rotary',
          refrigerant: 'R-134a (400 ± 20g)',
          oil: 'PAG 46 (90 ml)',
          belt: '5PK1010',
          pollenFilter: '210 x 180 x 25 mm'
        };
      } else if (wmi.startsWith('MBN') || upperVin.includes('BBZ') || selectedModel.toLowerCase().includes('bharatbenz')) {
        make = 'BharatBenz';
        model = selectedModel.includes('(') ? selectedModel.split(' ')[1] : 'Heavy Truck Fleet';
        engine = '6.7L BharatBenz Turbo Diesel';
        specs = {
          compressor: 'Heavy Duty Sanden SD7H15',
          refrigerant: 'R-134a (850 ± 50g)',
          oil: 'PAG 100 (180 ml)',
          belt: '8PK1540',
          pollenFilter: '260 x 220 x 35 mm'
        };
      } else if (wmi.startsWith('YV1') || upperVin.includes('VOLVO') || selectedModel.toLowerCase().includes('volvo')) {
        make = 'Volvo';
        model = 'Premium Bus Series';
        engine = '8.0L Volvo D8K Diesel';
        specs = {
          compressor: 'Sanden Heavy Duty AC',
          refrigerant: 'R-134a (1200g ± 100g)',
          oil: 'PAG 100 (250 ml)',
          belt: '8PK1620',
          pollenFilter: '300 x 250 x 40 mm'
        };
      } else if (wmi.startsWith('MAF') || upperVin.includes('TRV') || selectedModel.toLowerCase().includes('traveller')) {
        make = 'Force Motors';
        model = 'Traveller';
        engine = '2.6L FM 2.6 CR CD Diesel';
        specs = {
          compressor: 'Sanden SD7H15 Dual AC',
          refrigerant: 'R-134a (800 ± 40g)',
          oil: 'PAG 100 (150 ml)',
          belt: '7PK1420',
          pollenFilter: '240 x 200 x 30 mm'
        };
      } else {
        make = 'Tata Commercial';
        model = 'Prima Heavy Truck';
        engine = 'Cummins ISBe 6.7L Diesel';
        specs = {
          compressor: 'Sanden Heavy Duty Compressor',
          refrigerant: 'R-134a (950 ± 50g)',
          oil: 'PAG 100 (220 ml)',
          belt: '8PK1540',
          pollenFilter: '280 x 240 x 35 mm'
        };
      }
    }
    // 11. Generic Heavy Commercial fallback
    else if (wmi.startsWith('1FV') || wmi.startsWith('4UZ') || upperVin.includes('TRUCK') || upperVin.includes('BUS')) {
      make = 'Heavy Commercial';
      model = 'Volvo Truck Fleet';
      compatIds = [5, 7, 8, 12, 15, 16, 17];
      modelDiagramId = 'fortuner-hvac';
      engine = '5.2L D5K Turbocharged Diesel';
      fuel = 'Diesel';
      specs = {
        compressor: 'Sanden Heavy-Duty Compressor',
        refrigerant: 'R-134a (950 ± 50g)',
        oil: 'PAG 100 (220 ml)',
        belt: '8PK1540',
        pollenFilter: '280 x 240 x 35 mm'
      };
    }

    // Decode model year from 10th digit
    let year = '2022';
    if (cleanQuery.length >= 10) {
      const yearChar = cleanQuery.charAt(9);
      const yearMap = {
        'A': '2010', 'B': '2011', 'C': '2012', 'D': '2013', 'E': '2014', 'F': '2015',
        'G': '2016', 'H': '2017', 'J': '2018', 'K': '2019', 'L': '2020', 'M': '2021',
        'N': '2022', 'P': '2023', 'R': '2024', 'S': '2025', 'T': '2026'
      };
      year = yearMap[yearChar] || '2022';
    }

    const resolved = resolveVehicleDetails(make, model);
    
    let finalCompatIds = compatIds;
    if (resolved.diagramId === 'ac-system-exploded') {
      finalCompatIds = [1, 2, 25, 45, 125, 135, 165, 175, 256, 306, 376, 386];
    }

    setVinResult({
      make,
      model: `${model} (Decoded Specs)`,
      year,
      engine,
      fuelType: fuel,
      chassis: cleanQuery,
      region: 'India / ASIA Domestic WMI Decode',
      specs,
      compatiblePartIds: finalCompatIds,
      diagramId: resolved.diagramId,
      vehicleImage: resolved.vehicleImage,
      isSimulated: true
    });
  };

  const sendPlateWhatsApp = (e) => {
    e.preventDefault();
    if (!plateForm.name.trim() || !plateForm.phone.trim()) {
      alert('Please enter your Name and Contact/Phone Number.');
      return;
    }
    const message = `Hello RCS! I would like to inquire about AC parts. Here are my details:\n\n` +
      `*Name:* ${plateForm.name.trim()}\n` +
      `*Product:* ${plateForm.product.trim() || 'N/A'}\n` +
      `*Vehicle Reg Number:* ${plateForm.regNumber.trim() || 'N/A'}\n` +
      `*VIN/Chassis Number:* ${plateForm.vin.trim() || 'N/A'}\n` +
      `*Contact Number:* ${plateForm.phone.trim()}`;
      
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919962173870?text=${encoded}`, '_blank');
  };

  // Handle Visual Part Upload logic
  const handleImageDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setImageDragActive(true);
    } else if (e.type === "dragleave") {
      setImageDragActive(false);
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectedImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleSelectedImageFile(e.target.files[0]);
    }
  };

  const handleSelectedImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setImageUploadErr('Only image files are supported.');
      return;
    }
    
    // Max 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setImageUploadErr('Image size should be less than 10MB.');
      return;
    }

    setImageUploadErr('');
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
  };

  const clearSelectedImage = () => {
    setImageFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl('');
    setImageUploadErr('');
  };

  const handleSendImageEnquiry = async () => {
    if (!imageFile) return;
    
    setIsImageUploading(true);
    setImageUploadErr('');
    
    try {
      // 1. Upload the image (dbService handles client-side WebP conversion automatically)
      const uploadRes = await dbService.uploadImage(imageFile, 'Product Enquiry');
      
      if (!uploadRes || !uploadRes.image_url) {
        throw new Error('Upload failed to return a valid URL.');
      }
      
      // 2. Generate WhatsApp message containing the uploaded image URL and user description
      const phoneNumber = '919962173870';
      const textMessage = `Hi RCS, I am looking for this AC part.
      
📸 Photo: ${uploadRes.image_url}
📝 Details: ${imageDesc.trim() || 'No description provided.'}`;

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMessage)}`;
      
      // 3. Open WhatsApp enquiry
      window.open(whatsappUrl, '_blank');
      
      // 4. Success state clear
      clearSelectedImage();
      setImageDesc('');
    } catch (err) {
      console.error('Error uploading enquiry photo:', err);
      setImageUploadErr('Failed to upload image. Please try opening WhatsApp and sending it directly.');
    } finally {
      setIsImageUploading(false);
    }
  };

  const categoriesList = [
    'All Categories',
    'Car AC Parts',
    'Truck AC Parts',
    'Bus AC Parts',
    'Payload Vehicle AC Parts',
    'Construction Vehicle AC Parts',
    'Bulldozer AC Parts'
  ];

  const popularSuggestions = [
    { name: 'AC Compressor Denso Universal', oem: '447260-3480', category: 'Car' },
    { name: 'Condenser Assembly Sanden', oem: 'SND-2918', category: 'Car' },
    { name: 'Bus Condenser Coil Heavy Duty', oem: 'BUS-CON-902', category: 'Bus' },
    { name: 'Truck AC Compressor Sanden', oem: 'SND-TRK-750', category: 'Truck' },
    { name: 'Thermostatic Expansion Valve', oem: 'EXP-VAL-332', category: 'Car' },
    { name: 'AC Blower Motor Denso', oem: 'BLW-MTR-128', category: 'Car' },
    { name: 'Evaporator Cooling Coil Subros', oem: 'COIL-EV-901', category: 'Car' }
  ];

  const quickOems = [
    { code: '447260-3480', description: 'Denso 10S15C Compressor' },
    { code: 'SND-2918-09', description: 'Sanden TRSE09 Condenser' },
    { code: 'VAL-BLW-55', description: 'Valeo Double Blower Assembly' },
    { code: 'SND-4NCS-12', description: 'Sanden Heavy Compressor' },
    { code: 'SUB-EV-29', description: 'Subros Cooling Evaporator' }
  ];

  const trendingChips = [
    'AC Compressor',
    'Condenser',
    'Blower Motor',
    'Cooling Coil',
    'Expansion Valve',
    'OEM 447260'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [animateStats, setAnimateStats] = useState(false);
  const statsSectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setAnimateStats(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const targetEl = statsSectionRef.current;
    if (targetEl) {
      observer.observe(targetEl);
    }

    return () => {
      if (targetEl) {
        observer.unobserve(targetEl);
      }
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const selectSuggestion = (name) => {
    setSearchQuery(name);
    setShowSuggestions(false);
  };

  const executeSearch = () => {
    if (!searchQuery.trim()) return;
    let url = `/products?search=${encodeURIComponent(searchQuery)}`;
    if (selectedCategory !== 'All Categories') {
      const catParam = selectedCategory.replace(' AC Parts', '');
      url += `&category=${encodeURIComponent(catParam)}`;
    }
    navigate(url);
  };

  const toggleVoiceSearch = () => {
    if (voiceListening) {
      setVoiceListening(false);
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        setVoiceListening(true);
      };
      
      recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        setSearchQuery(speechToText);
        setShowSuggestions(true);
        setVoiceListening(false);
      };
      
      recognition.onerror = () => {
        setVoiceListening(false);
      };
      
      recognition.onend = () => {
        setVoiceListening(false);
      };
      
      recognition.start();
    } else {
      setVoiceListening(true);
      setTimeout(() => {
        const mockSearches = ["AC Compressor Swift", "Condenser Hilux", "Blower Motor Tata", "Cooling Coil XUV500"];
        const randomSearch = mockSearches[Math.floor(Math.random() * mockSearches.length)];
        setSearchQuery(randomSearch);
        setShowSuggestions(true);
        setVoiceListening(false);
      }, 2000);
    }
  };

  const filteredSuggestions = popularSuggestions.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.oem.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'All Categories') {
      return matchesSearch;
    } else {
      const targetCat = selectedCategory.replace(' AC Parts', '');
      return matchesSearch && item.category === targetCat;
    }
  });

  const previewProducts = products.filter(p => {
    if (!searchQuery) return false;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'All Categories') {
      return matchesQuery;
    } else {
      const targetCat = selectedCategory.replace(' AC Parts', '');
      return matchesQuery && p.category === targetCat;
    }
  });

  const stats = [
    { value: '1000+', label: 'Products Available' },
    { value: '50+', label: 'OEM & Aftermarket Brands' },
    { value: '1000+', label: 'Dealers & Workshops Served' },
    { value: '20+', label: 'Years in Automotive Cooling Solutions' },
  ];

  const features = [
    { icon: <Shield size={28} />, title: 'Genuine OEM & Aftermarket Parts', desc: 'Only original manufacturer and quality-tested replacement parts.' },
    { icon: <Package size={28} />, title: '1000+ SKUs Ready to Dispatch', desc: 'A massive wholesale inventory of AC compressors, condensers, blowers, and valves.' },
    { icon: <Truck size={28} />, title: 'Same-Day Shipping', desc: 'Quick dispatch and fast transit across India to minimize vehicle downtime.' },
    { icon: <Headphones size={28} />, title: 'Technical Support', desc: 'Get expert guidance and parts compatibility identification via WhatsApp.' },
  ];

  const vehicleTypes = [
    { name: 'Car', emoji: '🚗', desc: 'Sedans, Hatchbacks, SUVs', count: products.filter(p => p.category === 'Car').length },
    { name: 'Truck', emoji: '🚛', desc: 'Light & Heavy Commercial', count: products.filter(p => p.category === 'Truck').length },
    { name: 'Bus', emoji: '🚌', desc: 'Mini Bus & Fleet Vehicles', count: products.filter(p => p.category === 'Bus').length },
    { name: 'Payload Vehicle', emoji: '🚚', desc: 'Payloaders & Heavy Haulers', count: products.filter(p => p.category === 'Payload Vehicle').length },
    { name: 'Construction Vehicle', emoji: '🏗️', desc: 'Excavators, Loaders, Cranes', count: products.filter(p => p.category === 'Construction Vehicle').length },
    { name: 'Bulldozer', emoji: '🚜', desc: 'Bulldozers & Earthmovers', count: products.filter(p => p.category === 'Bulldozer').length },
  ];

  return (
    <div className="home-page page-transition">
      {/* HERO SECTION */}
      <section className="hero" id="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="section-label">
              AC Spare Parts Available <span className="dot"></span>
            </div>
            <h1 className="hero-title">
              India's Trusted Distributor of <br /><span className="highlight">Automotive AC Components</span>
            </h1>
            <p className="hero-subtitle">
              Supplying OEM and aftermarket AC components for cars, trucks, buses, SUVs, and commercial fleets. Trusted by workshops, dealers, and fleet operators across India.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="hero-cta premium-liquid-btn" id="hero-browse-btn">
                <span className="btn-content">
                  BROWSE PARTS <ArrowRight size={16} strokeWidth={3} />
                </span>
                <div className="liquid-bg">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path className="blob-1" d="M 0 0 C 35 15, 65 15, 80 80 C 80 120, 0 120, 0 120 Z" />
                    <path className="blob-2" d="M 100 100 C 65 85, 35 85, 20 20 C 20 -20, 100 -20, 100 -20 Z" />
                  </svg>
                </div>
              </Link>
              <a
                href="https://wa.me/919962173870?text=Hello%21%20I%27m%20visiting%20your%20website%20and%20would%20like%20to%20inquire%20about%20automotive%20AC%20parts."
                target="_blank"
                rel="noopener noreferrer"
                className="hero-whatsapp-btn premium-liquid-btn btn-whatsapp"
                id="hero-whatsapp-btn"
              >
                <span className="btn-content">
                  <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" className="whatsapp-icon" style={{ marginRight: '8px' }}>
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                  </svg>
                  <span>Chat on WhatsApp</span>
                </span>
                <div className="liquid-bg">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path className="blob-1" d="M 0 0 C 35 15, 65 15, 80 80 C 80 120, 0 120, 0 120 Z" />
                    <path className="blob-2" d="M 100 100 C 65 85, 35 85, 20 20 C 20 -20, 100 -20, 100 -20 Z" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img src={heroParts} alt="RCS AC Spare Parts" />
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-indicator">
            <div className="scroll-dot"></div>
          </div>
          <span>Scroll Down</span>
        </div>
      </section>

      {/* SUMMER SALE BANNER SECTION */}
      {showBanner && (
        <section className="summer-sale-section reveal">
          <div className="container">
            <a
              href="https://wa.me/919962173870?text=Hello%21%20I%27m%20interested%20in%20inquiring%20about%20your%20promotional%20sale%20offers."
              target="_blank"
              rel="noopener noreferrer"
              className="summer-sale-banner-link"
            >
              <div className="summer-sale-banner-wrapper">
                <img 
                  src={bannerImage || "/summer-sale.png"} 
                  alt="RCS Promotional Sale Banner" 
                  className="summer-sale-banner-img" 
                />
              </div>
            </a>
          </div>
        </section>
      )}

      {/* B2B SEARCH EXPERIENCE */}
      <section className="b2b-search-section">
        <div className="container">
          <div className="search-experience-wrapper reveal">
            <div className="search-card">
              <div className="search-header-row">
                <span className="search-pill">Automotive Parts Finder</span>
                <h3 className="search-card-title">Search Automotive AC Parts</h3>
              </div>

              {/* SEARCH TABS */}
              <div className="search-tabs">
                <button
                  className={`search-tab-btn ${searchMode === 'parts' ? 'active' : ''}`}
                  onClick={() => { setSearchMode('parts'); setVinResult(null); setSelectedHotspot(null); }}
                  id="tab-search-parts"
                >
                  <Search size={15} />
                  <span>Search Parts / OEM</span>
                </button>
                <button
                  className={`search-tab-btn ${searchMode === 'vehicle' ? 'active' : ''}`}
                  onClick={() => { setSearchMode('vehicle'); setVinResult(null); setSelectedHotspot(null); }}
                  id="tab-search-vehicle"
                >
                  <Sliders size={15} />
                  <span>Find by Vehicle</span>
                </button>
                <button
                  className={`search-tab-btn ${searchMode === 'vin' ? 'active' : ''}`}
                  onClick={() => { setSearchMode('vin'); setVinResult(null); setSelectedHotspot(null); }}
                  id="tab-search-vin"
                >
                  <Car size={15} strokeWidth={2.2} />
                  <span>Vehicle Plate Number</span>
                </button>
                <button
                  className={`search-tab-btn ${searchMode === 'image' ? 'active' : ''}`}
                  onClick={() => { setSearchMode('image'); setVinResult(null); setSelectedHotspot(null); }}
                  id="tab-search-image"
                >
                  <Camera size={15} />
                  <span>Upload Part Image</span>
                </button>
              </div>

              {searchMode === 'parts' ? (
                <>
                  <div className="unified-search-bar">
                    {/* CATEGORY SELECTOR */}
                    <div className="category-select-wrapper" ref={categoryRef}>
                      <button className="category-dropdown-btn" onClick={() => setCatOpen(!catOpen)}>
                        <span>{selectedCategory}</span>
                        <ChevronDown size={14} />
                      </button>
                      {catOpen && (
                        <ul className="category-dropdown-menu">
                          {categoriesList.map(cat => (
                            <li key={cat} onClick={() => { setSelectedCategory(cat); setCatOpen(false); }}>
                              {cat}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* SEARCH INPUT */}
                    <div className="search-input-inner-wrapper">
                      <input
                        type="text"
                        placeholder="Search AC compressors, condensers, blower motors, OEM parts..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={(e) => { if (e.key === 'Enter') executeSearch(); }}
                        className="main-search-input"
                      />
                      {searchQuery && (
                        <button className="clear-search-btn" onClick={clearSearch}>
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* VOICE SEARCH */}
                    <button 
                      className={`voice-search-btn ${voiceListening ? 'listening' : ''}`}
                      onClick={toggleVoiceSearch}
                      title="Voice Search"
                    >
                      {voiceListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>

                    <button className="search-execute-btn premium-liquid-btn" onClick={executeSearch}>
                      <span className="btn-content">
                        <Search size={16} />
                        <span>Search</span>
                      </span>
                      <div className="liquid-bg">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path className="blob-1" d="M 0 0 C 35 15, 65 15, 80 80 C 80 120, 0 120, 0 120 Z" />
                          <path className="blob-2" d="M 100 100 C 65 85, 35 85, 20 20 C 20 -20, 100 -20, 100 -20 Z" />
                        </svg>
                      </div>
                    </button>
                  </div>

                  {/* AUTO-SUGGESTIONS DROPDOWN */}
                  {showSuggestions && (
                    <div className="search-suggestions-dropdown" ref={suggestionsRef}>
                      <div className="suggestions-grid">
                        <div className="suggestions-left">
                          <div className="suggestions-section-title">
                            <Sparkles size={12} />
                            <span>Intelligent Suggestions</span>
                          </div>
                          <ul className="suggestions-list">
                            {filteredSuggestions.length > 0 ? (
                              filteredSuggestions.map((item, index) => (
                                <li 
                                  key={index}
                                  onClick={() => selectSuggestion(item.name)}
                                  className="suggestion-item"
                                >
                                  <div className="suggestion-item-icon">
                                    <Search size={12} />
                                  </div>
                                  <div className="suggestion-item-details">
                                    <span className="suggestion-name">{item.name}</span>
                                    <span className="suggestion-meta">OEM: {item.oem} • Category: {item.category}</span>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <li className="no-suggestions-item">No matching spare parts found. Try "Compressor".</li>
                            )}
                          </ul>
                        </div>

                        <div className="suggestions-right">
                          <div className="suggestions-section-title">
                            <Clock size={12} />
                            <span>Quick Reference OEM Codes</span>
                          </div>
                          <ul className="quick-oem-list">
                            {quickOems.map((oem, index) => (
                              <li key={index} onClick={() => selectSuggestion(oem.code)} className="oem-item">
                                <span className="oem-code">{oem.code}</span>
                                <span className="oem-desc">{oem.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TRENDING CATEGORY CHIPS */}
                  <div className="trending-chips-row">
                    <span className="trending-label">Trending Searches:</span>
                    <div className="chips-container">
                      {trendingChips.map(chip => (
                        <button 
                          key={chip} 
                          className="trending-chip"
                          onClick={() => selectSuggestion(chip)}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : searchMode === 'vehicle' ? (
                /* VEHICLE FINDER WIZARD PANEL */
                <div className="vehicle-search-container">
                  <p className="vehicle-search-description">
                    Select your vehicle's manufacturer make, model, and year to instantly search matching AC parts. Catalog covers <strong>passenger cars, utility vehicles, and heavy commercial vehicles available in the Indian market</strong>.
                  </p>

                  <div className="vehicle-wizard-flex">
                    <div className="vehicle-wizard-form">
                      <div className="vehicle-wizard-grid">
                        <div className="wizard-dropdown-group">
                          <label htmlFor="wizard-make">Vehicle Make</label>
                          <div className="select-wrapper">
                            <select
                              id="wizard-make"
                              value={selectedMake}
                              onChange={(e) => {
                                setSelectedMake(e.target.value);
                                setSelectedModel('');
                                setSelectedYear('');
                              }}
                              className="wizard-select"
                            >
                              <option value="">Select Manufacturer</option>
                              {Object.keys(vehicleData).map(make => (
                                <option key={make} value={make}>{make}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="wizard-dropdown-group">
                          <label htmlFor="wizard-model">Vehicle Model</label>
                          <div className="select-wrapper">
                            <select
                              id="wizard-model"
                              value={selectedModel}
                              disabled={!selectedMake}
                              onChange={(e) => {
                                setSelectedModel(e.target.value);
                                setSelectedYear('');
                              }}
                              className="wizard-select"
                            >
                              <option value="">Select Model</option>
                              {selectedMake && vehicleData[selectedMake].map(model => (
                                <option key={model} value={model}>{model}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="wizard-dropdown-group">
                          <label htmlFor="wizard-year">Manufacturing Year</label>
                          <div className="select-wrapper">
                            <select
                              id="wizard-year"
                              value={selectedYear}
                              disabled={!selectedModel}
                              onChange={(e) => setSelectedYear(e.target.value)}
                              className="wizard-select"
                            >
                              <option value="">Select Year</option>
                              {vehicleYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedMake && selectedModel && (
                      <div className="wizard-vehicle-preview">
                        <img
                          src={resolveVehicleDetails(selectedMake, selectedModel).vehicleImage}
                          alt={`${selectedMake} ${selectedModel} preview`}
                          onError={(e) => handleImageError(e, selectedMake, selectedModel)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="wizard-actions-row">
                    <button
                      className="wizard-submit-btn premium-liquid-btn"
                      onClick={handleVehicleSearch}
                      disabled={!selectedMake || !selectedModel || !selectedYear}
                      type="button"
                    >
                      <span className="btn-content">
                        <Search size={16} />
                        <span>Find Compatible Parts</span>
                      </span>
                      <div className="liquid-bg">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path className="blob-1" d="M 0 0 C 35 15, 65 15, 80 80 C 80 120, 0 120, 0 120 Z" />
                          <path className="blob-2" d="M 100 100 C 65 85, 35 85, 20 20 C 20 -20, 100 -20, 100 -20 Z" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              ) : searchMode === 'vin' ? (
                /* VEHICLE REGISTRATION LOOKUP UI -> WHATSAPP REQUEST FORM */
                <div className="whatsapp-request-container animate-fade-in-up">
                  <div className="whatsapp-request-card">
                    <div className="request-card-header">
                      <span className="card-tag">— SEND A REQUEST</span>
                      <h2>Send us a WhatsApp message</h2>
                    </div>
                    <form onSubmit={sendPlateWhatsApp} className="request-form-grid">
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Your Name *"
                          required
                          value={plateForm.name}
                          onChange={(e) => setPlateForm({...plateForm, name: e.target.value})}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Product / Spare Part Needed"
                          value={plateForm.product}
                          onChange={(e) => setPlateForm({...plateForm, product: e.target.value})}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Vehicle Reg Number"
                          value={plateForm.regNumber}
                          onChange={(e) => setPlateForm({...plateForm, regNumber: e.target.value})}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="VIN or Chassis Number"
                          value={plateForm.vin}
                          onChange={(e) => setPlateForm({...plateForm, vin: e.target.value})}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group full-width">
                        <input
                          type="tel"
                          placeholder="Phone Number / Contact Number *"
                          required
                          value={plateForm.phone}
                          onChange={(e) => setPlateForm({...plateForm, phone: e.target.value})}
                          className="form-input"
                        />
                      </div>
                      
                      <button type="submit" className="premium-liquid-btn btn-whatsapp-submit">
                        <span className="btn-content">
                          <span>SEND VIA WHATSAPP</span>
                          <ArrowRight size={16} />
                        </span>
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                /* UPLOAD PART IMAGE UI */
                <div className="image-search-container">
                  {!imagePreviewUrl ? (
                    <div
                      className={`image-upload-panel ${imageDragActive ? 'active' : ''}`}
                      onDragEnter={handleImageDrag}
                      onDragOver={handleImageDrag}
                      onDragLeave={handleImageDrag}
                      onDrop={handleImageDrop}
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <div className="image-upload-icon-container">
                        <Upload size={24} />
                      </div>
                      <div className="image-upload-text">
                        <h4>📷 Upload a Photo of your AC Part</h4>
                        <p>Drag & Drop or click to choose an image (PNG, JPG, WebP)</p>
                      </div>
                      <input
                        type="file"
                        ref={imageInputRef}
                        onChange={handleImageFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                    </div>
                  ) : (
                    <div className="image-preview-wrapper animate-fade-in-up">
                      <div className="image-preview-container">
                        <div className="image-preview-box">
                          <img src={imagePreviewUrl} alt="Selected AC part" />
                        </div>
                        <div className="image-preview-info">
                          <h6 className="image-preview-name">{imageFile?.name || 'ac_part_photo.png'}</h6>
                          <span className="image-preview-size">
                            {imageFile ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
                          </span>
                        </div>
                        <button 
                          className="image-preview-clear" 
                          onClick={clearSelectedImage}
                          title="Remove Image"
                          type="button"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <textarea
                        className="image-enquiry-textarea"
                        placeholder="Describe your vehicle or what AC part you need (e.g. Compressor for Swift 2018)..."
                        value={imageDesc}
                        onChange={(e) => setImageDesc(e.target.value)}
                        rows={3}
                        disabled={isImageUploading}
                      />

                      {imageUploadErr && (
                        <div className="image-upload-error">
                          <AlertTriangle size={16} />
                          <span>{imageUploadErr}</span>
                        </div>
                      )}

                      <button
                        className="image-submit-btn"
                        onClick={handleSendImageEnquiry}
                        disabled={isImageUploading}
                        type="button"
                      >
                        {isImageUploading ? (
                          <>
                            <div className="admin-preview-spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                            <span>Uploading and compressing...</span>
                          </>
                        ) : (
                          <>
                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                            </svg>
                            <span>Send Photo Enquiry via WhatsApp</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Results section anchor for vehicle wizard / VIN decode */}
            <div id="vehicle-wizard-results-anchor" style={{ scrollMarginTop: '80px' }} />

            {/* Simulated Loading State */}
            {(searchMode === 'vin' || searchMode === 'vehicle') && vinResult === 'loading' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 0',
                gap: '16px',
                marginTop: '24px',
                background: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}>
                <div className="admin-preview-spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--gray-200)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-500)' }}>Locating compatible specifications and diagrams...</span>
              </div>
            )}

            {/* Decoded results layout */}
            {(searchMode === 'vin' || searchMode === 'vehicle') && vinResult && vinResult !== 'loading' && (
              <div className="vin-results-wrapper animate-fade-in-up">
                {/* Success Alert */}
                <div className="vin-results-header">
                  <div>
                    {vinResult.isSimulated ? (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#FFF3E0',
                        color: '#E65100',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '12px'
                      }}>
                        <HelpCircle size={14} />
                        <span>Simulated Match</span>
                      </div>
                    ) : (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#E8F5E9',
                        color: '#2E7D32',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '12px'
                      }}>
                        <ShieldCheck size={14} />
                        <span>Vehicle Identified</span>
                      </div>
                    )}
                    <h2 style={{
                      fontSize: '24px',
                      fontWeight: 800,
                      color: 'var(--black)',
                      margin: 0,
                      fontFamily: 'inherit'
                    }}>
                      {vinResult.make} {vinResult.model} ({vinResult.year})
                    </h2>
                  </div>
                  
                  {vinResult.isSimulated && (
                    <div style={{
                      background: '#FFF8E1',
                      border: '1.5px solid #FFE082',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      marginTop: '16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      fontSize: '13px',
                      color: '#B78103',
                      lineHeight: '1.5',
                      width: '100%'
                    }}>
                      <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                      <div>
                        <strong>Demo Mode Notification:</strong> A/C spec search is currently in offline demo simulation mode. To connect the site to the live Indian VAHAN RTO database to fetch real-time specs for any registration plate in India, configure the <strong>VITE_INDIAN_VEHICLE_API_KEY</strong> environment variable in your <code>.env</code> file.
                      </div>
                    </div>
                  )}

                  {vinResult.vehicleImage && (
                    <div className="vin-vehicle-image-box">
                      <img
                        src={vinResult.vehicleImage}
                        alt={`${vinResult.make} ${vinResult.model}`}
                        onError={(e) => handleImageError(e, vinResult.make, vinResult.model)}
                      />
                    </div>
                  )}
                </div>

                <hr className="vin-divider" />

                {/* Info Cards Grid */}
                <div className="vin-specs-cards-grid">
                  {/* Card 1: Vehicle Information */}
                  <div className="vin-spec-card">
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: 'var(--gray-700)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      margin: '0 0 20px 0'
                    }}>
                      Vehicle Technical Specifications
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ color: 'var(--gray-500)' }}>Manufacturer:</span>
                        <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{vinResult.make}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ color: 'var(--gray-500)' }}>Model Series:</span>
                        <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{vinResult.model}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ color: 'var(--gray-500)' }}>Model Year:</span>
                        <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{vinResult.year}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ color: 'var(--gray-500)' }}>Engine Displacement:</span>
                        <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{vinResult.engine}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ color: 'var(--gray-500)' }}>Fuel Type:</span>
                        <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{vinResult.fuelType}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ color: 'var(--gray-500)' }}>Chassis ID / VIN:</span>
                        <span style={{ fontWeight: 600, color: 'var(--gray-800)', fontFamily: 'monospace' }}>{vinResult.chassis}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ color: 'var(--gray-500)' }}>Manufactured Region:</span>
                        <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{vinResult.region}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: AC System Technical Data */}
                  <div className="vin-spec-card">
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: 'var(--gray-700)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      margin: '0 0 20px 0'
                    }}>
                      AC System Technical Data
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ color: 'var(--gray-500)' }}>OEM Compressor:</span>
                        <span style={{ fontWeight: 600, color: 'var(--gray-800)', textAlign: 'right', marginLeft: '12px' }}>{vinResult.specs.compressor}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ color: 'var(--gray-500)' }}>Refrigerant Charge:</span>
                        <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{vinResult.specs.refrigerant}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ color: 'var(--gray-500)' }}>Lubricant Oil:</span>
                        <span style={{ fontWeight: 600, color: 'var(--gray-800)', textAlign: 'right', marginLeft: '12px' }}>{vinResult.specs.oil}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ color: 'var(--gray-500)' }}>AC Drive Belt Type:</span>
                        <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{vinResult.specs.belt}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ color: 'var(--gray-500)' }}>Cabin Pollen Filter:</span>
                        <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{vinResult.specs.pollenFilter}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exploded Parts Diagram */}
                {vinResult.diagramId && (
                  <ExplodedDiagram
                    diagramId={vinResult.diagramId}
                    vehicleInfo={vinResult}
                    onSelectComponent={(pin) => setSelectedHotspot(pin)}
                    selectedComponentOem={selectedHotspot?.oem}
                  />
                )}

                {/* Compatible Spare Parts */}
                <div className="compatible-parts-section" style={{ marginTop: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gray-500)', margin: 0, letterSpacing: '0.5px' }}>
                      {selectedHotspot 
                        ? `Compatible Parts for: ${selectedHotspot.component}` 
                        : 'Compatible AC Spare Parts In Our Stock'}
                    </h4>
                    {selectedHotspot && (
                      <button 
                        onClick={() => setSelectedHotspot(null)}
                        style={{
                          background: 'var(--gray-100)',
                          border: '1px solid var(--gray-200)',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: 'var(--gray-600)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        Show All Parts
                      </button>
                    )}
                  </div>

                  <div className="compatible-parts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                    {getProducts()
                      .filter(product => vinResult.compatiblePartIds.includes(product.id))
                      .filter(product => {
                        if (!selectedHotspot) return true;
                        const compName = selectedHotspot.component.toLowerCase();
                        const prodName = product.name.toLowerCase();
                        return prodName.includes(compName) || compName.includes(prodName);
                      })
                      .map(product => (
                        <Link
                          key={product.id}
                          to={`/products?search=${encodeURIComponent(product.name)}`}
                          className="catalog-match-card-link"
                          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                        >
                          <div 
                            className="catalog-match-card clickable-match-card" 
                            style={{
                              display: 'flex',
                              gap: '12px',
                              padding: '12px',
                              background: 'var(--gray-50)',
                              border: '1px solid var(--gray-200)',
                              borderRadius: '8px',
                              alignItems: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div className="match-img-box" style={{ width: '48px', height: '48px', background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', flexShrink: 0 }}>
                              <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = 'https://placehold.co/50x50?text=Part'; }} />
                            </div>
                            <div className="match-info-box" style={{ flex: 1, minWidth: 0 }}>
                              <span className="match-brand-tag" style={{ fontSize: '9px', fontWeight: 800, color: 'var(--gray-400)', textTransform: 'uppercase' }}>{product.brand}</span>
                              <h6 className="match-title" style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: 700, color: 'var(--black)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h6>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                  {getProducts()
                    .filter(product => vinResult.compatiblePartIds.includes(product.id))
                    .filter(product => {
                      if (!selectedHotspot) return true;
                      const compName = selectedHotspot.component.toLowerCase();
                      const prodName = product.name.toLowerCase();
                      return prodName.includes(compName) || compName.includes(prodName);
                    }).length === 0 && (
                      <div style={{ textAlign: 'center', padding: '24px', background: 'var(--gray-50)', borderRadius: '8px', border: '1px dashed var(--gray-200)', color: 'var(--gray-500)', fontSize: '13px' }}>
                        No compatible stock items matching this component found. Please click "Request Quote" above to enquire directly.
                      </div>
                    )}
                </div>

                {/* WhatsApp Enquiry Button */}
                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
                  <a
                    href={`https://wa.me/919962173870?text=${encodeURIComponent(
                      `Hi RCS, I would like to enquire about compatible AC spare parts for my vehicle:\n\n*Vehicle:* ${vinResult.make} ${vinResult.model} (${vinResult.year})\n*Chassis ID/VIN:* ${vinResult.chassis}\n*Engine:* ${vinResult.engine}\n\nPlease check availability and pricing for stock components.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vin-whatsapp-btn"
                  >
                    <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 16 16">
                      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                    </svg>
                    <span style={{ marginLeft: '10px' }}>Enquire via WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
            
            {/* REAL-TIME B2B SEARCH RESULTS PREVIEW */}
            {searchQuery && (
              <div className="search-preview-panel animate-fade-in-up">
                <div className="preview-header">
                  <h4>Live Inventory Preview ({previewProducts.length} matched)</h4>
                  <Link to={`/products?search=${searchQuery}`} className="view-full-catalog-link">
                    View Full Catalog <ArrowRight size={14} />
                  </Link>
                </div>
                {previewProducts.length > 0 ? (
                  <div className="preview-grid">
                    {previewProducts.slice(0, 3).map(p => (
                      <div key={p.id} className="preview-card">
                        <div className="preview-img-container">
                          <img src={p.image} alt={p.name} onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Part'; }} />
                        </div>
                        <div className="preview-details">
                          <span className="preview-category-tag">{p.category}</span>
                          <h5>{p.name}</h5>
                          <p className="preview-desc">{p.description.substring(0, 60)}...</p>
                          <div className="preview-footer">
                            <span className="preview-brand">{p.brand}</span>
                            <a 
                              href={`https://wa.me/919962173870?text=Hi, I would like to get a wholesale quote for ${p.name} (${p.brand})`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="preview-quote-btn"
                            >
                              Get Quote
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="preview-no-results">
                    <p>No immediate inventory matches for "<strong>{searchQuery}</strong>".</p>
                    <a 
                      href={`https://wa.me/919962173870?text=Hi, I am looking for parts matching: ${searchQuery}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-query-btn"
                    >
                      Inquire on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW ORDERING WORKS */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="container">
          <div className="section-label">How Ordering Works <span className="dot"></span></div>
          <h2 className="section-title">Three steps to your parts</h2>
          
          <div className="steps-grid">
            <div className="step-card animate-fade-in-up">
              <div className="step-number-container">
                <span className="step-number">1</span>
              </div>
              <div className="step-content">
                <h4 className="step-title">Browse and Add to Basket</h4>
                <p className="step-desc">
                  Find the parts you need by category, brand, or vehicle. Add them to your Enquiry Basket — no registration required.
                </p>
              </div>
            </div>
            
            <div className="step-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="step-number-container">
                <span className="step-number">2</span>
              </div>
              <div className="step-content">
                <h4 className="step-title">Send your list via WhatsApp</h4>
                <p className="step-desc">
                  Tap "Send Enquiry via WhatsApp" — your selected parts list is pre-filled. We respond with availability and pricing within the hour.
                </p>
              </div>
            </div>
            
            <div className="step-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="step-number-container">
                <span className="step-number">3</span>
              </div>
              <div className="step-content">
                <h4 className="step-title">Confirm and we dispatch</h4>
                <p className="step-desc">
                  Approve the quote on WhatsApp. We dispatch same day or next day to anywhere in India via our logistics network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="stats-bar" id="stats-section" ref={statsSectionRef}>
        <div className="container stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className={`stat-item reveal delay-${i * 100}`}>
              <span className="stat-value"><Counter target={stat.value} animate={animateStats} /></span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* COMPATIBLE VEHICLE BRANDS MARQUEE */}
      <section className="home-brands-marquee-section" id="compatible-brands-section">
        <div className="container">
          <div className="section-label">Compatible Manufacturers <span className="dot"></span></div>
          <h2 className="section-title">
            Compatible with <span className="highlight">All Major Brands</span>
          </h2>
          <p className="section-subtitle-compact">
            We distribute high-performance AC spare parts compatible with 37+ global vehicle manufacturers.
          </p>
          
          <div className="brands-marquee-container">
            <div className="brands-marquee-track">
              {/* Duplicate the list to create a seamless infinite loop */}
              {[...marqueeBrands, ...marqueeBrands].map((brand, i) => (
                <div key={i} className="marquee-logo-card">
                  <img src={brand.logoUrl} alt={`${brand.name} logo`} className="marquee-logo-img" />
                  <span>{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="view-all-brands-wrapper">
            <Link to="/car-brands" className="view-all-brands-btn">
              Explore All 37 Compatible Brands <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* VEHICLE TYPES */}
      <section className="vehicle-section" id="vehicle-types">
        <div className="container">
          <div className="section-label">Browse By Vehicle <span className="dot"></span></div>
          <h2 className="section-title">
            Parts for <span className="highlight">Every</span> Vehicle Type
          </h2>
          <div className="vehicle-grid">
            {vehicleTypes.map((type, i) => (
              <Link
                to={`/products?category=${type.name}`}
                key={type.name}
                className={`vehicle-card reveal delay-${(i % 3) * 100}`}
                id={`vehicle-${type.name.toLowerCase()}`}
              >
                <span className="vehicle-emoji">{type.emoji}</span>
                <h3>{type.name} AC Parts</h3>
                <p>{type.desc}</p>
                <span className="vehicle-count">{type.count} Products</span>
                <ArrowRight size={18} className="vehicle-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="featured-section" id="featured-products">
        <div className="container">
          <div className="featured-header">
            <div>
              <div className="section-label">Top Picks <span className="dot"></span></div>
              <h2 className="section-title">
                Featured <span className="highlight">Products</span>
              </h2>
            </div>
            <Link to="/products" className="view-all-btn" id="view-all-products">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="products-grid">
            {featured.map((product, i) => (
              <div key={product.id} className={`reveal delay-${(i % 4) * 100}`} style={{ display: 'flex', flexDirection: 'column' }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="features-section" id="features-section">
        <div className="container">
          <div className="section-label">Why Workshops Choose RCS <span className="dot"></span></div>
          <h2 className="section-title">
            Why Workshops <span className="highlight">Choose RCS</span>
          </h2>
          <div className="features-grid">
            {features.map((feat, i) => (
              <div key={i} className={`feature-card reveal delay-${i * 100}`}>
                <div className="feature-icon">{feat.icon}</div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section" id="faq-section">
        <div className="container">
          <div className="section-label" style={{ textAlign: 'center', margin: '0 auto 12px', display: 'block', width: 'fit-content' }}>Common Queries <span className="dot"></span></div>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '16px' }}>
            Frequently Asked <span className="highlight">Questions</span>
          </h2>
          <p className="section-subtitle-compact" style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
            Find answers to common questions about parts compatibility, shipping, wholesale accounts, and order support.
          </p>

          {/* FAQ Category Tabs */}
          <div className="faq-categories-tabs">
            {faqCategories.map(cat => (
              <button
                key={cat.id}
                className={`faq-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveFaq(null); // Reset active accordion item
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="faq-accordion">
            {faqCategories.find(cat => cat.id === activeCategory).items.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className={`faq-item ${isOpen ? 'open' : ''}`}
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                >
                  <div className="faq-question">
                    <h3>{faq.q}</h3>
                    <span className="faq-toggle-icon"></span>
                  </div>
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-section" id="cta-section">
        <div className="container">
          <div className="cta-card reveal scale-up">
            <h2>Ready to <span className="highlight">Order?</span></h2>
            <p>Browse our complete catalog or reach out via WhatsApp for instant quotes and availability.</p>
            <div className="cta-buttons">
              <Link to="/products" className="cta-btn primary">
                Browse Products <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/919962173870"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn whatsapp"
              >
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}>
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
