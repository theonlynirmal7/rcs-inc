// Default product data — stored in localStorage for CRUD persistence
const defaultProducts = [
  {
    id: 1,
    name: 'AC Compressor – Universal',
    category: 'Car',
    brand: 'Denso',
    price: 8500,
    image: '/compressor.png',
    description: 'High-performance universal AC compressor compatible with most sedan and hatchback models. Durable construction with precision engineering.',
    inStock: true,
  },
  {
    id: 2,
    name: 'Condenser Assembly – Car',
    category: 'Car',
    brand: 'Sanden',
    price: 4200,
    image: '/condenser.png',
    description: 'OEM-grade condenser assembly designed for optimal heat dissipation. Fits popular car models.',
    inStock: true,
  },
  {
    id: 3,
    name: 'Evaporator Coil – Sedan',
    category: 'Car',
    brand: 'Valeo',
    price: 3800,
    image: '/evaporator-coil.png',
    description: 'Premium copper-aluminum evaporator coil ensuring efficient cooling. Anti-corrosion coated for longevity.',
    inStock: true,
  },
  {
    id: 5,
    name: 'Truck AC Compressor – Sanden',
    category: 'Truck',
    brand: 'Sanden',
    price: 15000,
    image: '/truck-compressor.png',
    description: 'Industrial-grade AC compressor for heavy trucks and trailers. Built for extreme conditions.',
    inStock: true,
  },
  {
    id: 6,
    name: 'Receiver Drier – Universal',
    category: 'Car',
    brand: 'Denso',
    price: 1200,
    image: '/receiver-drier.png',
    description: 'Removes moisture and contaminants from the AC system. Essential for compressor protection.',
    inStock: true,
  },
  {
    id: 7,
    name: 'Expansion Valve – Bus',
    category: 'Bus',
    brand: 'Valeo',
    price: 2800,
    image: '/bus-expansion-valve.png',
    description: 'Precision expansion valve designed for bus AC systems. Ensures optimal refrigerant flow.',
    inStock: true,
  },
  {
    id: 8,
    name: 'Bus Condenser Coil',
    category: 'Bus',
    brand: 'Sanden',
    price: 12000,
    image: '/bus-condenser-coil.png',
    description: 'Large-capacity condenser coil for commercial bus AC systems. High efficiency heat exchange.',
    inStock: true,
  },
  {
    id: 9,
    name: 'Radiator Fan – 12V',
    category: 'Car',
    brand: 'Behr',
    price: 2500,
    image: '/radiator-fan.png',
    description: 'Electric radiator cooling fan assembly. Efficient 12V motor with balanced blade design.',
    inStock: true,
  },
  {
    id: 11,
    name: 'Magnetic Clutch – Compressor',
    category: 'Car',
    brand: 'Sanden',
    price: 3200,
    image: '/magnetic-clutch.png',
    description: 'OEM replacement magnetic clutch for AC compressors. Precise engagement and smooth operation.',
    inStock: true,
  },
  {
    id: 12,
    name: 'Bus Blower Assembly',
    category: 'Bus',
    brand: 'Sanden',
    price: 9500,
    image: '/bus-blower-assembly.png',
    description: 'Complete blower assembly for bus HVAC systems. Multi-speed with high airflow rating.',
    inStock: true,
  },
  {
    id: 13,
    name: 'Radiator – Aluminum',
    category: 'Car',
    brand: 'Valeo',
    price: 5500,
    image: '/radiator.jpg',
    description: 'Premium heavy-duty aluminum radiator for optimal engine cooling and maximum heat dissipation.',
    inStock: true,
  },
  {
    id: 14,
    name: 'Intercooler – Aluminum Heavy Duty',
    category: 'Car',
    brand: 'Valeo',
    price: 7500,
    image: '/intercooler.png',
    description: 'High-performance aluminum intercooler for turbocharged engines. Ensures maximum intake air cooling and optimal engine efficiency.',
    inStock: true,
  },
  {
    id: 15,
    name: 'Blower Motor',
    category: 'Car',
    brand: 'Denso',
    price: 4500,
    image: '/blower-motor.png',
    description: 'Premium AC blower motor assembly. High airflow capacity with durable motor windings for quiet and efficient cabin ventilation.',
    inStock: true,
  },
  {
    id: 16,
    name: 'Cabin Air Filter',
    category: 'Car',
    brand: 'Valeo',
    price: 950,
    image: '/cabin-filter.png',
    description: 'High-efficiency cabin air filter. Blocks dust, pollen, and allergens from entering the passenger cabin through the AC system.',
    inStock: true,
  },
  {
    id: 17,
    name: 'Blower Motor Resistor',
    category: 'Car',
    brand: 'Denso',
    price: 1800,
    image: '/blower-motor-resistor.png',
    description: 'OEM-grade blower motor resistor. Controls the fan speed of your vehicle\'s heating and AC system, restoring multi-speed blower functionality.',
    inStock: true,
  },
  {
    id: 18,
    name: 'AC Thermistor Sensor',
    category: 'Car',
    brand: 'Denso',
    price: 1200,
    image: '/thermistor.png',
    description: 'Precision AC evaporator temperature sensor (thermistor). Prevents evaporator freeze-up by monitoring air temperature and cycling the compressor accordingly.',
    inStock: true,
  },
  {
    id: 19,
    name: 'Thermostatic Expansion Valve',
    category: 'Car',
    brand: 'Sanden',
    price: 2200,
    image: '/expansion-valve.png',
    description: 'Premium thermostatic expansion valve (TXV) with capillary tube and sensing bulb. Regulates the flow of liquid refrigerant into the evaporator coil for precise climate control.',
    inStock: true,
  },
  {
    id: 20,
    name: 'Condenser Fan',
    category: 'Car',
    brand: 'Spal',
    price: 3200,
    image: '/condenser-fan.png',
    description: 'High-performance AC condenser cooling fan. High-velocity airflow ensures rapid refrigerant cooling and optimal heat exchange.',
    inStock: true,
  },
  {
    id: 21,
    name: 'Heater Core',
    category: 'Car',
    brand: 'Valeo',
    price: 2400,
    image: '/heater-core.png',
    description: 'Premium aluminum heater core. Ensures efficient cabin heating by transferring heat from the engine coolant to the cabin air.',
    inStock: true,
  },
  {
    id: 22,
    name: 'AC Fan Resistor',
    category: 'Car',
    brand: 'Denso',
    price: 2100,
    image: '/ac-fan-resistor.png',
    description: 'Heavy-duty cooling fan resistor assembly. Controls the speed of the condenser and radiator fans for precise engine and refrigerant cooling.',
    inStock: true,
  },
  {
    id: 23,
    name: 'Bus AC Unit',
    category: 'Bus',
    brand: 'Sanden',
    price: 85000,
    image: '/bus-ac-unit.png',
    description: 'Complete heavy-duty roof-mounted Bus AC unit. Engineered for large passenger cabins, featuring high cooling capacity, multi-flow vents, and rugged durability.',
    inStock: true,
  },
  {
    id: 24,
    name: 'Control Valve',
    category: 'Car',
    brand: 'Denso',
    price: 1800,
    image: '/control-valve.png',
    description: 'Electronic AC compressor control valve. Regulates displacement and refrigerant flow in variable displacement compressors to maintain desired cabin cooling.',
    inStock: true,
  },

  {
    id: 26,
    name: 'AC Control Unit',
    category: 'Car',
    brand: 'Denso',
    price: 6800,
    image: '/ac-control-unit.png',
    description: 'OEM-grade AC control module/unit. Restores precise control over cabin cooling, heating, and fan speed settings.',
    inStock: true,
  },
  {
    id: 27,
    name: 'Cooling Coil',
    category: 'Car',
    brand: 'Subros',
    price: 3200,
    image: '/cooling-coil.png',
    description: 'High-efficiency AC cooling coil (evaporator core) ensuring rapid heat exchange and consistent cabin cooling.',
    inStock: true,
  },
  {
    id: 28,
    name: 'Condensor Fan Cowling',
    category: 'Car',
    brand: 'Valeo',
    price: 1500,
    image: '/condenser-fan-cowling.png',
    description: 'Durable condenser fan cowling (shroud) designed to focus airflow through the condenser for maximized heat dissipation.',
    inStock: true,
  },
  {
    id: 29,
    name: 'AC Pressure Switch',
    category: 'Car',
    brand: 'Denso',
    price: 950,
    image: '/ac-pressure-switch.png',
    description: 'AC system pressure switch to monitor refrigerant pressure. Protects the compressor from operating under unsafe pressure conditions.',
    inStock: true,
  },
  {
    id: 30,
    name: 'Refrigerant',
    category: 'Car',
    brand: 'SRF',
    price: 650,
    image: '/refrigerant.png',
    description: 'Premium environmental-friendly R134a AC refrigerant gas. Formulated to restore maximum cooling efficiency to your vehicle\'s AC system.',
    inStock: true,
  },
  {
    id: 31,
    name: 'Radiator Fan Assy',
    category: 'Car',
    brand: 'Denso',
    price: 2900,
    image: '/radiator-fan-assy.png',
    description: 'Complete electric radiator fan assembly including fan blade, motor, and shroud. Ensures efficient engine cooling.',
    inStock: true,
  },
  {
    id: 32,
    name: 'Radiator Fan Motor',
    category: 'Car',
    brand: 'Denso',
    price: 1200,
    image: '/radiator-fan-motor.png',
    description: 'High-performance replacement electric motor for radiator cooling fans. Restores quiet and powerful fan rotation.',
    inStock: true,
  },
  {
    id: 33,
    name: 'Radiator Cooling Fan',
    category: 'Car',
    brand: 'Denso',
    price: 2600,
    image: '/radiator-cooling-fan.png',
    description: 'Premium high-efficiency electric radiator cooling fan. Designed for optimal heat dissipation and long-lasting motor performance.',
    inStock: true,
  },
  {
    id: 34,
    name: 'Hose Suction',
    category: 'Car',
    brand: 'Denso',
    price: 1400,
    image: '/hose-suction.png',
    description: 'Premium AC suction hose. Connects the evaporator to the compressor suction port, engineered to withstand high pressure and temperature.',
    inStock: true,
  },
  {
    id: 35,
    name: 'AC Compressor Oil',
    category: 'Car',
    brand: 'Sanden',
    price: 650,
    image: '/ac-compressor-oil.png',
    description: 'High-grade PAG compressor oil. Formulated to provide superior lubrication, thermal stability, and corrosion protection for automotive AC compressors.',
    inStock: true,
  },
  {
    id: 36,
    name: 'Air Vent',
    category: 'Car',
    brand: 'Valeo',
    price: 1100,
    image: '/air-vent.png',
    description: 'OEM-replacement dashboard air vent assembly. Features adjustable directional slats and flow control dial.',
    inStock: true,
  },
  {
    id: 37,
    name: 'Air Duct',
    category: 'Car',
    brand: 'Denso',
    price: 850,
    image: '/air-duct.png',
    description: 'Durable molded air intake/ventilation duct. Directs airflow efficiently through the vehicle\'s HVAC system.',
    inStock: true,
  },
  {
    id: 38,
    name: 'AC Repair Kit',
    category: 'Car',
    brand: 'Denso',
    price: 2900,
    image: '/ac-repair-kit.png',
    description: 'Complete AC system repair and sealing kit. Includes O-rings, seals, compressor gaskets, and charging adapters.',
    inStock: true,
  },
  {
    id: 39,
    name: 'Cabin Temperature Sensor',
    category: 'Car',
    brand: 'Denso',
    price: 1350,
    image: '/cabin-temperature-sensor.png',
    description: 'Precision cabin air temperature sensor. Provides input to the automatic climate control module to maintain target temperature.',
    inStock: true,
  },
  {
    id: 40,
    name: 'Defroster Hose',
    category: 'Car',
    brand: 'Valeo',
    price: 750,
    image: '/defroster-hose.png',
    description: 'Flexible windshield defroster ventilation hose. Ensures steady air delivery to prevent window fogging.',
    inStock: true,
  },
  {
    id: 41,
    name: 'Hose Discharge',
    category: 'Car',
    brand: 'Denso',
    price: 1500,
    image: '/hose-discharge.png',
    description: 'Premium AC discharge hose. Transports high-pressure gaseous refrigerant from the compressor to the condenser.',
    inStock: true,
  },
  {
    id: 42,
    name: 'HVAC Hose',
    category: 'Car',
    brand: 'Denso',
    price: 1250,
    image: '/hvac-hose.png',
    description: 'Reinforced HVAC coolant/heater hose. Delivers engine coolant to the heater core for efficient cabin heating.',
    inStock: true,
  },
  {
    id: 43,
    name: 'Heat Exchange',
    category: 'Car',
    brand: 'Mahle Behr',
    price: 5200,
    image: '/heat-exchange.png',
    description: 'High-capacity auxiliary heat exchanger unit. Optimized for secondary cooling and HVAC systems in SUVs and commercial vehicles.',
    inStock: true,
  },
  {
    id: 44,
    name: 'V Belt',
    category: 'Car',
    brand: 'Denso',
    price: 450,
    image: '/v-belt.png',
    description: 'Heavy-duty ribbed V-belt. Powers the AC compressor, alternator, and water pump with slip-free power transmission.',
    inStock: true,
  },
  {
    id: 50,
    name: 'Payload AC Compressor',
    category: 'Payload Vehicle',
    brand: 'Denso',
    price: 18500,
    image: '/compressor.png',
    description: 'Heavy-duty AC compressor optimized for payload vehicles and load-carriers. Designed to maintain optimal cabin cooling during long transport routes under heavy loads.',
    inStock: true,
  },
  {
    id: 51,
    name: 'Payload Evaporator Coil',
    category: 'Payload Vehicle',
    brand: 'Sanden',
    price: 9200,
    image: '/evaporator-coil.png',
    description: 'High-capacity evaporator coil with reinforced copper-aluminum fins. Engineered to withstand heavy vibrations in payload carriers.',
    inStock: true,
  },
  {
    id: 52,
    name: 'Payload Condenser Assembly',
    category: 'Payload Vehicle',
    brand: 'Valeo',
    price: 14000,
    image: '/condenser.png',
    description: 'Heavy-duty multi-flow condenser assembly for efficient heat transfer. Corrosion-resistant coating for payloaders operating in harsh environments.',
    inStock: true,
  },
  {
    id: 53,
    name: 'Excavator AC Cabin Unit',
    category: 'Construction Vehicle',
    brand: 'Subros',
    price: 45000,
    image: '/bus-ac-unit.png',
    description: 'Premium roof-mounted cabin AC unit for excavators and loaders. Offers rapid cooling and dust filtration for challenging construction environments.',
    inStock: true,
  },
  {
    id: 54,
    name: 'Construction Blower Assembly',
    category: 'Construction Vehicle',
    brand: 'Spal',
    price: 7200,
    image: '/bus-blower-assembly.png',
    description: 'Reinforced high-velocity cabin blower assembly. Engineered for maximum air circulation in dusty construction vehicles.',
    inStock: true,
  },
  {
    id: 55,
    name: 'Heavy Loader Evaporator',
    category: 'Construction Vehicle',
    brand: 'Denso',
    price: 11500,
    image: '/cooling-coil.png',
    description: 'OEM-replacement heavy-duty evaporator core for front loaders and backhoes. High heat exchange efficiency for hot work zones.',
    inStock: true,
  },
  {
    id: 56,
    name: 'Bulldozer Cabin AC Kit',
    category: 'Bulldozer',
    brand: 'Sanden',
    price: 55000,
    image: '/bus-ac-unit.png',
    description: 'Complete heavy-duty climate control kit for bulldozer cabins. Restores both heating and cooling functions with dust-proof seals.',
    inStock: true,
  },
  {
    id: 57,
    name: 'Bulldozer Heavy Compressor',
    category: 'Bulldozer',
    brand: 'Sanden',
    price: 28000,
    image: '/truck-compressor.png',
    description: 'Rugged B2B wholesale bulldozer AC compressor. Built to operate continuously under extreme heat and high vibrations.',
    inStock: true,
  },
  {
    id: 58,
    name: 'Bulldozer Reinforced Condenser',
    category: 'Bulldozer',
    brand: 'Valeo',
    price: 19800,
    image: '/bus-condenser-coil.png',
    description: 'Ultra-durable auxiliary condenser coil with reinforced outer casing. Protects against flying debris on active earthmoving sites.',
    inStock: true,
  },
  {
    id: 59,
    name: 'Truck Condenser Assembly',
    category: 'Truck',
    brand: 'Sanden',
    price: 11500,
    image: '/condenser.png',
    description: 'High-performance truck condenser assembly designed to survive rough roads and long hauls. Optimal refrigerant cooling.',
    inStock: true,
  },
  {
    id: 60,
    name: 'Truck Blower Motor',
    category: 'Truck',
    brand: 'Denso',
    price: 6800,
    image: '/blower-motor.png',
    description: 'Quiet, powerful cabin blower motor for long-haul trucks. Restores multi-speed air distribution and cab ventilation.',
    inStock: true,
  },
];

const STORAGE_KEY = 'rcs_products';

export function getProducts() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    let products = JSON.parse(stored);
    
    // If Supabase is configured, bypass local offline migrations
    const isSupabase = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
    if (isSupabase) {
      return products;
    }

    let modified = false;

    // Migrate brand 'Mahle' to 'Mahle Filter'
    products = products.map(p => {
      if (p.brand === 'Mahle') {
        p.brand = 'Mahle Filter';
        modified = true;
      }
      return p;
    });

    // Filter out removed products: id 4 (Blower Motor - Heavy Duty), id 10 (AC Hose Kit - Truck), and id 25 (Radiator Fan Shroud & Fan)
    if (products.some(p => p.id === 4 || p.id === 10 || p.id === 25)) {
      products = products.filter(p => p.id !== 4 && p.id !== 10 && p.id !== 25);
      modified = true;
    }

    // Migrate new Radiator product if missing
    if (!products.some(p => p.image === '/radiator.jpg')) {
      products.push({
        id: 13,
        name: 'Radiator – Aluminum',
        category: 'Car',
        brand: 'Valeo',
        price: 5500,
        image: '/radiator.jpg',
        description: 'Premium heavy-duty aluminum radiator for optimal engine cooling and maximum heat dissipation.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Intercooler product if missing
    if (!products.some(p => p.image === '/intercooler.png')) {
      products.push({
        id: 14,
        name: 'Intercooler – Aluminum Heavy Duty',
        category: 'Car',
        brand: 'Valeo',
        price: 7500,
        image: '/intercooler.png',
        description: 'High-performance aluminum intercooler for turbocharged engines. Ensures maximum intake air cooling and optimal engine efficiency.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Blower Motor product if missing
    if (!products.some(p => p.image === '/blower-motor.png')) {
      products.push({
        id: 15,
        name: 'Blower Motor',
        category: 'Car',
        brand: 'Denso',
        price: 4500,
        image: '/blower-motor.png',
        description: 'Premium AC blower motor assembly. High airflow capacity with durable motor windings for quiet and efficient cabin ventilation.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Cabin Air Filter product if missing
    if (!products.some(p => p.image === '/cabin-filter.png')) {
      products.push({
        id: 16,
        name: 'Cabin Air Filter',
        category: 'Car',
        brand: 'Valeo',
        price: 950,
        image: '/cabin-filter.png',
        description: 'High-efficiency cabin air filter. Blocks dust, pollen, and allergens from entering the passenger cabin through the AC system.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Blower Motor Resistor product if missing
    if (!products.some(p => p.image === '/blower-motor-resistor.png')) {
      products.push({
        id: 17,
        name: 'Blower Motor Resistor',
        category: 'Car',
        brand: 'Denso',
        price: 1800,
        image: '/blower-motor-resistor.png',
        description: 'OEM-grade blower motor resistor. Controls the fan speed of your vehicle\'s heating and AC system, restoring multi-speed blower functionality.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new AC Thermistor Sensor product if missing
    if (!products.some(p => p.image === '/thermistor.png')) {
      products.push({
        id: 18,
        name: 'AC Thermistor Sensor',
        category: 'Car',
        brand: 'Denso',
        price: 1200,
        image: '/thermistor.png',
        description: 'Precision AC evaporator temperature sensor (thermistor). Prevents evaporator freeze-up by monitoring air temperature and cycling the compressor accordingly.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Thermostatic Expansion Valve product if missing
    if (!products.some(p => p.image === '/expansion-valve.png')) {
      products.push({
        id: 19,
        name: 'Thermostatic Expansion Valve',
        category: 'Car',
        brand: 'Sanden',
        price: 2200,
        image: '/expansion-valve.png',
        description: 'Premium thermostatic expansion valve (TXV) with capillary tube and sensing bulb. Regulates the flow of liquid refrigerant into the evaporator coil for precise climate control.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Condenser Fan product if missing
    if (!products.some(p => p.image === '/condenser-fan.png')) {
      products.push({
        id: 20,
        name: 'Condenser Fan',
        category: 'Car',
        brand: 'Spal',
        price: 3200,
        image: '/condenser-fan.png',
        description: 'High-performance AC condenser cooling fan. High-velocity airflow ensures rapid refrigerant cooling and optimal heat exchange.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Heater Core product if missing
    if (!products.some(p => p.image === '/heater-core.png')) {
      products.push({
        id: 21,
        name: 'Heater Core',
        category: 'Car',
        brand: 'Valeo',
        price: 2400,
        image: '/heater-core.png',
        description: 'Premium aluminum heater core. Ensures efficient cabin heating by transferring heat from the engine coolant to the cabin air.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new AC Fan Resistor product if missing
    if (!products.some(p => p.image === '/ac-fan-resistor.png')) {
      products.push({
        id: 22,
        name: 'AC Fan Resistor',
        category: 'Car',
        brand: 'Denso',
        price: 2100,
        image: '/ac-fan-resistor.png',
        description: 'Heavy-duty cooling fan resistor assembly. Controls the speed of the condenser and radiator fans for precise engine and refrigerant cooling.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Bus AC Unit product if missing
    if (!products.some(p => p.image === '/bus-ac-unit.png')) {
      products.push({
        id: 23,
        name: 'Bus AC Unit',
        category: 'Bus',
        brand: 'Sanden',
        price: 85000,
        image: '/bus-ac-unit.png',
        description: 'Complete heavy-duty roof-mounted Bus AC unit. Engineered for large passenger cabins, featuring high cooling capacity, multi-flow vents, and rugged durability.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Control Valve product if missing
    if (!products.some(p => p.image === '/control-valve.png')) {
      products.push({
        id: 24,
        name: 'Control Valve',
        category: 'Car',
        brand: 'Denso',
        price: 1800,
        image: '/control-valve.png',
        description: 'Electronic AC compressor control valve. Regulates displacement and refrigerant flow in variable displacement compressors to maintain desired cabin cooling.',
        inStock: true,
      });
      modified = true;
    }



    // Migrate new AC Control Unit if missing
    if (!products.some(p => p.image === '/ac-control-unit.png')) {
      products.push({
        id: 26,
        name: 'AC Control Unit',
        category: 'Car',
        brand: 'Denso',
        price: 6800,
        image: '/ac-control-unit.png',
        description: 'OEM-grade AC control module/unit. Restores precise control over cabin cooling, heating, and fan speed settings.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Cooling Coil if missing
    if (!products.some(p => p.image === '/cooling-coil.png')) {
      products.push({
        id: 27,
        name: 'Cooling Coil',
        category: 'Car',
        brand: 'Subros',
        price: 3200,
        image: '/cooling-coil.png',
        description: 'High-efficiency AC cooling coil (evaporator core) ensuring rapid heat exchange and consistent cabin cooling.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Condensor Fan Cowling if missing
    if (!products.some(p => p.image === '/condenser-fan-cowling.png')) {
      products.push({
        id: 28,
        name: 'Condensor Fan Cowling',
        category: 'Car',
        brand: 'Valeo',
        price: 1500,
        image: '/condenser-fan-cowling.png',
        description: 'Durable condenser fan cowling (shroud) designed to focus airflow through the condenser for maximized heat dissipation.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new AC Pressure Switch if missing
    if (!products.some(p => p.image === '/ac-pressure-switch.png')) {
      products.push({
        id: 29,
        name: 'AC Pressure Switch',
        category: 'Car',
        brand: 'Denso',
        price: 950,
        image: '/ac-pressure-switch.png',
        description: 'AC system pressure switch to monitor refrigerant pressure. Protects the compressor from operating under unsafe pressure conditions.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Refrigerant if missing
    if (!products.some(p => p.image === '/refrigerant.png')) {
      products.push({
        id: 30,
        name: 'Refrigerant',
        category: 'Car',
        brand: 'SRF',
        price: 650,
        image: '/refrigerant.png',
        description: 'Premium environmental-friendly R134a AC refrigerant gas. Formulated to restore maximum cooling efficiency to your vehicle\'s AC system.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Radiator Fan Assy if missing
    if (!products.some(p => p.image === '/radiator-fan-assy.png')) {
      products.push({
        id: 31,
        name: 'Radiator Fan Assy',
        category: 'Car',
        brand: 'Denso',
        price: 2900,
        image: '/radiator-fan-assy.png',
        description: 'Complete electric radiator fan assembly including fan blade, motor, and shroud. Ensures efficient engine cooling.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Radiator Fan Motor if missing
    if (!products.some(p => p.image === '/radiator-fan-motor.png')) {
      products.push({
        id: 32,
        name: 'Radiator Fan Motor',
        category: 'Car',
        brand: 'Denso',
        price: 1200,
        image: '/radiator-fan-motor.png',
        description: 'High-performance replacement electric motor for radiator cooling fans. Restores quiet and powerful fan rotation.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Radiator Cooling Fan if missing
    if (!products.some(p => p.image === '/radiator-cooling-fan.png')) {
      products.push({
        id: 33,
        name: 'Radiator Cooling Fan',
        category: 'Car',
        brand: 'Denso',
        price: 2600,
        image: '/radiator-cooling-fan.png',
        description: 'Premium high-efficiency electric radiator cooling fan. Designed for optimal heat dissipation and long-lasting motor performance.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Hose Suction if missing
    if (!products.some(p => p.image === '/hose-suction.png')) {
      products.push({
        id: 34,
        name: 'Hose Suction',
        category: 'Car',
        brand: 'Denso',
        price: 1400,
        image: '/hose-suction.png',
        description: 'Premium AC suction hose. Connects the evaporator to the compressor suction port, engineered to withstand high pressure and temperature.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new AC Compressor Oil if missing
    if (!products.some(p => p.image === '/ac-compressor-oil.png')) {
      products.push({
        id: 35,
        name: 'AC Compressor Oil',
        category: 'Car',
        brand: 'Sanden',
        price: 650,
        image: '/ac-compressor-oil.png',
        description: 'High-grade PAG compressor oil. Formulated to provide superior lubrication, thermal stability, and corrosion protection for automotive AC compressors.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Air Vent if missing
    if (!products.some(p => p.image === '/air-vent.png')) {
      products.push({
        id: 36,
        name: 'Air Vent',
        category: 'Car',
        brand: 'Valeo',
        price: 1100,
        image: '/air-vent.png',
        description: 'OEM-replacement dashboard air vent assembly. Features adjustable directional slats and flow control dial.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Air Duct if missing
    if (!products.some(p => p.image === '/air-duct.png')) {
      products.push({
        id: 37,
        name: 'Air Duct',
        category: 'Car',
        brand: 'Denso',
        price: 850,
        image: '/air-duct.png',
        description: 'Durable molded air intake/ventilation duct. Directs airflow efficiently through the vehicle\'s HVAC system.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new AC Repair Kit if missing
    if (!products.some(p => p.image === '/ac-repair-kit.png')) {
      products.push({
        id: 38,
        name: 'AC Repair Kit',
        category: 'Car',
        brand: 'Denso',
        price: 2900,
        image: '/ac-repair-kit.png',
        description: 'Complete AC system repair and sealing kit. Includes O-rings, seals, compressor gaskets, and charging adapters.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Cabin Temperature Sensor if missing
    if (!products.some(p => p.image === '/cabin-temperature-sensor.png')) {
      products.push({
        id: 39,
        name: 'Cabin Temperature Sensor',
        category: 'Car',
        brand: 'Denso',
        price: 1350,
        image: '/cabin-temperature-sensor.png',
        description: 'Precision cabin air temperature sensor. Provides input to the automatic climate control module to maintain target temperature.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Defroster Hose if missing
    if (!products.some(p => p.image === '/defroster-hose.png')) {
      products.push({
        id: 40,
        name: 'Defroster Hose',
        category: 'Car',
        brand: 'Valeo',
        price: 750,
        image: '/defroster-hose.png',
        description: 'Flexible windshield defroster ventilation hose. Ensures steady air delivery to prevent window fogging.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Hose Discharge if missing
    if (!products.some(p => p.image === '/hose-discharge.png')) {
      products.push({
        id: 41,
        name: 'Hose Discharge',
        category: 'Car',
        brand: 'Denso',
        price: 1500,
        image: '/hose-discharge.png',
        description: 'Premium AC discharge hose. Transports high-pressure gaseous refrigerant from the compressor to the condenser.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new HVAC Hose if missing
    if (!products.some(p => p.image === '/hvac-hose.png')) {
      products.push({
        id: 42,
        name: 'HVAC Hose',
        category: 'Car',
        brand: 'Denso',
        price: 1250,
        image: '/hvac-hose.png',
        description: 'Reinforced HVAC coolant/heater hose. Delivers engine coolant to the heater core for efficient cabin heating.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new Heat Exchange if missing
    if (!products.some(p => p.image === '/heat-exchange.png')) {
      products.push({
        id: 43,
        name: 'Heat Exchange',
        category: 'Car',
        brand: 'Mahle Behr',
        price: 5200,
        image: '/heat-exchange.png',
        description: 'High-capacity auxiliary heat exchanger unit. Optimized for secondary cooling and HVAC systems in SUVs and commercial vehicles.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate new V Belt if missing
    if (!products.some(p => p.image === '/v-belt.png')) {
      products.push({
        id: 44,
        name: 'V Belt',
        category: 'Car',
        brand: 'Denso',
        price: 450,
        image: '/v-belt.png',
        description: 'Heavy-duty ribbed V-belt. Powers the AC compressor, alternator, and water pump with slip-free power transmission.',
        inStock: true,
      });
      modified = true;
    }

    // Migrate AC Compressor image if using old placeholder URL
    const compIndex = products.findIndex(p => p.id === 1);
    if (compIndex !== -1 && products[compIndex].image !== '/compressor.png') {
      products[compIndex].image = '/compressor.png';
      modified = true;
    }

    // Migrate Condenser Assembly image if using old placeholder URL
    const condIndex = products.findIndex(p => p.id === 2);
    if (condIndex !== -1 && products[condIndex].image !== '/condenser.png') {
      products[condIndex].image = '/condenser.png';
      modified = true;
    }

    // Migrate Radiator Fan image if using old placeholder URL
    const fanIndex = products.findIndex(p => p.id === 9);
    if (fanIndex !== -1 && products[fanIndex].image !== '/radiator-fan.png') {
      products[fanIndex].image = '/radiator-fan.png';
      modified = true;
    }

    // Migrate Evaporator Coil image and name if using old placeholder URL
    const evapIndex = products.findIndex(p => p.id === 3);
    if (evapIndex !== -1 && products[evapIndex].image !== '/evaporator-coil.png') {
      products[evapIndex].name = 'Evaporator Coil – Sedan';
      products[evapIndex].image = '/evaporator-coil.png';
      products[evapIndex].description = 'Premium copper-aluminum evaporator coil ensuring efficient cooling. Anti-corrosion coated for longevity.';
      modified = true;
    }

    // Migrate Receiver Drier image if using old placeholder URL
    const drierIndex = products.findIndex(p => p.id === 6);
    if (drierIndex !== -1 && products[drierIndex].image !== '/receiver-drier.png') {
      products[drierIndex].image = '/receiver-drier.png';
      modified = true;
    }

    // Migrate Truck AC Compressor – Sanden image if using old placeholder URL
    const truckCompIndex = products.findIndex(p => p.id === 5);
    if (truckCompIndex !== -1 && products[truckCompIndex].image !== '/truck-compressor.png') {
      products[truckCompIndex].image = '/truck-compressor.png';
      modified = true;
    }

    // Migrate any products that still use the 'Bitzer' brand to 'Sanden'
    products.forEach(p => {
      if (p.brand === 'Bitzer') {
        p.brand = 'Sanden';
        if (p.name.includes('Bitzer')) {
          p.name = p.name.replace('Bitzer', 'Sanden');
        }
        modified = true;
      }
    });

    // Migrate Expansion Valve – Bus image if using old placeholder URL
    const busExpIndex = products.findIndex(p => p.id === 7);
    if (busExpIndex !== -1 && products[busExpIndex].image !== '/bus-expansion-valve.png') {
      products[busExpIndex].image = '/bus-expansion-valve.png';
      modified = true;
    }

    // Migrate Bus Condenser Coil image if using old placeholder URL
    const busCondIndex = products.findIndex(p => p.id === 8);
    if (busCondIndex !== -1 && products[busCondIndex].image !== '/bus-condenser-coil.png') {
      products[busCondIndex].image = '/bus-condenser-coil.png';
      modified = true;
    }

    // Migrate Magnetic Clutch – Compressor image if using old placeholder URL
    const magIndex = products.findIndex(p => p.id === 11);
    if (magIndex !== -1 && products[magIndex].image !== '/magnetic-clutch.png') {
      products[magIndex].image = '/magnetic-clutch.png';
      modified = true;
    }

    // Migrate Bus Blower Assembly image if using old placeholder URL
    const busBlowIndex = products.findIndex(p => p.id === 12);
    if (busBlowIndex !== -1 && products[busBlowIndex].image !== '/bus-blower-assembly.png') {
      products[busBlowIndex].image = '/bus-blower-assembly.png';
      modified = true;
    }

    // Migrate new B2B vehicle products if missing
    if (!products.some(p => p.id === 50)) {
      const b2bProducts = [
        {
          id: 50,
          name: 'Payload AC Compressor',
          category: 'Payload Vehicle',
          brand: 'Denso',
          price: 18500,
          image: '/compressor.png',
          description: 'Heavy-duty AC compressor optimized for payload vehicles and load-carriers. Designed to maintain optimal cabin cooling during long transport routes under heavy loads.',
          inStock: true,
        },
        {
          id: 51,
          name: 'Payload Evaporator Coil',
          category: 'Payload Vehicle',
          brand: 'Sanden',
          price: 9200,
          image: '/evaporator-coil.png',
          description: 'High-capacity evaporator coil with reinforced copper-aluminum fins. Engineered to withstand heavy vibrations in payload carriers.',
          inStock: true,
        },
        {
          id: 52,
          name: 'Payload Condenser Assembly',
          category: 'Payload Vehicle',
          brand: 'Valeo',
          price: 14000,
          image: '/condenser.png',
          description: 'Heavy-duty multi-flow condenser assembly for efficient heat transfer. Corrosion-resistant coating for payloaders operating in harsh environments.',
          inStock: true,
        },
        {
          id: 53,
          name: 'Excavator AC Cabin Unit',
          category: 'Construction Vehicle',
          brand: 'Subros',
          price: 45000,
          image: '/bus-ac-unit.png',
          description: 'Premium roof-mounted cabin AC unit for excavators and loaders. Offers rapid cooling and dust filtration for challenging construction environments.',
          inStock: true,
        },
        {
          id: 54,
          name: 'Construction Blower Assembly',
          category: 'Construction Vehicle',
          brand: 'Spal',
          price: 7200,
          image: '/bus-blower-assembly.png',
          description: 'Reinforced high-velocity cabin blower assembly. Engineered for maximum air circulation in dusty construction vehicles.',
          inStock: true,
        },
        {
          id: 55,
          name: 'Heavy Loader Evaporator',
          category: 'Construction Vehicle',
          brand: 'Denso',
          price: 11500,
          image: '/cooling-coil.png',
          description: 'OEM-replacement heavy-duty evaporator core for front loaders and backhoes. High heat exchange efficiency for hot work zones.',
          inStock: true,
        },
        {
          id: 56,
          name: 'Bulldozer Cabin AC Kit',
          category: 'Bulldozer',
          brand: 'Sanden',
          price: 55000,
          image: '/bus-ac-unit.png',
          description: 'Complete heavy-duty climate control kit for bulldozer cabins. Restores both heating and cooling functions with dust-proof seals.',
          inStock: true,
        },
        {
          id: 57,
          name: 'Bulldozer Heavy Compressor',
          category: 'Bulldozer',
          brand: 'Sanden',
          price: 28000,
          image: '/truck-compressor.png',
          description: 'Rugged B2B wholesale bulldozer AC compressor. Built to operate continuously under extreme heat and high vibrations.',
          inStock: true,
        },
        {
          id: 58,
          name: 'Bulldozer Reinforced Condenser',
          category: 'Bulldozer',
          brand: 'Valeo',
          price: 19800,
          image: '/bus-condenser-coil.png',
          description: 'Ultra-durable auxiliary condenser coil with reinforced outer casing. Protects against flying debris on active earthmoving sites.',
          inStock: true,
        },
        {
          id: 59,
          name: 'Truck Condenser Assembly',
          category: 'Truck',
          brand: 'Sanden',
          price: 11500,
          image: '/condenser.png',
          description: 'High-performance truck condenser assembly designed to survive rough roads and long hauls. Optimal refrigerant cooling.',
          inStock: true,
        },
        {
          id: 60,
          name: 'Truck Blower Motor',
          category: 'Truck',
          brand: 'Denso',
          price: 6800,
          image: '/blower-motor.png',
          description: 'Quiet, powerful cabin blower motor for long-haul trucks. Restores multi-speed air distribution and cab ventilation.',
          inStock: true,
        }
      ];
      products.push(...b2bProducts);
      modified = true;
    }



    if (modified) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
    return products;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
  return defaultProducts;
}

export function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function addProduct(product) {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: Date.now(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id, updatedData) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedData };
    saveProducts(products);
    return products[index];
  }
  return null;
}

export function deleteProduct(id) {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
  return products;
}

export const categories = ['All', 'Car', 'Truck', 'Bus', 'Payload Vehicle', 'Construction Vehicle', 'Bulldozer'];
export const brands = [
  'Denso',
  'Mahle Behr',
  'Behr Hella Service',
  'Estra',
  'Spal',
  'TCCI',
  'Giladard',
  'Pasio',
  'Mann Filter',
  'Mahle Filter',
  'Subros',
  'Fujikoki',
  'Danfoss',
  'Zip Filters',
  'Spintek',
  'Sanden',
  'Doowon',
  'Hanon',
  'Valeo',
  'SRF',
  'Toyota',
  'Lexus',
  'Motherson',
  'Value',
  'Honda',
  'MGP (Maruti Genuine Parts)',
  'BPI',
  'Zilax',
  'Vika',
  'NSK',
  'Delphi',
  'Banco',
  'Tata',
  'Taco International',
  'Lucas TVS',
  'Formula',
  'Hyundai Genuine Parts',
  'Symbol Refrigeration Solutions',
  'Hongsen'
];
