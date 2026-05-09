// Default product data — stored in localStorage for CRUD persistence
const defaultProducts = [
  {
    id: 1,
    name: 'AC Compressor – Universal',
    category: 'Car',
    brand: 'Denso',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80',
    description: 'High-performance universal AC compressor compatible with most sedan and hatchback models. Durable construction with precision engineering.',
    inStock: true,
  },
  {
    id: 2,
    name: 'Condenser Assembly – Car',
    category: 'Car',
    brand: 'Sanden',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80',
    description: 'OEM-grade condenser assembly designed for optimal heat dissipation. Fits popular car models.',
    inStock: true,
  },
  {
    id: 3,
    name: 'Evaporator Core – Sedan',
    category: 'Car',
    brand: 'Valeo',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&q=80',
    description: 'Premium evaporator core ensuring efficient cooling. Anti-corrosion coated for longevity.',
    inStock: true,
  },
  {
    id: 4,
    name: 'Blower Motor – Heavy Duty',
    category: 'Truck',
    brand: 'Behr',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80',
    description: 'Heavy-duty blower motor designed for commercial trucks. High airflow capacity with silent operation.',
    inStock: true,
  },
  {
    id: 5,
    name: 'Truck AC Compressor – Bitzer',
    category: 'Truck',
    brand: 'Bitzer',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=400&q=80',
    description: 'Industrial-grade AC compressor for heavy trucks and trailers. Built for extreme conditions.',
    inStock: true,
  },
  {
    id: 6,
    name: 'Receiver Drier – Universal',
    category: 'Car',
    brand: 'Denso',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1504222490345-c075b6008014?w=400&q=80',
    description: 'Removes moisture and contaminants from the AC system. Essential for compressor protection.',
    inStock: true,
  },
  {
    id: 7,
    name: 'Expansion Valve – Bus',
    category: 'Bus',
    brand: 'Valeo',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80',
    description: 'Precision expansion valve designed for bus AC systems. Ensures optimal refrigerant flow.',
    inStock: true,
  },
  {
    id: 8,
    name: 'Bus Condenser Coil',
    category: 'Bus',
    brand: 'Sanden',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80',
    description: 'Large-capacity condenser coil for commercial bus AC systems. High efficiency heat exchange.',
    inStock: true,
  },
  {
    id: 9,
    name: 'Radiator Fan – 12V',
    category: 'Car',
    brand: 'Behr',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&q=80',
    description: 'Electric radiator cooling fan assembly. Efficient 12V motor with balanced blade design.',
    inStock: true,
  },
  {
    id: 10,
    name: 'AC Hose Kit – Truck',
    category: 'Truck',
    brand: 'Denso',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1504222490345-c075b6008014?w=400&q=80',
    description: 'Complete AC hose kit for trucks. Includes high and low pressure hoses with fittings.',
    inStock: true,
  },
  {
    id: 11,
    name: 'Magnetic Clutch – Compressor',
    category: 'Car',
    brand: 'Sanden',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80',
    description: 'OEM replacement magnetic clutch for AC compressors. Precise engagement and smooth operation.',
    inStock: true,
  },
  {
    id: 12,
    name: 'Bus Blower Assembly',
    category: 'Bus',
    brand: 'Bitzer',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=400&q=80',
    description: 'Complete blower assembly for bus HVAC systems. Multi-speed with high airflow rating.',
    inStock: true,
  },
];

const STORAGE_KEY = 'rcs_products';

export function getProducts() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
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

export const categories = ['All', 'Car', 'Truck', 'Bus'];
export const brands = ['Denso', 'Sanden', 'Valeo', 'Behr', 'Bitzer'];
