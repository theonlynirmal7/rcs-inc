import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, Truck, Shield, Headphones, Zap, Search, Mic, MicOff, X, Sparkles, Clock, Package, Tag, Car, ShieldCheck, AlertTriangle, HelpCircle, Camera, Upload, Sliders } from 'lucide-react';
import { getProducts, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import ExplodedDiagram from '../components/ExplodedDiagram';
import heroParts from '../assets/hero-parts.png';
import { dbService } from '../supabase';
import './Home.css';

const marqueeBrands = [
  { name: 'Maruti Suzuki', logoUrl: '/brand-logos/suzuki.png' },
  { name: 'Toyota', logoUrl: '/brand-logos/toyota.png' },
  { name: 'Hyundai', logoUrl: '/brand-logos/hyundai.png' },
  { name: 'Honda', logoUrl: '/brand-logos/honda.png' },
  { name: 'Tata Motors', logoUrl: '/brand-logos/tata.png' },
  { name: 'Mahindra', logoUrl: '/brand-logos/mahindra.png' },
  { name: 'BMW', logoUrl: '/brand-logos/bmw.png' },
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
    'Maruti Suzuki': ['Swift', 'WagonR', 'Dzire', 'Baleno', 'Brezza', 'Ertiga', 'Alto'],
    'Hyundai': ['i10', 'i20', 'Creta', 'Verna', 'Venue', 'Santro'],
    'Honda': ['City', 'Amaze', 'Civic', 'Jazz', 'WR-V'],
    'Tata Motors': ['Nexon', 'Tiago', 'Harrier', 'Safari', 'Altroz', 'Punch'],
    'Mahindra': ['Scorpio', 'XUV700', 'Thar', 'Bolero', 'XUV300'],
    'Toyota': ['Innova', 'Fortuner', 'Glanza', 'Urban Cruiser', 'Corolla']
  };

  const vehicleYears = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'];

  const handleVehicleSearch = () => {
    if (selectedModel) {
      navigate(`/products?search=${encodeURIComponent(selectedModel)}`);
    }
  };
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

  const decodeVin = async (vinToDecode) => {
    const vin = (vinToDecode || vinQuery).trim().toUpperCase();
    if (!vin) {
      setVinError('Please enter a VIN or Chassis Number.');
      setVinResult(null);
      return;
    }

    setVinError(null);
    setVinResult('loading'); // Show spinner

    const samples = {
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
        compatiblePartIds: [1, 2, 6, 11]
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
        compatiblePartIds: [1, 2, 3, 6]
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
        compatiblePartIds: [1, 2, 6]
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
        compatiblePartIds: [1, 2, 11]
      }
    };

    if (samples[vin]) {
      setVinResult(samples[vin]);
      return;
    }

    const cleanVin = vin.replace(/[^A-HJ-NPR-Z0-9]/gi, '');
    if (cleanVin.length < 5) {
      setVinError('Invalid Chassis format. Please enter a valid VIN / Chassis Number.');
      setVinResult(null);
      return;
    }

    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${cleanVin}?format=json`);
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

        // Fallback if WMI is unrecognized by NHTSA
        if (!make || make === 'INVALID VIN' || make.toLowerCase().includes('error')) {
          decodeFallback(cleanVin);
          return;
        }

        // Format casing
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

        // Standardize fuel output
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

        setVinResult({
          make,
          model,
          year,
          engine: engine || 'Standard Fuel-Injected Engine',
          fuelType: normalizedFuel,
          chassis: cleanVin,
          region: region || info.PlantState || 'International WMI',
          specs,
          compatiblePartIds: compatIds
        });
      } else {
        decodeFallback(cleanVin);
      }
    } catch (err) {
      console.warn("NHTSA API failed, using fallback decoder:", err);
      decodeFallback(cleanVin);
    }
  };

  const decodeFallback = (cleanVin) => {
    let make = 'Generic Vehicle';
    let model = 'Universal Model';
    let compatIds = [1, 2, 6];

    const wmi = cleanVin.substring(0, 3);
    if (wmi.startsWith('MA3') || wmi.startsWith('MS1')) {
      make = 'Maruti Suzuki';
      model = 'Swift / Baleno / Ertiga Series';
      compatIds = [1, 2, 6, 11];
    } else if (wmi.startsWith('MAL') || wmi.startsWith('KMH')) {
      make = 'Hyundai';
      model = 'Creta / i20 / Verna Series';
      compatIds = [1, 2, 3, 6];
    } else if (wmi.startsWith('MAT') || wmi.startsWith('TTR')) {
      make = 'Tata Motors';
      model = 'Nexon / Altroz / Safari Series';
      compatIds = [1, 2, 6];
    } else if (wmi.startsWith('MBJ') || wmi.startsWith('MHF') || wmi.startsWith('JTD')) {
      make = 'Toyota';
      model = 'Innova / Fortuner / Glanza Series';
      compatIds = [1, 2, 11];
    } else if (wmi.startsWith('MPH') || wmi.startsWith('MA1')) {
      make = 'Mahindra';
      model = 'XUV700 / Scorpio-N / Thar Series';
      compatIds = [1, 2, 6, 11];
    } else if (wmi.startsWith('SHS') || wmi.startsWith('MRH')) {
      make = 'Honda';
      model = 'City / Amaze / Elevate Series';
      compatIds = [1, 2, 3, 6];
    } else if (wmi.startsWith('WVW') || wmi.startsWith('WVG')) {
      make = 'Volkswagen';
      model = 'Virtus / Taigun / Polo';
      compatIds = [1, 2, 6];
    } else if (wmi.startsWith('WBA') || wmi.startsWith('WBY')) {
      make = 'BMW';
      model = '3-Series / X3';
      compatIds = [1, 2, 6, 11];
    } else if (wmi.startsWith('WDD') || wmi.startsWith('W1K')) {
      make = 'Mercedes-Benz';
      model = 'C-Class / GLC';
      compatIds = [1, 2, 6, 11];
    } else if (wmi.startsWith('1FV') || wmi.startsWith('4UZ') || cleanVin.includes('TRUCK') || cleanVin.includes('BUS')) {
      make = 'Heavy Commercial';
      model = 'Truck / Bus Fleet Carrier';
      compatIds = [5, 7, 8, 12];
    }

    let year = '2022';
    if (cleanVin.length >= 10) {
      const yearChar = cleanVin.charAt(9);
      const yearMap = {
        'A': '2010', 'B': '2011', 'C': '2012', 'D': '2013', 'E': '2014', 'F': '2015',
        'G': '2016', 'H': '2017', 'J': '2018', 'K': '2019', 'L': '2020', 'M': '2021',
        'N': '2022', 'P': '2023', 'R': '2024', 'S': '2025', 'T': '2026'
      };
      year = yearMap[yearChar] || '2022';
    }

    const isHeavy = compatIds.includes(5) || compatIds.includes(8);
    const specs = isHeavy ? {
      compressor: 'Sanden Heavy-Duty Compressor',
      refrigerant: 'R-134a (950 ± 50g)',
      oil: 'PAG 100 (220 ml)',
      belt: '8PK1540',
      pollenFilter: '280 x 240 x 35 mm'
    } : {
      compressor: 'Denso / Subros Compact Rotary',
      refrigerant: 'R-134a (430 ± 15g)',
      oil: 'PAG 46 (90 ml)',
      belt: '6PK1080',
      pollenFilter: '215 x 190 x 25 mm'
    };

    // Smart heuristic for fuel
    let fuel = isHeavy ? 'Diesel' : 'Petrol';
    const upperVin = cleanVin.toUpperCase();
    if (upperVin.includes('DIESEL') || upperVin.includes('DSL') || make === 'Toyota' || make === 'Mahindra') {
      fuel = 'Diesel';
    }

    setVinResult({
      make,
      model: `${model} (Auto-Decoded)`,
      year,
      engine: isHeavy ? '5.2L Turbocharged Diesel' : '1.2L - 1.5L Fuel-Injected Engine',
      fuelType: fuel,
      chassis: cleanVin,
      region: 'WMI Decoded Region',
      specs,
    });
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
    { value: '500+', label: 'Products Available' },
    { value: '50+', label: 'OEM & Aftermarket Brands' },
    { value: '1000+', label: 'Dealers & Workshops Served' },
    { value: '20+', label: 'Years in Automotive Cooling Solutions' },
  ];

  const features = [
    { icon: <Shield size={28} />, title: 'Genuine OEM & Aftermarket Parts', desc: 'Only original manufacturer and quality-tested replacement parts.' },
    { icon: <Package size={28} />, title: '500+ SKUs Ready to Dispatch', desc: 'A massive wholesale inventory of AC compressors, condensers, blowers, and valves.' },
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
              <Link to="/products" className="hero-cta" id="hero-browse-btn">
                BROWSE PARTS <ArrowRight size={16} strokeWidth={3} />
              </Link>
              <a
                href="https://wa.me/919962173870?text=Hello%21%20I%27m%20visiting%20your%20website%20and%20would%20like%20to%20inquire%20about%20automotive%20AC%20parts."
                target="_blank"
                rel="noopener noreferrer"
                className="hero-whatsapp-btn"
                id="hero-whatsapp-btn"
              >
                <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" className="whatsapp-icon" style={{ marginRight: '8px' }}>
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                <span>Chat on WhatsApp</span>
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
                  onClick={() => { setSearchMode('parts'); setVinResult(null); }}
                  id="tab-search-parts"
                >
                  <Search size={15} />
                  <span>Search Parts / OEM</span>
                </button>
                <button
                  className={`search-tab-btn ${searchMode === 'vehicle' ? 'active' : ''}`}
                  onClick={() => { setSearchMode('vehicle'); }}
                  id="tab-search-vehicle"
                >
                  <Sliders size={15} />
                  <span>Find by Vehicle</span>
                </button>
                <button
                  className={`search-tab-btn ${searchMode === 'vin' ? 'active' : ''}`}
                  onClick={() => { setSearchMode('vin'); }}
                  id="tab-search-vin"
                >
                  <Car size={15} strokeWidth={2.2} />
                  <span>VIN / Chassis Lookup</span>
                </button>
                <button
                  className={`search-tab-btn ${searchMode === 'image' ? 'active' : ''}`}
                  onClick={() => { setSearchMode('image'); }}
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

                    {/* SEARCH BUTTON */}
                    <button className="search-execute-btn" onClick={executeSearch}>
                      <Search size={16} />
                      <span>Search</span>
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
                    Select your vehicle's manufacturer make, model, and year to instantly search matching AC compressors, condensers, and other spare parts.
                  </p>

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

                  <div className="wizard-actions-row">
                    <button
                      className="wizard-submit-btn"
                      onClick={handleVehicleSearch}
                      disabled={!selectedMake || !selectedModel || !selectedYear}
                      type="button"
                    >
                      <Search size={16} />
                      <span>Find Compatible Parts</span>
                    </button>
                  </div>
                </div>
              ) : searchMode === 'vin' ? (
                /* VIN / CHASSIS LOOKUP UI */
                <div className="vin-search-container">
                  <div className="vin-help-header">
                    <p className="vin-search-description">
                      Enter your 17-digit Vehicle Identification Number (VIN) or Chassis Number to retrieve matching AC system specs and compatible spare parts.
                    </p>
                    <button 
                      className="where-is-vin-btn" 
                      onClick={() => setShowVinGuide(!showVinGuide)}
                      type="button"
                    >
                      <HelpCircle size={14} />
                      <span>Where is VIN/Frame?</span>
                    </button>
                  </div>

                  {showVinGuide && (
                    <div className="vin-guide-card animate-fade-in-up">
                      <div className="vin-guide-header">
                        <h5>Where to Find Your VIN / Chassis Number</h5>
                        <button className="close-guide-btn" onClick={() => setShowVinGuide(false)}>
                          <X size={16} />
                        </button>
                      </div>
                      <div className="vin-guide-body">
                        <img 
                          src="/where-is-vin.png" 
                          alt="VIN Locations Guide" 
                          className="vin-guide-img" 
                        />
                        <div className="vin-guide-text">
                          <p><strong>The 4 most common locations on a vehicle:</strong></p>
                          <ol>
                            <li><strong>Driver's Side Dashboard:</strong> Visible through the windshield from the outside.</li>
                            <li><strong>Driver's Side Door Jamb:</strong> Inside the door frame when the door is open.</li>
                            <li><strong>Under the Hood:</strong> Printed on the engine block or firewall.</li>
                            <li><strong>Vehicle Frame:</strong> Stamped on the frame near the front wheel (common on older cars & trucks).</li>
                          </ol>
                          <div className="vin-tips-box">
                            <HelpCircle size={14} />
                            <span>Can't find your VIN? Check your vehicle's registration certificate (RC), insurance policy, or manufacturer invoices.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="unified-search-bar vin-bar">
                    <div className="search-input-inner-wrapper">
                      <input
                        type="text"
                        placeholder="Enter 17-digit VIN or Chassis Number (e.g. MA3FDB9...)"
                        value={vinQuery}
                        onChange={(e) => {
                          setVinQuery(e.target.value);
                          if (vinError) setVinError(null);
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter') decodeVin(); }}
                        className="main-search-input"
                        maxLength={17}
                      />
                      {vinQuery && (
                        <button className="clear-search-btn" onClick={() => setVinQuery('')}>
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    
                    <button className="search-execute-btn" onClick={() => decodeVin()}>
                      <Search size={16} />
                      <span>Decode VIN</span>
                    </button>
                  </div>

                  {vinError && (
                    <div className="vin-search-error">
                      <AlertTriangle size={14} />
                      <span>{vinError}</span>
                    </div>
                  )}

                  <div className="vin-samples-row">
                    <span className="samples-label">Demo Inputs:</span>
                    <div className="samples-chips">
                      <button onClick={() => { setVinQuery('MA3FDB91S00109283'); decodeVin('MA3FDB91S00109283'); }} className="sample-chip">Swift (Maruti)</button>
                      <button onClick={() => { setVinQuery('MALCN81CPKM109482'); decodeVin('MALCN81CPKM109482'); }} className="sample-chip">Creta (Hyundai)</button>
                      <button onClick={() => { setVinQuery('MAT602148E0B09381'); decodeVin('MAT602148E0B09381'); }} className="sample-chip">Nexon (Tata)</button>
                      <button onClick={() => { setVinQuery('MBJ111GB300189284'); decodeVin('MBJ111GB300189284'); }} className="sample-chip">Fortuner (Toyota)</button>
                    </div>
                  </div>

                  {vinResult === 'loading' && (
                    <div className="vin-loading-indicator">
                      <div className="spinner"></div>
                      <span>Connecting to secure global database to decode VIN...</span>
                    </div>
                  )}

                  {vinResult && vinResult !== 'loading' && (
                    <div className="vin-result-card reveal active">
                      <div className="vin-result-header">
                        <div className="success-badge">
                          <ShieldCheck size={16} />
                          <span>VEHICLE IDENTIFIED</span>
                        </div>
                        <h4 className="vehicle-title">{vinResult.make} {vinResult.model} ({vinResult.year})</h4>
                      </div>

                      <div className="vin-specs-grid">
                        <div className="vin-specs-column">
                          <h5 className="specs-col-title">Vehicle Information</h5>
                          <ul className="specs-list-items">
                            <li><strong>Manufacturer:</strong> {vinResult.make}</li>
                            <li><strong>Model Range:</strong> {vinResult.model}</li>
                            <li><strong>Model Year:</strong> {vinResult.year}</li>
                            <li><strong>Fuel Type:</strong> {vinResult.fuelType}</li>
                            <li><strong>Engine:</strong> {vinResult.engine}</li>
                            <li><strong>Chassis ID:</strong> <code className="chassis-code">{vinResult.chassis}</code></li>
                            <li><strong>Manufacturing:</strong> {vinResult.region}</li>
                          </ul>
                        </div>

                        <div className="vin-specs-column">
                          <h5 className="specs-col-title">AC System Technical Data</h5>
                          <ul className="specs-list-items">
                            <li><strong>OEM Compressor:</strong> {vinResult.specs.compressor}</li>
                            <li><strong>Refrigerant Charge:</strong> {vinResult.specs.refrigerant}</li>
                            <li><strong>Lubricant Oil:</strong> {vinResult.specs.oil}</li>
                            <li><strong>AC Drive Belt Type:</strong> {vinResult.specs.belt}</li>
                            <li><strong>Cabin Pollen Filter:</strong> {vinResult.specs.pollenFilter}</li>
                          </ul>
                        </div>
                      </div>

                      {/* Interactive exploded AC diagram */}
                      <div className="interactive-catalog-section" style={{ padding: '0 24px', marginBottom: '16px' }}>
                        <h5 className="specs-col-title" style={{ marginTop: '24px', marginBottom: '8px', color: 'var(--red)', fontSize: '14.5px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Interactive AC System Exploded Diagram Catalog
                        </h5>
                        <ExplodedDiagram
                          diagramId="hvac-exploded-car"
                          compatiblePartIds={vinResult.compatiblePartIds}
                          vin={vinResult.chassis}
                          make={vinResult.make}
                          model={vinResult.model}
                          year={vinResult.year}
                        />
                      </div>

                      <div className="compatible-parts-section">
                        <h5 className="compatible-title">Compatible AC spare parts in our stock</h5>
                        <div className="compatible-parts-grid">
                          {products
                            .filter(p => vinResult.compatiblePartIds.includes(p.id))
                            .map(part => {
                              const whatsappText = `Hi RCS, I am enquiring about the ${part.name} (Brand: ${part.brand}, Category: ${part.category}) compatible with my vehicle: ${vinResult.make} ${vinResult.model} (${vinResult.year}) having VIN: ${vinResult.chassis}. Please let me know price and delivery timeline.`;
                              const whatsappUrl = `https://wa.me/919962173870?text=${encodeURIComponent(whatsappText)}`;

                              return (
                                <div key={part.id} className="compact-part-card">
                                  <div className="compact-part-image-wrapper">
                                    <img src={part.image} alt={part.name} className="compact-part-image" />
                                  </div>
                                  <div className="compact-part-info">
                                    <div className="compact-part-meta">
                                      <span className="compact-brand">{part.brand}</span>
                                      <span className="compact-category-tag">{part.category}</span>
                                    </div>
                                    <h6 className="compact-part-name">{part.name}</h6>
                                    <div className="compact-part-footer">
                                      <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="compact-whatsapp-link"
                                      >
                                        Enquire
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        <div className="whatsapp-inquiry-box">
                          <p>Need custom support or checking other components for this chassis?</p>
                          <a
                            href={`https://wa.me/919962173870?text=${encodeURIComponent(
                              `Hi RCS, I have decoded my vehicle (VIN: ${vinResult.chassis}, ${vinResult.make} ${vinResult.model}) and want to enquire about technical assistance for the AC system.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bulk-whatsapp-btn"
                          >
                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                            </svg>
                            <span>Ask Specialist via WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
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
