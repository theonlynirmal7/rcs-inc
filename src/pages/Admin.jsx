import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Package,
  Lock,
  Upload,
  Download,
  Copy,
  Search,
  Check,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { dbService, compressAndConvertToWebp } from '../supabase';
import { useToast } from '../context/ToastContext';
import { brands, categories } from '../data/products';
import JSZip from 'jszip';
import useSEO from '../hooks/useSEO';
import './Admin.css';

// Remove 'All' from categories for form inputs
const formCategories = categories.filter(c => c !== 'All');

const initialFormState = {
  name: '',
  oem_number: '',
  brand: 'Denso',
  category: 'Car',
  vehicle_type: '',
  description: '',
  specifications: '',
  compatible_vehicles: '',
  featured: false,
  stock_status: 'In Stock'
};

// Robust CSV parser supporting quotes, commas, and newlines
function parseCSV(text) {
  const lines = [];
  let row = [''];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      lines.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== '') {
    lines.push(row);
  }
  return lines;
}

export default function Admin() {
  useSEO('Admin Dashboard', 'Enquire and manage inventory, product catalogs, upload brand parts, and track real-time visitors.');

  const { addToast } = useToast();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('rcs_admin_auth') === 'true'
  );
  const [passwordInput, setPasswordInput] = useState('');

  // Banner Settings State
  const [showBanner, setShowBanner] = useState(
    () => localStorage.getItem('rcs_show_banner') === 'true'
  );
  const [bannerImage, setBannerImage] = useState(
    () => localStorage.getItem('rcs_banner_image') || ''
  );

  const handleBannerImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      addToast('Compressing and optimizing banner image...', 'info');
      const webpBase64 = await compressAndConvertToWebp(file, 0.7);
      setBannerImage(webpBase64);
      addToast('Banner image uploaded and optimized successfully!');
    } catch (err) {
      console.error(err);
      addToast('Failed to optimize banner image', 'error');
    }
  };

  const handleSaveBannerSettings = async (e) => {
    e.preventDefault();
    try {
      await dbService.saveSiteBanner(showBanner, bannerImage);
      addToast('Site banner settings updated successfully!');
    } catch (err) {
      console.error('Error saving banner settings:', err);
      addToast('Failed to save banner settings.', 'error');
    }
  };

  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterVehicleType, setFilterVehicleType] = useState('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit' | 'view' | 'duplicate'
  const [formState, setFormState] = useState(initialFormState);
  const [uploadedImages, setUploadedImages] = useState([]); // [{ id, image_url, image_type, is_cover, sort_order, isUploading }]
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Delete Confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Drag and drop state
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const zipInputRef = useRef(null);
  const csvInputRef = useRef(null);

  // Analytics state
  const [visitStats, setVisitStats] = useState({
    totalVisits: 0,
    visitsToday: 0,
    activeNow: 1,
    chartData: [],
    recentVisits: []
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const loadBannerSettings = async () => {
    try {
      const banner = await dbService.getSiteBanner();
      setShowBanner(banner.showBanner);
      setBannerImage(banner.bannerImage);
    } catch (err) {
      console.error('Failed to load banner settings:', err);
    }
  };

  // Fetch products and stats on load/auth
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
      loadStats();
      loadBannerSettings();

      const interval = setInterval(() => {
        loadStats();
      }, 10000); // Poll traffic stats every 10 seconds

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await dbService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load products from database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const data = await dbService.getVisitStats();
      setVisitStats(data);
    } catch (err) {
      console.error('Failed to load website visit stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Password verification
  const handleLogin = (e) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'rcs_admin_2026';
    if (passwordInput === correctPassword) {
      sessionStorage.setItem('rcs_admin_auth', 'true');
      setIsAuthenticated(true);
      addToast('Admin authenticated successfully!');
    } else {
      addToast('Incorrect password', 'error');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('rcs_admin_auth');
    setIsAuthenticated(false);
    setPasswordInput('');
    addToast('Logged out of admin panel.');
  };

  // Compute stats/metrics from current unfiltered list
  const stats = useMemo(() => {
    const total = products.length;
    const brandsSet = new Set(products.map(p => p.brand).filter(Boolean));
    const categoriesSet = new Set(products.map(p => p.category).filter(Boolean));
    
    // Last 5 added products
    const recent = [...products]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    return {
      totalProducts: total,
      totalBrands: brandsSet.size,
      totalCategories: categoriesSet.size,
      recentlyAdded: recent
    };
  }, [products]);

  // Unique vehicle types computed for filter list
  const vehicleTypes = useMemo(() => {
    const types = new Set(products.map(p => p.vehicle_type).filter(Boolean));
    return ['All', ...Array.from(types)];
  }, [products]);

  // Filtered and searched products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const nameMatch = p.name ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      const oemMatch = p.oem_number ? p.oem_number.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      const brandMatch = p.brand ? p.brand.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      const queryMatch = nameMatch || oemMatch || brandMatch || searchQuery === '';

      const brandFilter = filterBrand === 'All' || p.brand === filterBrand;
      const catFilter = filterCategory === 'All' || p.category === filterCategory;
      const typeFilter = filterVehicleType === 'All' || p.vehicle_type === filterVehicleType;

      return queryMatch && brandFilter && catFilter && typeFilter;
    });
  }, [products, searchQuery, filterBrand, filterCategory, filterVehicleType]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterBrand, filterCategory, filterVehicleType]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;

  // Handle CRUD Form Changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Open modals
  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormState(initialFormState);
    setUploadedImages([]);
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormState({
      name: product.name || '',
      oem_number: product.oem_number || '',
      brand: product.brand || 'Denso',
      category: product.category || 'Car',
      vehicle_type: product.vehicle_type || '',
      description: product.description || '',
      specifications: product.specifications || '',
      compatible_vehicles: product.compatible_vehicles || '',
      featured: product.featured || false,
      stock_status: product.stock_status || 'In Stock'
    });
    
    setIsModalOpen(true);
    setLoadingImages(true);
    try {
      const imgs = await dbService.getProductImages(product.id);
      setUploadedImages(imgs);
    } catch (err) {
      console.error(err);
      addToast('Error loading product images', 'error');
    } finally {
      setLoadingImages(false);
    }
  };

  const [loadingImages, setLoadingImages] = useState(false);

  const handleOpenDuplicateModal = async (product) => {
    setModalMode('duplicate');
    setSelectedProduct(product);
    setFormState({
      name: `${product.name} - Copy`,
      oem_number: product.oem_number ? `${product.oem_number}-COPY` : '',
      brand: product.brand || 'Denso',
      category: product.category || 'Car',
      vehicle_type: product.vehicle_type || '',
      description: product.description || '',
      specifications: product.specifications || '',
      compatible_vehicles: product.compatible_vehicles || '',
      featured: product.featured || false,
      stock_status: product.stock_status || 'In Stock'
    });

    setIsModalOpen(true);
    setLoadingImages(true);
    try {
      const imgs = await dbService.getProductImages(product.id);
      // Map images to look like new uploaded ones (without previous database IDs) so they save correctly
      const copiedImgs = imgs.map((img, i) => ({
        id: `copy-${Date.now()}-${i}`,
        image_url: img.image_url,
        image_type: img.image_type,
        is_cover: img.is_cover,
        sort_order: img.sort_order
      }));
      setUploadedImages(copiedImgs);
    } catch (err) {
      console.error(err);
      addToast('Error duplicating product images', 'error');
    } finally {
      setLoadingImages(false);
    }
  };

  const handleOpenViewModal = async (product) => {
    setModalMode('view');
    setSelectedProduct(product);
    setFormState({
      name: product.name || '',
      oem_number: product.oem_number || '',
      brand: product.brand || '',
      category: product.category || '',
      vehicle_type: product.vehicle_type || '',
      description: product.description || '',
      specifications: product.specifications || '',
      compatible_vehicles: product.compatible_vehicles || '',
      featured: product.featured || false,
      stock_status: product.stock_status || 'In Stock'
    });

    setIsModalOpen(true);
    setLoadingImages(true);
    try {
      const imgs = await dbService.getProductImages(product.id);
      setUploadedImages(imgs);
    } catch (err) {
      console.error(err);
      addToast('Error loading images', 'error');
    } finally {
      setLoadingImages(false);
    }
  };

  // Submit Product Form (Add / Edit / Duplicate)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formState.name) {
      addToast('Product name is required.', 'error');
      return;
    }

    setLoading(true);
    try {
      // Find cover image, fallback to first image, fallback to placeholder
      const coverImg = uploadedImages.find(img => img.is_cover && !img.isUploading) || uploadedImages.find(img => !img.isUploading);
      const coverUrl = coverImg ? coverImg.image_url : '/compressor.png';

      const finalProductData = {
        ...formState,
        image: coverUrl,
        // sync frontend compatibility fields
        inStock: formState.stock_status === 'In Stock',
        price: selectedProduct?.price || 0 // preserve price if duplicate/edit
      };

      // Filter out any images still currently uploading
      const validImages = uploadedImages
        .filter(img => !img.isUploading)
        .map((img, index) => ({
          image_url: img.image_url,
          image_type: img.image_type,
          is_cover: coverImg ? img.image_url === coverImg.image_url : index === 0,
          sort_order: index
        }));

      if (modalMode === 'edit' && selectedProduct) {
        await dbService.updateProduct(selectedProduct.id, finalProductData, validImages);
        addToast('Product updated successfully!');
      } else {
        // Modal mode 'add' or 'duplicate'
        await dbService.addProduct(finalProductData, validImages);
        addToast(modalMode === 'duplicate' ? 'Product duplicated successfully!' : 'Product added successfully!');
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      console.error(err);
      addToast('Error saving product: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete product triggers custom confirmation dialog
  const handleDeleteTrigger = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setLoading(true);
    try {
      await dbService.deleteProduct(productToDelete.id);
      addToast('Product deleted successfully!');
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      loadProducts();
    } catch (err) {
      console.error(err);
      addToast('Delete failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Drag and Drop files handling
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFiles(e.dataTransfer.files);
    }
  };

  const handleImageFiles = async (files) => {
    const newImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        addToast(`File ${file.name} is not an image.`, 'error');
        continue;
      }

      const tempId = `temp-${Date.now()}-${i}-${Math.random()}`;
      // Immediate local preview URL
      const previewUrl = URL.createObjectURL(file);

      const tempRecord = {
        id: tempId,
        image_url: previewUrl,
        image_type: 'Product Image',
        is_cover: false,
        sort_order: uploadedImages.length + i,
        isUploading: true,
        name: file.name,
        fileRef: file
      };
      newImages.push(tempRecord);
    }

    setUploadedImages(prev => [...prev, ...newImages]);

    // Perform actual upload in background
    for (const tempRecord of newImages) {
      try {
        const uploadResult = await dbService.uploadImage(tempRecord.fileRef, tempRecord.image_type);
        setUploadedImages(prev => {
          const coverExists = prev.some(img => img.is_cover && !img.isUploading);
          return prev.map(img => {
            if (img.id === tempRecord.id) {
              return {
                ...img,
                id: `img-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                image_url: uploadResult.image_url,
                is_cover: !coverExists, // make it cover if no cover exists yet
                isUploading: false
              };
            }
            return img;
          });
        });
      } catch (err) {
        console.error(err);
        addToast(`Failed to upload ${tempRecord.name}: ${err.message}`, 'error');
        setUploadedImages(prev => prev.filter(img => img.id !== tempRecord.id));
      }
    }
  };

  // Set Cover Image
  const handleSetCover = (index) => {
    setUploadedImages(prev =>
      prev.map((img, i) => ({
        ...img,
        is_cover: i === index
      }))
    );
  };

  // Remove Image
  const handleRemoveImage = (index) => {
    setUploadedImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Re-assign cover if we deleted the cover image
      if (prev[index]?.is_cover && updated.length > 0) {
        updated[0].is_cover = true;
      }
      return updated;
    });
  };

  // Reorder Images
  const handleMoveImage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= uploadedImages.length) return;

    setUploadedImages(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      
      // Update sort order values
      return updated.map((img, idx) => ({
        ...img,
        sort_order: idx
      }));
    });
  };

  // Change Image Type dropdown
  const handleImageTypeChange = (index, type) => {
    setUploadedImages(prev =>
      prev.map((img, i) => (i === index ? { ...img, image_type: type } : img))
    );
  };

  // Bulk ZIP Upload with OEM Matcher
  const handleZipUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    addToast('Extracting and matching images from ZIP archive...', 'success');

    try {
      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);

      const entries = [];
      zipData.forEach((relativePath, entry) => {
        if (!entry.dir && /\.(png|jpe?g|webp)$/i.test(entry.name)) {
          const parts = entry.name.split('/');
          const filename = parts[parts.length - 1];
          // Skip temporary/system files
          if (!filename.startsWith('._') && !filename.startsWith('.')) {
            const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
            entries.push({ entry, oem: nameWithoutExt.trim(), filename });
          }
        }
      });

      if (entries.length === 0) {
        addToast('No valid images found in the ZIP archive.', 'error');
        setLoading(false);
        return;
      }

      const currentProducts = await dbService.getProducts();
      let matchCount = 0;
      let failCount = 0;

      for (const item of entries) {
        // Match with product OEM number (case-insensitive, trimmed)
        const matchedProduct = currentProducts.find(
          p => p.oem_number && p.oem_number.toLowerCase().trim() === item.oem.toLowerCase()
        );

        if (matchedProduct) {
          const blob = await item.entry.async('blob');
          const fileObj = new File([blob], item.filename, { type: blob.type || 'image/webp' });

          // Upload image
          const uploadResult = await dbService.uploadImage(fileObj, 'Product Image');

          // Fetch current product images
          const existingImages = await dbService.getProductImages(matchedProduct.id);

          // If no cover image exists, make this the cover
          const isFirst = existingImages.length === 0 || !existingImages.some(img => img.is_cover);
          
          const newImgRecord = {
            image_url: uploadResult.image_url,
            image_type: 'Product Image',
            is_cover: isFirst,
            sort_order: existingImages.length
          };

          const updatedImagesList = [...existingImages, newImgRecord];
          const productUpdates = {};
          if (isFirst) {
            productUpdates.image = uploadResult.image_url;
          }

          await dbService.updateProduct(matchedProduct.id, productUpdates, updatedImagesList);
          matchCount++;
        } else {
          failCount++;
        }
      }

      loadProducts();

      if (matchCount > 0) {
        addToast(
          `Bulk Upload: Matched & uploaded ${matchCount} images!${
            failCount > 0 ? ` (${failCount} filenames had no matching OEM in database)` : ''
          }`
        );
      } else {
        addToast(`No matches found. ${failCount} unmatched files processed.`, 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('ZIP upload failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
      // Reset input value
      e.target.value = '';
    }
  };

  // CSV Catalog Export
  const handleExportCSV = () => {
    try {
      const headers = [
        'id',
        'name',
        'oem_number',
        'brand',
        'category',
        'vehicle_type',
        'description',
        'specifications',
        'compatible_vehicles',
        'featured',
        'stock_status',
        'created_at',
        'image'
      ];

      const escapeCSV = (str) => {
        if (str === null || str === undefined) return '';
        const stringified = String(str);
        if (
          stringified.includes(',') ||
          stringified.includes('"') ||
          stringified.includes('\n') ||
          stringified.includes('\r')
        ) {
          return `"${stringified.replace(/"/g, '""')}"`;
        }
        return stringified;
      };

      const csvRows = [headers.join(',')];

      for (const p of products) {
        const row = [
          p.id,
          escapeCSV(p.name),
          escapeCSV(p.oem_number),
          escapeCSV(p.brand),
          escapeCSV(p.category),
          escapeCSV(p.vehicle_type),
          escapeCSV(p.description),
          escapeCSV(p.specifications),
          escapeCSV(p.compatible_vehicles),
          p.featured ? 'true' : 'false',
          escapeCSV(p.stock_status),
          p.created_at || '',
          escapeCSV(p.image)
        ];
        csvRows.push(row.join(','));
      }

      const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = URL.createObjectURL(csvBlob);
      const tempLink = document.createElement('a');
      tempLink.setAttribute('href', downloadUrl);
      tempLink.setAttribute('download', `rcs_catalog_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      addToast('Product catalog exported to CSV successfully!');
    } catch (err) {
      addToast('CSV export failed: ' + err.message, 'error');
    }
  };

  // CSV Catalog Import
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      try {
        const lines = parseCSV(text);
        if (lines.length < 2) {
          addToast('Invalid CSV format.', 'error');
          return;
        }

        const headers = lines[0].map(h => h.trim().toLowerCase());
        const dataRows = lines.slice(1);

        setLoading(true);
        let addCount = 0;
        let updateCount = 0;

        const currentProducts = await dbService.getProducts();

        for (const row of dataRows) {
          if (row.length === 0 || (row.length === 1 && row[0] === '')) continue;

          const record = {};
          headers.forEach((header, index) => {
            if (row[index] !== undefined) {
              record[header] = row[index].trim();
            }
          });

          if (!record.name) continue; // Skip rows missing name

          const oem = record.oem_number || '';
          const brand = record.brand || 'Denso';
          const category = record.category || 'Car';
          const vehicleType = record.vehicle_type || category;
          const desc = record.description || '';
          const specs = record.specifications || '';
          const compat = record.compatible_vehicles || '';
          const featured = record.featured === 'true' || record.featured === '1' || record.featured === 'yes';
          const stock = record.stock_status || 'In Stock';
          const imageVal = record.image || '/compressor.png';

          // Match by ID or OEM number
          let existing = null;
          if (record.id) {
            existing = currentProducts.find(p => String(p.id) === String(record.id));
          } else if (oem) {
            existing = currentProducts.find(
              p => p.oem_number && p.oem_number.toLowerCase().trim() === oem.toLowerCase().trim()
            );
          }

          const productData = {
            name: record.name,
            oem_number: oem,
            brand: brand,
            category: category,
            vehicle_type: vehicleType,
            description: desc,
            specifications: specs,
            compatible_vehicles: compat,
            featured: featured,
            stock_status: stock,
            image: imageVal,
            inStock: stock === 'In Stock'
          };

          if (existing) {
            // Update fields but pass undefined for images to preserve them
            await dbService.updateProduct(existing.id, productData, undefined);
            updateCount++;
          } else {
            await dbService.addProduct(productData, []);
            addCount++;
          }
        }

        loadProducts();
        addToast(`CSV Import: Created ${addCount} new and updated ${updateCount} existing products.`);
      } catch (err) {
        console.error(err);
        addToast('CSV Import failed: ' + err.message, 'error');
      } finally {
        setLoading(false);
        e.target.value = '';
      }
    };
    reader.onerror = () => addToast('Failed to read CSV file.', 'error');
    reader.readAsText(file);
  };

  // Render Login overlay
  if (!isAuthenticated) {
    return (
      <div className="admin-page page-transition">
        <div className="admin-login-overlay">
          <div className="admin-login-card">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--admin-red-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--admin-red)'
                }}
              >
                <Lock size={28} />
              </div>
            </div>
            <h2>RCS Admin Access</h2>
            <p>Enter Admin Password</p>
            <form onSubmit={handleLogin}>
              <div className="admin-password-group">
                <label htmlFor="admin-pass">Password</label>
                <input
                  type="password"
                  id="admin-pass"
                  className="admin-password-input"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className="admin-login-btn">
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page page-transition">
      <div className="container admin-dashboard-container">
        {/* HEADER */}
        <div className="admin-header-row">
          <div className="admin-title-area">
            <h1>RCS Inventory Dashboard</h1>
            <p>Manage products, specifications, and media library</p>
          </div>
          <div className="admin-header-actions">
            <button className="admin-btn" onClick={handleLogout}>
              Logout
            </button>
            <button className="admin-btn admin-btn-primary" onClick={handleOpenAddModal}>
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>

        {/* OVERVIEW CARDS */}
        <div className="admin-overview-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Package size={24} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-num">{loading ? '...' : stats.totalProducts}</span>
              <span className="admin-stat-label">Total Products</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <ImageIcon size={24} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-num">{loading ? '...' : stats.totalBrands}</span>
              <span className="admin-stat-label">Total Brands</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <RefreshCw size={24} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-num">{loading ? '...' : stats.totalCategories}</span>
              <span className="admin-stat-label">Total Categories</span>
            </div>
          </div>
          <div className="admin-stat-card" style={{ flexGrow: 1.5 }}>
            <div className="admin-stat-info" style={{ width: '100%' }}>
              <span className="admin-stat-label" style={{ marginBottom: '8px', display: 'block' }}>
                Recently Added
              </span>
              {loading ? (
                <div className="admin-skeleton-line" style={{ height: '30px' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {stats.recentlyAdded.map(p => (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        borderBottom: '1px solid var(--admin-border)',
                        paddingBottom: '2px'
                      }}
                    >
                      <span className="admin-table-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                        {p.name}
                      </span>
                      <span style={{ fontFamily: 'monospace', color: 'var(--admin-text-muted)' }}>
                        {p.oem_number || 'No OEM'}
                      </span>
                    </div>
                  ))}
                  {stats.recentlyAdded.length === 0 && (
                    <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>No products found</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PROMOTIONAL BANNER MANAGER */}
        <div className="admin-banner-settings-section" style={{ marginBottom: '24px' }}>
          <div className="admin-analytics-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0' }}>📢 Banner Campaign Manager</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--admin-text-muted)' }}>Toggle and configure promotional banners across the RCS website</p>
            
            <form onSubmit={handleSaveBannerSettings} className="admin-banner-form">
              <div className="admin-banner-toggle-row" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <label className="admin-switch-label" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showBanner}
                    onChange={(e) => setShowBanner(e.target.checked)}
                    className="admin-switch-input"
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '700', marginLeft: '8px', color: showBanner ? '#E31E24' : 'var(--admin-text-muted)' }}>
                    {showBanner ? 'Banner is ACTIVE' : 'Banner is DISABLED'}
                  </span>
                </label>
              </div>

              {showBanner && (
                <div className="admin-banner-fields" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: '20px' }}>
                  <div className="admin-form-group">
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--admin-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Banner Poster Image</label>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      {bannerImage && (
                        <img 
                          src={bannerImage} 
                          alt="Banner Preview" 
                          style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-border)' }} 
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBannerImageUpload}
                          style={{ display: 'none' }}
                          id="banner-image-file"
                        />
                        <label 
                          htmlFor="banner-image-file" 
                          className="admin-btn"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid var(--admin-border)', padding: '8px 12px', borderRadius: '6px', background: 'var(--admin-bg)', color: 'var(--admin-text)' }}
                        >
                          <Upload size={14} /> Upload Custom Image
                        </label>
                        {bannerImage && (
                          <button 
                            type="button" 
                            onClick={() => setBannerImage('')} 
                            className="admin-btn"
                            style={{ marginLeft: '12px', color: '#E31E24', border: '1px solid #E31E24', padding: '8px 12px', borderRadius: '6px', background: 'transparent' }}
                          >
                            Reset to Default
                          </button>
                        )}
                        <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                          Recommended size: 800x600px. Fallback to default poster if left blank.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={16} /> Save Banner Settings
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* WEBSITE VISITOR TRAFFIC ANALYTICS */}
        <div className="admin-analytics-section">
          {/* 7-DAY TRAFFIC CHART */}
          <div className="admin-analytics-card">
            <h3>Website Traffic (Last 7 Days)</h3>
            <p>Unique visitor sessions logged per day</p>
            {loadingStats ? (
              <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="admin-preview-spinner" />
              </div>
            ) : (
              <div className="admin-chart-container">
                {(() => {
                  const maxCount = Math.max(...visitStats.chartData.map(d => d.count), 1);
                  return visitStats.chartData.map((day) => {
                    const barHeight = (day.count / maxCount) * 100;
                    return (
                      <div key={day.date} className="admin-chart-bar-col">
                        <div 
                          className="admin-chart-bar-wrap" 
                          data-count={day.count}
                        >
                          <div 
                            className="admin-chart-bar" 
                            style={{ height: `${barHeight}%` }} 
                          />
                        </div>
                        <span className="admin-chart-label">{day.label}</span>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>

          {/* TRAFFIC SUMMARY & RECENT LOGS */}
          <div className="admin-analytics-card">
            <h3>Traffic Metrics & Logs</h3>
            <p>Summary of unique sessions</p>
            
            {loadingStats ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <div className="admin-preview-spinner" />
              </div>
            ) : (
              <>
                <div className="admin-anal-stats-grid">
                  <div className="admin-anal-stat-box">
                    <span className="admin-anal-stat-label">Total Visits</span>
                    <span className="admin-anal-stat-val">{visitStats.totalVisits}</span>
                  </div>
                  <div className="admin-anal-stat-box">
                    <span className="admin-anal-stat-label">Visits Today</span>
                    <span className="admin-anal-stat-val">{visitStats.visitsToday}</span>
                  </div>
                  <div className="admin-anal-stat-box" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="admin-anal-stat-label" style={{ margin: 0 }}>Active Now</span>
                      <span className="live-pulse-dot" style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#10B981',
                        boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
                        animation: 'pulse 1.5s infinite'
                      }} />
                    </div>
                    <span className="admin-anal-stat-val" style={{ color: '#10B981', marginTop: '6px', display: 'block' }}>
                      {visitStats.activeNow || 1}
                    </span>
                  </div>
                </div>

                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-dark)', marginBottom: '8px', display: 'block' }}>
                  Recent Sessions
                </span>
                <div className="admin-log-list">
                  {visitStats.recentVisits.map((v, idx) => {
                    const timeStr = v.created_at
                      ? new Date(v.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                      : '--:--';
                    const dateLabel = v.created_at
                      ? new Date(v.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : '';
                    return (
                      <div key={v.id || idx} className="admin-log-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '4px', padding: '10px 12px', borderBottom: '1px solid var(--admin-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="admin-log-path" title={v.page_path} style={{ fontWeight: '700', color: 'var(--admin-text-dark)', fontSize: '13px' }}>
                            {v.page_path}
                          </span>
                          <span className="admin-log-time" style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                            {dateLabel} {timeStr}
                          </span>
                        </div>
                        {(v.browser || v.os || v.device_type) && (
                          <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--admin-text-muted)', flexWrap: 'wrap', marginTop: '2px' }}>
                            {v.device_type && <span style={{ background: 'rgba(227, 30, 36, 0.08)', color: '#E31E24', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>{v.device_type}</span>}
                            {v.browser && <span>{v.browser} on {v.os || 'Unknown OS'}</span>}
                            {v.screen_resolution && <span>({v.screen_resolution})</span>}
                            {v.referrer && v.referrer !== 'Direct' && (
                              <span style={{ color: '#E31E24', fontWeight: '500' }}>via {v.referrer}</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {visitStats.recentVisits.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '12px', padding: '20px 0' }}>
                      No sessions logged yet.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* BULK & CONTROLS SECTION */}
        <div className="admin-controls-card">
          <div className="admin-search-wrapper">
            <Search className="admin-search-icon" size={18} />
            <input
              type="text"
              className="admin-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, OEM, or brand..."
            />
          </div>

          <div className="admin-filters-row">
            <select
              className="admin-filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              className="admin-filter-select"
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
            >
              <option value="All">All Brands</option>
              {brands.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              className="admin-filter-select"
              value={filterVehicleType}
              onChange={(e) => setFilterVehicleType(e.target.value)}
            >
              <option value="All">All Vehicle Types</option>
              {vehicleTypes.filter(t => t !== 'All').map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* BULK DATA OPERATIONS */}
        <div
          className="admin-controls-card"
          style={{ marginTop: '-12px', background: '#FFFDFD', borderColor: 'rgba(225, 29, 46, 0.15)' }}
        >
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--admin-text-dark)' }}>
            Bulk Management
          </span>
          <div className="admin-bulk-actions-wrapper">
            <button className="admin-btn" onClick={() => csvInputRef.current?.click()}>
              <Upload size={14} /> Import CSV
            </button>
            <input
              type="file"
              ref={csvInputRef}
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleImportCSV}
            />

            <button className="admin-btn" onClick={handleExportCSV}>
              <Download size={14} /> Export CSV
            </button>

            <button className="admin-btn" onClick={() => zipInputRef.current?.click()}>
              <Upload size={14} /> Upload Images ZIP
            </button>
            <input
              type="file"
              ref={zipInputRef}
              accept=".zip"
              style={{ display: 'none' }}
              onChange={handleZipUpload}
            />
          </div>
        </div>

        {/* PRODUCTS TABLE */}
        <div className="admin-table-container">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>OEM Number</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="admin-skeleton-row">
                      <td>
                        <div className="admin-table-product">
                          <div className="admin-skeleton-line img" />
                          <div className="admin-skeleton-line name" />
                        </div>
                      </td>
                      <td>
                        <div className="admin-skeleton-line" style={{ width: '80px' }} />
                      </td>
                      <td>
                        <div className="admin-skeleton-line" style={{ width: '60px' }} />
                      </td>
                      <td>
                        <div className="admin-skeleton-line badge" />
                      </td>
                      <td>
                        <div className="admin-skeleton-line actions" />
                      </td>
                    </tr>
                  ))
                ) : paginatedProducts.length > 0 ? (
                  paginatedProducts.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="admin-table-product">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="admin-table-img"
                            onError={(e) => {
                              e.target.src = '/compressor.png';
                            }}
                          />
                          <div>
                            <span className="admin-table-name">{p.name}</span>
                            {p.featured && (
                              <span className="admin-featured-badge">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-table-oem">{p.oem_number || '—'}</span>
                      </td>
                      <td>{p.brand}</td>
                      <td>
                        <span className={`admin-badge ${p.category.toLowerCase().replace(/\s+/g, '-')}`}>
                          {p.category}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="admin-action-btn view"
                            title="View"
                            onClick={() => handleOpenViewModal(p)}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="admin-action-btn edit"
                            title="Edit"
                            onClick={() => handleOpenEditModal(p)}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="admin-action-btn"
                            title="Duplicate"
                            onClick={() => handleOpenDuplicateModal(p)}
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            className="admin-action-btn delete"
                            title="Delete"
                            onClick={() => handleDeleteTrigger(p)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="admin-empty-state">
                        <Package className="admin-empty-icon" size={48} />
                        <h4>No Products Found</h4>
                        <p>No products match the filters or search query.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {!loading && filteredProducts.length > 0 && (
            <div className="admin-pagination">
              <span className="admin-pagination-text">
                Showing {Math.min((currentPage - 1) * pageSize + 1, filteredProducts.length)} to{' '}
                {Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} entries
              </span>
              <div className="admin-pagination-buttons">
                <button
                  className="admin-btn"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  className="admin-btn"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT / DUPLICATE / VIEW MODAL */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>
                {modalMode === 'add'
                  ? 'Add New Product'
                  : modalMode === 'edit'
                  ? 'Edit Product'
                  : modalMode === 'duplicate'
                  ? 'Duplicate Product'
                  : 'View Product Details'}
              </h3>
              <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              {modalMode === 'view' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* View Details Layout */}
                  <div className="admin-view-grid">
                    <div>
                      {/* Image Viewer */}
                      <img
                        src={selectedProduct?.image || '/compressor.png'}
                        alt={selectedProduct?.name}
                        style={{
                          width: '100%',
                          borderRadius: 'var(--admin-radius-md)',
                          border: '1px solid var(--admin-border)',
                          objectFit: 'cover',
                          height: '240px',
                          background: 'var(--admin-bg)'
                        }}
                        onError={(e) => {
                          e.target.src = '/compressor.png';
                        }}
                      />
                      {/* Image List */}
                      {uploadedImages.length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-muted)' }}>
                            Media Gallery ({uploadedImages.length})
                          </span>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '8px' }}>
                            {uploadedImages.map((img, i) => (
                              <div
                                key={i}
                                style={{
                                  border: '1px solid var(--admin-border)',
                                  borderRadius: '6px',
                                  overflow: 'hidden',
                                  height: '50px',
                                  background: 'var(--admin-bg)',
                                  position: 'relative'
                                }}
                              >
                                <img
                                  src={img.image_url}
                                  alt="Gallery item"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <span
                                  style={{
                                    position: 'absolute',
                                    bottom: '2px',
                                    left: '2px',
                                    fontSize: '7px',
                                    background: 'rgba(0,0,0,0.6)',
                                    color: '#fff',
                                    padding: '1px 3px',
                                    borderRadius: '2px'
                                  }}
                                >
                                  {img.image_type.replace(' Image', '')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>{selectedProduct?.name}</h2>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            color: 'var(--admin-text-muted)',
                            display: 'block',
                            marginTop: '4px'
                          }}
                        >
                          OEM Number: {selectedProduct?.oem_number || 'N/A'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span className={`admin-badge ${selectedProduct?.category?.toLowerCase().replace(/\s+/g, '-')}`}>
                          {selectedProduct?.category}
                        </span>
                        <span style={{ background: 'var(--admin-bg)', padding: '4px 10px', fontSize: '11px', borderRadius: '100px', fontWeight: 700 }}>
                          Brand: {selectedProduct?.brand}
                        </span>
                        <span style={{ background: 'var(--admin-bg)', padding: '4px 10px', fontSize: '11px', borderRadius: '100px', fontWeight: 700 }}>
                          Vehicle: {selectedProduct?.vehicle_type || 'N/A'}
                        </span>
                      </div>

                      <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '14px' }}>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: '13px' }}>Description</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--admin-text-muted)', lineHeight: '1.5' }}>
                          {selectedProduct?.description || 'No description provided.'}
                        </p>
                      </div>

                      {selectedProduct?.specifications && (
                        <div>
                          <h4 style={{ margin: '0 0 6px 0', fontSize: '13px' }}>Specifications</h4>
                          <p style={{ margin: 0, fontSize: '14px', color: 'var(--admin-text-muted)', lineHeight: '1.5' }}>
                            {selectedProduct.specifications}
                          </p>
                        </div>
                      )}

                      {selectedProduct?.compatible_vehicles && (
                        <div>
                          <h4 style={{ margin: '0 0 6px 0', fontSize: '13px' }}>Compatible Vehicles</h4>
                          <p style={{ margin: 0, fontSize: '14px', color: 'var(--admin-text-muted)', lineHeight: '1.5' }}>
                            {selectedProduct.compatible_vehicles}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProduct} id="admin-product-form">
                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label htmlFor="form-name">Product Name *</label>
                      <input
                        type="text"
                        id="form-name"
                        name="name"
                        value={formState.name}
                        onChange={handleFormChange}
                        className="admin-form-input"
                        placeholder="e.g. Compressor Denso 10S15C"
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor="form-oem">OEM Number</label>
                      <input
                        type="text"
                        id="form-oem"
                        name="oem_number"
                        value={formState.oem_number}
                        onChange={handleFormChange}
                        className="admin-form-input"
                        placeholder="e.g. 447260-3480"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor="form-brand">Brand</label>
                      <select
                        id="form-brand"
                        name="brand"
                        value={formState.brand}
                        onChange={handleFormChange}
                        className="admin-form-select"
                      >
                        {brands.map(b => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor="form-category">Category</label>
                      <select
                        id="form-category"
                        name="category"
                        value={formState.category}
                        onChange={handleFormChange}
                        className="admin-form-select"
                      >
                        {formCategories.map(c => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor="form-type">Vehicle Type</label>
                      <input
                        type="text"
                        id="form-type"
                        name="vehicle_type"
                        value={formState.vehicle_type}
                        onChange={handleFormChange}
                        className="admin-form-input"
                        placeholder="e.g. Hatchback, Sedan, SUV"
                      />
                    </div>



                    <div className="admin-form-group full">
                      <label htmlFor="form-desc">Description</label>
                      <textarea
                        id="form-desc"
                        name="description"
                        value={formState.description}
                        onChange={handleFormChange}
                        className="admin-form-textarea"
                        placeholder="Enter general product description..."
                        rows={3}
                      />
                    </div>

                    <div className="admin-form-group full">
                      <label htmlFor="form-specs">Specifications</label>
                      <textarea
                        id="form-specs"
                        name="specifications"
                        value={formState.specifications}
                        onChange={handleFormChange}
                        className="admin-form-textarea"
                        placeholder="e.g. Oil Type: PAG46, Refrigerant: R134a, Voltage: 12V..."
                        rows={2}
                      />
                    </div>

                    <div className="admin-form-group full">
                      <label htmlFor="form-compatible">Compatible Vehicles</label>
                      <textarea
                        id="form-compatible"
                        name="compatible_vehicles"
                        value={formState.compatible_vehicles}
                        onChange={handleFormChange}
                        className="admin-form-textarea"
                        placeholder="e.g. Maruti Swift (2018-2024), Hyundai i20 (2015-2020)..."
                        rows={2}
                      />
                    </div>

                    <div className="admin-form-group full">
                      <label className="admin-toggle-label">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formState.featured}
                          onChange={handleFormChange}
                        />
                        Featured Product (Showcase on website home page)
                      </label>
                    </div>
                  </div>

                  {/* IMAGE UPLOAD SECTION */}
                  <div style={{ marginTop: '24px', borderTop: '1px solid var(--admin-border)', paddingTop: '24px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--admin-text-dark)', marginBottom: '12px', display: 'block' }}>
                      Product Images
                    </span>

                    {/* Previews grid */}
                    {uploadedImages.length > 0 && (
                      <div className="admin-image-previews-grid">
                        {uploadedImages.map((img, index) => (
                          <div key={img.id || index} className="admin-image-preview-card">
                            <div className="admin-preview-img-container">
                              <img src={img.image_url} alt="Preview" className="admin-preview-img" />
                              {img.is_cover && <span className="admin-preview-cover-badge">Cover</span>}
                              
                              {/* Remove image */}
                              <button
                                type="button"
                                className="admin-preview-delete-btn"
                                onClick={() => handleRemoveImage(index)}
                                title="Remove Image"
                              >
                                <X size={14} />
                              </button>

                              {/* Upload spinner */}
                              {img.isUploading && (
                                <div className="admin-preview-loading">
                                  <div className="admin-preview-spinner" />
                                  <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--admin-text-muted)' }}>
                                    Compressing...
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="admin-preview-details">
                              {/* Select type */}
                              <select
                                className="admin-preview-select"
                                value={img.image_type}
                                onChange={(e) => handleImageTypeChange(index, e.target.value)}
                              >
                                <option value="Product Image">Product Image</option>
                                <option value="Packaging Image">Packaging Image</option>
                                <option value="Technical Diagram">Technical Diagram</option>
                                <option value="Installation Image">Installation Image</option>
                              </select>

                              {/* Actions sub-row */}
                              <div className="admin-preview-actions-row">
                                <button
                                  type="button"
                                  className="admin-preview-action-sub-btn"
                                  onClick={() => handleMoveImage(index, -1)}
                                  disabled={index === 0}
                                  title="Move Left"
                                >
                                  ←
                                </button>
                                <button
                                  type="button"
                                  className={`admin-preview-action-sub-btn ${img.is_cover ? 'cover' : ''}`}
                                  onClick={() => handleSetCover(index)}
                                  title="Make Cover"
                                >
                                  Cover
                                </button>
                                <button
                                  type="button"
                                  className="admin-preview-action-sub-btn"
                                  onClick={() => handleMoveImage(index, 1)}
                                  disabled={index === uploadedImages.length - 1}
                                  title="Move Right"
                                >
                                  →
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Drag and Drop Panel */}
                    <div
                      className={`admin-image-upload-panel ${dragActive ? 'active' : ''}`}
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="admin-upload-icon">
                        <Upload size={32} />
                      </div>
                      <div className="admin-upload-text">
                        <h4>📷 Drag & Drop Product Images</h4>
                        <p>or click to choose files (Multiple supported, WebP auto-compressed)</p>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleImageFiles(e.target.files)}
                        multiple
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>
                </form>
              )}
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn" onClick={() => setIsModalOpen(false)}>
                {modalMode === 'view' ? 'Close' : 'Cancel'}
              </button>
              {modalMode !== 'view' && (
                <button type="submit" form="admin-product-form" className="admin-btn admin-btn-primary">
                  <Save size={16} /> Save Product
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card small">
            <div className="admin-modal-header">
              <h3>Confirm Deletion</h3>
              <button className="admin-modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-confirm-body">
                Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This will permanently
                remove this product and all associated images from the catalog.
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-primary" onClick={confirmDelete}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
