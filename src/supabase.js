import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// IndexedDB Helper for fallback offline database
const openIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('rcs_local_db', 4);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('product_images')) {
        db.createObjectStore('product_images', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('site_visits')) {
        db.createObjectStore('site_visits', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('diagrams')) {
        db.createObjectStore('diagrams', { keyPath: 'id' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

const getLocalData = async (storeName) => {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveLocalData = async (storeName, item) => {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(item);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const deleteLocalData = async (storeName, id) => {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const initializeLocalDataIfEmpty = async () => {
  const dbProducts = await getLocalData('products');
  if (dbProducts.length === 0) {
    const { getProducts } = await import('./data/products');
    const currentProducts = getProducts();
    for (const p of currentProducts) {
      const oemNum = p.oem_number || (p.name.includes('Denso') && '447260-3480') || (p.name.includes('Sanden') && 'SND-2918') || '';
      await saveLocalData('products', {
        id: p.id,
        name: p.name,
        category: p.category,
        brand: p.brand,
        image: p.image || '/compressor.png',
        oem_number: oemNum,
        vehicle_type: p.vehicle_type || p.category,
        description: p.description || '',
        specifications: p.specifications || '',
        compatible_vehicles: p.compatible_vehicles || '',
        featured: p.featured || false,
        stock_status: p.inStock ? 'In Stock' : 'Out of Stock',
        created_at: p.created_at || new Date().toISOString(),
      });
      
      if (p.image) {
        await saveLocalData('product_images', {
          id: `img-${p.id}`,
          product_id: p.id,
          image_url: p.image,
          image_type: 'Product Image',
          is_cover: true,
          sort_order: 0,
        });
      }
    }
  }

  const dbDiagrams = await getLocalData('diagrams');
  
  // Unconditionally seed/update the A/C System Exploded View Diagram with exact coordinates
  await saveLocalData('diagrams', {
    id: 'ac-system-exploded',
    name: 'A/C System Exploded View Diagram',
    image_url: '/diagrams/ac-system-exploded.png?v=5',
    hotspots: [
      { id: 1, component: 'A/C Compressor Assembly', x: 9.3, y: 12.3, oem: 'CO-29007C', stock: 'In Stock', description: 'Compresses refrigerant gas and circulates it through the system.' },
      { id: 2, component: 'Condenser', x: 44.5, y: 6.2, oem: 'CN-38012C', stock: 'In Stock', description: 'Cools and condenses high-pressure gas into liquid.' },
      { id: 3, component: 'Receiver Drier', x: 60.5, y: 7.2, oem: 'RD-10022C', stock: 'In Stock', description: 'Filters moisture and debris from the refrigerant liquid.' },
      { id: 4, component: 'Cooling Fan Assembly', x: 9.3, y: 44.3, oem: 'FN-48092C', stock: 'In Stock', description: 'Pulls air through the condenser to cool the refrigerant.' },
      { id: 5, component: 'A/C Hoses & Pipes', x: 6.2, y: 59.2, oem: 'HP-50033C', stock: 'In Stock', description: 'High and low pressure lines carrying refrigerant.' },
      { id: 6, component: 'Expansion Valve', x: 30.8, y: 52.2, oem: 'EV-68023C', stock: 'In Stock', description: 'Regulates flow of refrigerant into the evaporator core.' },
      { id: 7, component: 'Evaporator Core', x: 48.2, y: 52.2, oem: 'EC-70044C', stock: 'In Stock', description: 'Absorbs heat from the cabin air to provide cooling.' },
      { id: 8, component: 'Blower Motor', x: 61.8, y: 59.8, oem: 'BM-80055C', stock: 'In Stock', description: 'Blows chilled air through the vents into the cabin.' },
      { id: 9, component: 'Cabin Air Filter', x: 32.2, y: 81.2, oem: 'CF-90066C', stock: 'In Stock', description: 'Filters dust, pollen, and allergens from cabin intake air.' },
      { id: 10, component: 'HVAC Unit (Air Box Assembly)', x: 95.8, y: 64.2, oem: 'HU-10077C', stock: 'In Stock', description: 'Houses the evaporator, heater core, blend doors, and blower.' },
      { id: 11, component: 'AC Pressure Switch', x: 61.8, y: 78.2, oem: 'PS-11088C', stock: 'In Stock', description: 'Monitors system pressure to protect compressor from damage.' }
    ]
  });

  const hvacDiagrams = dbDiagrams.filter(d => d.id !== 'ac-system-exploded');
  if (hvacDiagrams.length < 4) {
    await saveLocalData('diagrams', {
      id: 'swift-hvac',
      name: 'Maruti Suzuki Swift AC HVAC Unit Casing',
      image_url: '/diagrams/swift-hvac.png',
      hotspots: [
        { id: 10, component: 'Heater Core', x: 48, y: 84, oem: '95411-68LA0', stock: 'In Stock', description: 'Absorbs engine heat to provide cabin heating.' },
        { id: 100, component: 'Evaporator Coil', x: 32, y: 45, oem: '95412-68LA0', stock: 'In Stock', description: 'Absorbs cabin heat to provide cooling.' },
        { id: 280, component: 'Blower Motor', x: 88, y: 48, oem: '74250-68LA1', stock: 'In Stock', description: 'Centrifugal blower fan assembly drawing air into the cabin.' },
        { id: 480, component: 'Cabin Filter', x: 52, y: 86, oem: '95861-68LA0', stock: 'In Stock', description: 'Pollen and dust filtration element.' },
        { id: 70, component: 'Actuator Motor', x: 68, y: 30, oem: '74130-68LA0', stock: 'In Stock', description: 'Electric servo actuator controlling air distribution doors.' },
        { id: 270, component: 'Blower Resistor', x: 88, y: 56, oem: '74150-68LA0', stock: 'In Stock', description: 'Regulates blower motor speed levels.' }
      ]
    });

    await saveLocalData('diagrams', {
      id: 'creta-hvac',
      name: 'Hyundai Creta AC HVAC Unit Casing',
      image_url: '/diagrams/creta-hvac.png',
      hotspots: [
        { id: 10, component: 'Heater Core', x: 46, y: 80, oem: '95411-H8000', stock: 'In Stock', description: 'Absorbs engine heat to provide cabin heating.' },
        { id: 100, component: 'Evaporator Coil', x: 30, y: 48, oem: '95412-H8000', stock: 'In Stock', description: 'Absorbs cabin heat to provide cooling.' },
        { id: 280, component: 'Blower Motor', x: 85, y: 44, oem: '74250-H8010', stock: 'In Stock', description: 'Centrifugal blower fan assembly drawing air into the cabin.' },
        { id: 480, component: 'Cabin Filter', x: 50, y: 82, oem: '95861-H8000', stock: 'In Stock', description: 'Pollen and dust filtration element.' },
        { id: 70, component: 'Actuator Motor', x: 66, y: 28, oem: '74130-H8000', stock: 'In Stock', description: 'Electric servo actuator controlling air distribution doors.' },
        { id: 270, component: 'Blower Resistor', x: 85, y: 52, oem: '74150-H8000', stock: 'In Stock', description: 'Regulates blower motor speed levels.' }
      ]
    });

    await saveLocalData('diagrams', {
      id: 'nexon-hvac',
      name: 'Tata Nexon AC HVAC Unit Casing',
      image_url: '/diagrams/nexon-hvac.png',
      hotspots: [
        { id: 10, component: 'Heater Core', x: 50, y: 82, oem: '95411-N000', stock: 'In Stock', description: 'Absorbs engine heat to provide cabin heating.' },
        { id: 100, component: 'Evaporator Coil', x: 34, y: 46, oem: '95412-N000', stock: 'In Stock', description: 'Absorbs cabin heat to provide cooling.' },
        { id: 280, component: 'Blower Motor', x: 86, y: 46, oem: '74250-N010', stock: 'In Stock', description: 'Centrifugal blower fan assembly drawing air into the cabin.' },
        { id: 480, component: 'Cabin Filter', x: 54, y: 84, oem: '95861-N000', stock: 'In Stock', description: 'Pollen and dust filtration element.' },
        { id: 70, component: 'Actuator Motor', x: 70, y: 32, oem: '74130-N000', stock: 'In Stock', description: 'Electric servo actuator controlling air distribution doors.' },
        { id: 270, component: 'Blower Resistor', x: 86, y: 54, oem: '74150-N000', stock: 'In Stock', description: 'Regulates blower motor speed levels.' }
      ]
    });

    await saveLocalData('diagrams', {
      id: 'fortuner-hvac',
      name: 'Toyota Fortuner AC HVAC Unit Casing',
      image_url: '/diagrams/fortuner-hvac.png',
      hotspots: [
        { id: 10, component: 'Heater Core', x: 52, y: 80, oem: '95411-F000', stock: 'In Stock', description: 'Absorbs engine heat to provide cabin heating.' },
        { id: 100, component: 'Evaporator Coil', x: 36, y: 44, oem: '95412-F000', stock: 'In Stock', description: 'Absorbs cabin heat to provide cooling.' },
        { id: 280, component: 'Blower Motor', x: 84, y: 44, oem: '74250-F010', stock: 'In Stock', description: 'Centrifugal blower fan assembly drawing air into the cabin.' },
        { id: 480, component: 'Cabin Filter', x: 56, y: 82, oem: '95861-F000', stock: 'In Stock', description: 'Pollen and dust filtration element.' },
        { id: 70, component: 'Actuator Motor', x: 72, y: 30, oem: '74130-F000', stock: 'In Stock', description: 'Electric servo actuator controlling air distribution doors.' },
        { id: 270, component: 'Blower Resistor', x: 84, y: 52, oem: '74150-F000', stock: 'In Stock', description: 'Regulates blower motor speed levels.' }
      ]
    });
  }
};

const syncLocalCache = async () => {
  try {
    let productsList = [];
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('products').select('*').order('name');
      productsList = data || [];
    } else {
      productsList = await getLocalData('products');
    }
    
    const mappedProducts = productsList.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      brand: p.brand,
      image: p.image || '/compressor.png',
      description: p.description || '',
      inStock: p.stock_status === 'In Stock',
      oem_number: p.oem_number || '',
      vehicle_type: p.vehicle_type || p.category,
      specifications: p.specifications || '',
      compatible_vehicles: p.compatible_vehicles || '',
      featured: p.featured || false,
    }));

    localStorage.setItem('rcs_products', JSON.stringify(mappedProducts));
  } catch (err) {
    console.error('Error syncing local cache:', err);
  }
};

// Trigger initial sync
setTimeout(() => {
  initializeLocalDataIfEmpty().then(syncLocalCache).catch(console.error);
}, 200);

// Client-side WebP conversion and compression
export async function compressAndConvertToWebp(file, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const newFileName = file.name.substring(0, file.name.lastIndexOf('.')) + '.webp';
            const compressedFile = new File([blob], newFileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve({ file: compressedFile, previewUrl: URL.createObjectURL(blob) });
          } else {
            reject(new Error('Canvas to WebP conversion failed'));
          }
        }, 'image/webp', quality);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export const dbService = {
  isSupabaseEnabled() {
    return isSupabaseConfigured;
  },

  async getProducts() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .neq('category', 'Settings')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } else {
      await initializeLocalDataIfEmpty();
      const localProds = await getLocalData('products');
      const filtered = localProds.filter(p => p.category !== 'Settings');
      return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  },
  
  async getProductImages(productId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order');
      if (error) throw error;
      return data || [];
    } else {
      const allImages = await getLocalData('product_images');
      return allImages
        .filter(img => img.product_id === productId)
        .sort((a, b) => a.sort_order - b.sort_order);
    }
  },

  async addProduct(product, images) {
    const id = isSupabaseConfigured ? undefined : (product.id || Date.now());
    const newProduct = { 
      ...product, 
      id, 
      created_at: new Date().toISOString() 
    };
    
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()
        .single();
      if (error) throw error;
      
      if (images && images.length > 0) {
        const imagesWithProductId = images.map((img, index) => {
          const { id: _, ...imgData } = img;
          return {
            ...imgData,
            product_id: data.id,
            sort_order: index,
          };
        });
        const { error: imgError } = await supabase
          .from('product_images')
          .insert(imagesWithProductId);
        if (imgError) throw imgError;
      }
      
      await syncLocalCache();
      return data;
    } else {
      await saveLocalData('products', newProduct);
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          const imgId = `img-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`;
          await saveLocalData('product_images', {
            id: imgId,
            product_id: newProduct.id,
            image_url: img.image_url,
            image_type: img.image_type,
            is_cover: img.is_cover,
            sort_order: i,
          });
        }
      }
      await syncLocalCache();
      return newProduct;
    }
  },

  async updateProduct(id, product, images) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;

      if (images !== null && images !== undefined) {
        const { error: deleteError } = await supabase
          .from('product_images')
          .delete()
          .eq('product_id', id);
        if (deleteError) throw deleteError;

        if (images.length > 0) {
          const imagesWithProductId = images.map((img, index) => {
            const { id: _, ...imgData } = img;
            return {
              ...imgData,
              product_id: id,
              sort_order: index,
            };
          });
          const { error: imgError } = await supabase
            .from('product_images')
            .insert(imagesWithProductId);
          if (imgError) throw imgError;
        }
      }

      await syncLocalCache();
      return data;
    } else {
      const existing = await getLocalData('products');
      const idx = existing.findIndex(p => p.id === id);
      if (idx !== -1) {
        const updated = { ...existing[idx], ...product };
        await saveLocalData('products', updated);

        if (images !== null && images !== undefined) {
          // Delete old local images and save new ones
          const allImages = await getLocalData('product_images');
          const otherImages = allImages.filter(img => img.product_id !== id);
          
          const db = await openIndexedDB();
          await new Promise((resolve, reject) => {
            const transaction = db.transaction('product_images', 'readwrite');
            const store = transaction.objectStore('product_images');
            store.clear();
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
          });

          for (const img of otherImages) {
            await saveLocalData('product_images', img);
          }

          if (images.length > 0) {
            for (let i = 0; i < images.length; i++) {
              const img = images[i];
              const imgId = img.id && img.id.startsWith('img-') ? img.id : `img-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`;
              await saveLocalData('product_images', {
                id: imgId,
                product_id: id,
                image_url: img.image_url,
                image_type: img.image_type,
                is_cover: img.is_cover,
                sort_order: i,
              });
            }
          }
        }
        await syncLocalCache();
        return updated;
      }
    }
  },

  async deleteProduct(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      
      await syncLocalCache();
    } else {
      await deleteLocalData('products', id);
      const allImages = await getLocalData('product_images');
      const associated = allImages.filter(img => img.product_id === id);
      for (const img of associated) {
        await deleteLocalData('product_images', img.id);
      }
      await syncLocalCache();
    }
  },

  async uploadImage(file, imageType) {
    const { file: compressedFile } = await compressAndConvertToWebp(file);
    
    if (isSupabaseConfigured) {
      const fileName = `${Date.now()}_${compressedFile.name}`;
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, compressedFile);
      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);
      
      return {
        image_url: publicUrlData.publicUrl,
        image_type: imageType,
        is_cover: false,
        name: compressedFile.name,
      };
    } else {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            image_url: reader.result,
            image_type: imageType,
            is_cover: false,
            name: compressedFile.name,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(compressedFile);
      });
    }
  },

  triggerSync() {
    return syncLocalCache();
  },

  parseUserAgent(ua) {
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';
    let deviceType = 'Desktop';

    if (/mobile/i.test(ua)) deviceType = 'Mobile';
    else if (/tablet|ipad/i.test(ua)) deviceType = 'Tablet';

    if (/chrome|crios/i.test(ua)) browser = 'Chrome';
    else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
    else if (/edg/i.test(ua)) browser = 'Edge';

    if (/windows/i.test(ua)) os = 'Windows';
    else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
    else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/linux/i.test(ua)) os = 'Linux';

    return { browser, os, deviceType };
  },

  async recordVisit(pagePath) {
    const ua = navigator.userAgent;
    const { browser, os, deviceType } = this.parseUserAgent(ua);
    const visitRecord = {
      created_at: new Date().toISOString(),
      page_path: pagePath || '/',
      browser,
      os,
      device_type: deviceType,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      referrer: document.referrer || 'Direct'
    };
    
    if (isSupabaseConfigured) {
      try {
        // Try inserting full record
        const { error } = await supabase
          .from('site_visits')
          .insert([visitRecord]);
        if (error) {
          // If error occurs (e.g. column not defined on remote table), fall back to only standard columns
          const { error: fallbackErr } = await supabase
            .from('site_visits')
            .insert([{ created_at: visitRecord.created_at, page_path: visitRecord.page_path }]);
          if (fallbackErr) throw fallbackErr;
        }
      } catch (err) {
        console.error('Error inserting visit to Supabase, falling back to local store:', err);
        await saveLocalData('site_visits', visitRecord);
      }
    } else {
      await saveLocalData('site_visits', visitRecord);
    }
  },

  async getVisitStats() {
    let visits = [];
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('site_visits')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        visits = data || [];
      } catch (err) {
        console.error('Error getting stats from Supabase, loading from local store:', err);
        visits = await getLocalData('site_visits');
      }
    } else {
      visits = await getLocalData('site_visits');
    }
    
    // Sort visits by created_at descending
    visits.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Calculate metrics
    const totalVisits = visits.length;
    
    const todayStr = new Date().toISOString().slice(0, 10);
    const visitsToday = visits.filter(v => v.created_at && v.created_at.slice(0, 10) === todayStr).length;

    // Last 7 days chart data YYYY-MM-DD
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const count = visits.filter(v => v.created_at && v.created_at.slice(0, 10) === dateStr).length;
      chartData.push({ date: dateStr, label, count });
    }

    // Get 10 most recent visits
    const recentVisits = visits.slice(0, 10).map(v => ({
      id: v.id,
      created_at: v.created_at,
      page_path: v.page_path || '/',
      browser: v.browser || '',
      os: v.os || '',
      device_type: v.device_type || '',
      screen_resolution: v.screen_resolution || '',
      referrer: v.referrer || ''
    }));

    // Calculate live active users in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeNowCount = visits.filter(v => v.created_at && new Date(v.created_at) >= fiveMinutesAgo).length;
    const activeNow = Math.max(1, activeNowCount);

    return {
      totalVisits,
      visitsToday,
      activeNow,
      chartData,
      recentVisits
    };
  },

  async getSiteBanner() {
    try {
      let product = null;
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', '99999999-9999-9999-9999-999999999999')
          .maybeSingle();
        if (!error && data) {
          product = data;
        }
      } else {
        const localProds = await getLocalData('products');
        product = localProds.find(p => p.id === '99999999-9999-9999-9999-999999999999');
      }

      if (product) {
        return {
          showBanner: product.description === 'active',
          bannerImage: product.image || ''
        };
      }
    } catch (err) {
      console.error('Error fetching site banner settings:', err);
    }

    // Default Fallback
    return {
      showBanner: false,
      bannerImage: ''
    };
  },

  async saveSiteBanner(showBanner, bannerImage) {
    const bannerRecord = {
      id: '99999999-9999-9999-9999-999999999999',
      name: 'Site Banner Settings',
      category: 'Settings',
      brand: 'RCS',
      image: bannerImage || '',
      description: showBanner ? 'active' : 'disabled',
      oem_number: 'BANNER-CFG',
      vehicle_type: 'Config',
      specifications: '',
      compatible_vehicles: '',
      featured: false,
      stock_status: 'In Stock',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data } = await supabase
        .from('products')
        .select('id')
        .eq('id', '99999999-9999-9999-9999-999999999999')
        .maybeSingle();

      if (data) {
        const { error } = await supabase
          .from('products')
          .update(bannerRecord)
          .eq('id', '99999999-9999-9999-9999-999999999999');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([bannerRecord]);
        if (error) throw error;
      }
    } else {
      await saveLocalData('products', bannerRecord);
    }
    await syncLocalCache();
  }
};

const staticDiagrams = [
  {
    id: 'swift-hvac',
    name: 'Maruti Suzuki Swift AC HVAC Unit Casing',
    image_url: '/diagrams/swift-hvac.png',
    hotspots: [
      { id: 10, component: 'Heater Core', x: 48, y: 84, oem: '95411-68LA0', stock: 'In Stock', description: 'Absorbs engine heat to provide cabin heating.' },
      { id: 100, component: 'Evaporator Coil', x: 32, y: 45, oem: '95412-68LA0', stock: 'In Stock', description: 'Absorbs cabin heat to provide cooling.' },
      { id: 280, component: 'Blower Motor', x: 88, y: 48, oem: '74250-68LA1', stock: 'In Stock', description: 'Centrifugal blower fan assembly drawing air into the cabin.' },
      { id: 480, component: 'Cabin Filter', x: 52, y: 86, oem: '95861-68LA0', stock: 'In Stock', description: 'Pollen and dust filtration element.' },
      { id: 70, component: 'Actuator Motor', x: 68, y: 30, oem: '74130-68LA0', stock: 'In Stock', description: 'Electric servo actuator controlling air distribution doors.' },
      { id: 270, component: 'Blower Resistor', x: 88, y: 56, oem: '74150-68LA0', stock: 'In Stock', description: 'Regulates blower motor speed levels.' }
    ]
  },
  {
    id: 'creta-hvac',
    name: 'Hyundai Creta AC HVAC Unit Casing',
    image_url: '/diagrams/creta-hvac.png',
    hotspots: [
      { id: 10, component: 'Heater Core', x: 46, y: 80, oem: '95411-H8000', stock: 'In Stock', description: 'Absorbs engine heat to provide cabin heating.' },
      { id: 100, component: 'Evaporator Coil', x: 30, y: 48, oem: '95412-H8000', stock: 'In Stock', description: 'Absorbs cabin heat to provide cooling.' },
      { id: 280, component: 'Blower Motor', x: 85, y: 44, oem: '74250-H8010', stock: 'In Stock', description: 'Centrifugal blower fan assembly drawing air into the cabin.' },
      { id: 480, component: 'Cabin Filter', x: 50, y: 82, oem: '95861-H8000', stock: 'In Stock', description: 'Pollen and dust filtration element.' },
      { id: 70, component: 'Actuator Motor', x: 66, y: 28, oem: '74130-H8000', stock: 'In Stock', description: 'Electric servo actuator controlling air distribution doors.' },
      { id: 270, component: 'Blower Resistor', x: 85, y: 52, oem: '74150-H8000', stock: 'In Stock', description: 'Regulates blower motor speed levels.' }
    ]
  },
  {
    id: 'nexon-hvac',
    name: 'Tata Nexon AC HVAC Unit Casing',
    image_url: '/diagrams/nexon-hvac.png',
    hotspots: [
      { id: 10, component: 'Heater Core', x: 50, y: 82, oem: '95411-N000', stock: 'In Stock', description: 'Absorbs engine heat to provide cabin heating.' },
      { id: 100, component: 'Evaporator Coil', x: 34, y: 46, oem: '95412-N000', stock: 'In Stock', description: 'Absorbs cabin heat to provide cooling.' },
      { id: 280, component: 'Blower Motor', x: 86, y: 46, oem: '74250-N010', stock: 'In Stock', description: 'Centrifugal blower fan assembly drawing air into the cabin.' },
      { id: 480, component: 'Cabin Filter', x: 54, y: 84, oem: '95861-N000', stock: 'In Stock', description: 'Pollen and dust filtration element.' },
      { id: 70, component: 'Actuator Motor', x: 70, y: 32, oem: '74130-N000', stock: 'In Stock', description: 'Electric servo actuator controlling air distribution doors.' },
      { id: 270, component: 'Blower Resistor', x: 86, y: 54, oem: '74150-N000', stock: 'In Stock', description: 'Regulates blower motor speed levels.' }
    ]
  },
  {
    id: 'fortuner-hvac',
    name: 'Toyota Fortuner AC HVAC Unit Casing',
    image_url: '/diagrams/fortuner-hvac.png',
    hotspots: [
      { id: 10, component: 'Heater Core', x: 52, y: 80, oem: '95411-F000', stock: 'In Stock', description: 'Absorbs engine heat to provide cabin heating.' },
      { id: 100, component: 'Evaporator Coil', x: 36, y: 44, oem: '95412-F000', stock: 'In Stock', description: 'Absorbs cabin heat to provide cooling.' },
      { id: 280, component: 'Blower Motor', x: 84, y: 44, oem: '74250-F010', stock: 'In Stock', description: 'Centrifugal blower fan assembly drawing air into the cabin.' },
      { id: 480, component: 'Cabin Filter', x: 56, y: 82, oem: '95861-F000', stock: 'In Stock', description: 'Pollen and dust filtration element.' },
      { id: 70, component: 'Actuator Motor', x: 72, y: 30, oem: '74130-F000', stock: 'In Stock', description: 'Electric servo actuator controlling air distribution doors.' },
      { id: 270, component: 'Blower Resistor', x: 84, y: 52, oem: '74150-F000', stock: 'In Stock', description: 'Regulates blower motor speed levels.' }
    ]
  },
  {
    id: 'ac-system-exploded',
    name: 'A/C System Exploded View Diagram',
    image_url: '/diagrams/ac-system-exploded.png',
    hotspots: [
      { id: 1, component: 'A/C Compressor Assembly', x: 5.3, y: 15.2, oem: 'CO-29007C', stock: 'In Stock', description: 'Compresses refrigerant gas and circulates it through the system.', brands: 'Subros, Denso, Sanden, J.K. Automotive, Estra, Hanon' },
      { id: 2, component: 'Condenser Assembly', x: 29.5, y: 13.5, oem: 'CN-38012C', stock: 'In Stock', description: 'Cools and condenses high-pressure gaseous refrigerant into a liquid state.', brands: 'Subros, Denso, Sanden, Behr Hella Service, Estra, Valeo' },
      { id: 3, component: 'Receiver Drier / Accumulator', x: 88.7, y: 26.2, oem: 'RD-10022C', stock: 'In Stock', description: 'Filters out moisture, debris, and contaminants from the liquid refrigerant.', brands: 'Denso, Sanden, Valeo, Behr Hella Service' },
      { id: 4, component: 'Block Expansion Valve', x: 21.2, y: 52.8, oem: 'EV-68023C', stock: 'In Stock', description: 'Regulates flow of refrigerant into the evaporator core to control cooling output.', brands: 'Fujikoki, Danfoss, Valeo, Denso' },
      { id: 5, component: 'Evaporator Core', x: 71.4, y: 52.8, oem: 'EC-70044C', stock: 'In Stock', description: 'Absorbs heat from the passenger cabin air to deliver chilled, cooled airflow.', brands: 'Valeo, Denso, Subros, Estra, Mahle Behr' },
      { id: 6, component: 'Cabin Air Filter', x: 60.3, y: 92.2, oem: 'CF-90066C', stock: 'In Stock', description: 'Filters dust, pollen, and allergens from cabin intake air.', brands: 'Zip Filters, Mahle Filter, Denso, Valeo' },
      { id: 7, component: 'Blower Fan & Blower Motor', x: 81.2, y: 92.2, oem: 'BM-80055C', stock: 'In Stock', description: 'Blows chilled air from the evaporator through the vehicle vents.', brands: 'Spal, Valeo, Sanden, Subros, Estra' },
      { id: 8, component: 'A/C Control Module / ECU', x: 89.6, y: 75.4, oem: 'CM-10077C', stock: 'In Stock', description: 'Automotive climate control module and engine interface unit managing A/C compressor cycle.', brands: 'Hanon, Doowon, Denso, Behr Hella Service' },
      { id: 9, component: 'A/C Hoses & Pipes', x: 11.8, y: 89.2, oem: 'HP-50033C', stock: 'In Stock', description: 'High and low pressure lines carrying refrigerant liquid and gas between components.', brands: 'Giladard, Subros, Denso, Estra' }
    ]
  },
  {
    id: 'bus-hvac',
    name: 'Bus A/C System Exploded View Diagram',
    image_url: '/diagrams/bus-hvac.png',
    hotspots: [
      { id: 1, component: 'A/C Compressor Assembly', x: 5.3, y: 15.2, oem: 'CO-29007C', stock: 'In Stock', description: 'Compresses refrigerant gas and circulates it through the system.', brands: 'Subros, Denso, Sanden, J.K. Automotive, Estra, Hanon' },
      { id: 2, component: 'Bus Condenser Coil', x: 29.5, y: 7.5, oem: 'CN-38012C', stock: 'In Stock', description: 'Large-capacity condenser coil designed for optimal heat rejection in commercial AC systems.', brands: 'Subros, Denso, Sanden, Behr Hella Service, Estra, Valeo' },
      { id: 3, component: 'Condenser Fan Assembly', x: 71.4, y: 7.5, oem: 'FN-48092C', stock: 'In Stock', description: 'Pulls air through the bus condenser to cool the refrigerant.', brands: 'Spal, Valeo, Sanden, Subros, Estra' },
      { id: 4, component: 'Receiver Drier / Accumulator', x: 88.7, y: 26.2, oem: 'RD-10022C', stock: 'In Stock', description: 'Filters out moisture, debris, and contaminants from the liquid refrigerant.', brands: 'Denso, Sanden, Valeo, Behr Hella Service' },
      { id: 5, component: 'Block Expansion Valve', x: 21.2, y: 52.8, oem: 'EV-68023C', stock: 'In Stock', description: 'Regulates flow of refrigerant into the evaporator core to control cooling output.', brands: 'Fujikoki, Danfoss, Valeo, Denso' },
      { id: 6, component: 'A/C Hoses & Pipes', x: 60.3, y: 92.2, oem: 'HP-50033C', stock: 'In Stock', description: 'High and low pressure lines carrying refrigerant liquid and gas between components.', brands: 'Giladard, Subros, Denso, Estra' },
      { id: 7, component: 'Bus Blower Assembly', x: 89.6, y: 38.5, oem: 'BM-80055C', stock: 'In Stock', description: 'Complete blower assembly for commercial bus HVAC systems.', brands: 'Spal, Valeo, Sanden, Subros, Estra' },
      { id: 8, component: 'Cabin Air Filter (Bottom)', x: 81.2, y: 92.2, oem: 'CF-90066C', stock: 'In Stock', description: 'Bottom dust and pollen filtration element for cabin intake air.', brands: 'Zip Filters, Mahle Filter, Denso, Valeo' },
      { id: 9, component: 'A/C Hoses & Pipes', x: 11.8, y: 89.2, oem: 'HP-50033C', stock: 'In Stock', description: 'High and low pressure lines carrying refrigerant liquid and gas between components.', brands: 'Giladard, Subros, Denso, Estra' },
      { id: 10, component: 'Cabin Air Filter (Fresh Air)', x: 88.5, y: 76.2, oem: 'CF-90088C', stock: 'In Stock', description: 'Fresh air intake filter cleaning outdoor air entering the bus AC system.', brands: 'Zip Filters, Mahle Filter, Denso, Valeo' }
    ]
  },
  {
    id: 'truck-hvac',
    name: 'Truck A/C System Exploded View Diagram',
    image_url: '/diagrams/truck-hvac.png',
    hotspots: [
      { id: 1, component: 'A/C Compressor Assembly', x: 5.3, y: 15.2, oem: 'CO-29007C', stock: 'In Stock', description: 'Compresses refrigerant gas and circulates it through the system.', brands: 'Subros, Denso, Sanden, J.K. Automotive, Estra, Hanon' },
      { id: 2, component: 'Truck Condenser Coil', x: 29.5, y: 7.5, oem: 'CN-38012C', stock: 'In Stock', description: 'Heavy-duty condenser coil designed for optimal heat dissipation in commercial trucks.', brands: 'Subros, Denso, Sanden, Behr Hella Service, Estra, Valeo' },
      { id: 3, component: 'Condenser Fan Assembly', x: 71.4, y: 7.5, oem: 'FN-48092C', stock: 'In Stock', description: 'Pulls air through the truck condenser to cool the refrigerant.', brands: 'Spal, Valeo, Sanden, Subros, Estra' },
      { id: 4, component: 'A/C Hoses & Pipes', x: 71.4, y: 41.2, oem: 'HP-50033C', stock: 'In Stock', description: 'High and low pressure lines carrying refrigerant liquid and gas between components.', brands: 'Giladard, Subros, Denso, Estra' },
      { id: 5, component: 'Block Expansion Valve', x: 21.2, y: 52.8, oem: 'EV-68023C', stock: 'In Stock', description: 'Regulates flow of refrigerant into the evaporator core to control cooling output.', brands: 'Fujikoki, Danfoss, Valeo, Denso' },
      { id: 6, component: 'Truck Blower Assembly', x: 60.3, y: 92.2, oem: 'BM-80055C', stock: 'In Stock', description: 'Centrifugal blower fan and motor assembly drawing air into the truck cabin.', brands: 'Spal, Valeo, Sanden, Subros, Estra' },
      { id: 7, component: 'Cabin Air Filter', x: 81.2, y: 92.2, oem: 'CF-90066C', stock: 'In Stock', description: 'Filters dust, pollen, and allergens from cabin intake air.', brands: 'Zip Filters, Mahle Filter, Denso, Valeo' },
      { id: 8, component: 'A/C Pressure Switch / Control Valve', x: 85.6, y: 92.2, oem: 'PS-11088C', stock: 'In Stock', description: 'Monitors system pressure to protect compressor from damage.', brands: 'Hanon, Doowon, Denso, Behr Hella Service' },
      { id: 9, component: 'A/C Hoses & Pipes', x: 11.8, y: 89.2, oem: 'HP-50033C', stock: 'In Stock', description: 'High and low pressure lines carrying refrigerant liquid and gas between components.', brands: 'Giladard, Subros, Denso, Estra' },
      { id: 10, component: 'Receiver Drier / Accumulator', x: 88.7, y: 26.2, oem: 'RD-10022C', stock: 'In Stock', description: 'Filters out moisture, debris, and contaminants from the liquid refrigerant.', brands: 'Denso, Sanden, Valeo, Behr Hella Service' },
      { id: 11, component: 'HVAC Air Box Casing', x: 36.8, y: 89.2, oem: 'AC-10099C', stock: 'In Stock', description: 'Heavy-duty cabin climate unit casing housing the evaporator core.', brands: 'Estra, Valeo, Subros, Sanden' }
    ]
  },
  {
    id: 'dozer-hvac',
    name: 'Bulldozer & Earthmover A/C System Exploded View Diagram',
    image_url: '/diagrams/dozer-hvac.png',
    hotspots: [
      { id: 1, component: 'A/C Compressor Assembly', x: 5.3, y: 15.2, oem: 'CO-29007C', stock: 'In Stock', description: 'Compresses refrigerant gas and circulates it through the system.', brands: 'Subros, Denso, Sanden, J.K. Automotive, Estra, Hanon' },
      { id: 2, component: 'Heavy Duty Condenser Coil', x: 29.5, y: 7.5, oem: 'CN-38012C', stock: 'In Stock', description: 'Heavy-duty condenser coil designed for optimal heat dissipation in heavy earthmovers.', brands: 'Subros, Denso, Sanden, Behr Hella Service, Estra, Valeo' },
      { id: 3, component: 'Receiver Drier / Accumulator', x: 88.7, y: 26.2, oem: 'RD-10022C', stock: 'In Stock', description: 'Filters out moisture, debris, and contaminants from the liquid refrigerant.', brands: 'Denso, Sanden, Valeo, Behr Hella Service' },
      { id: 4, component: 'A/C Hoses & Pipes', x: 71.4, y: 41.2, oem: 'HP-50033C', stock: 'In Stock', description: 'High and low pressure lines carrying refrigerant liquid and gas between components.', brands: 'Giladard, Subros, Denso, Estra' },
      { id: 5, component: 'Block Expansion Valve', x: 21.2, y: 52.8, oem: 'EV-68023C', stock: 'In Stock', description: 'Regulates flow of refrigerant into the evaporator core to control cooling output.', brands: 'Fujikoki, Danfoss, Valeo, Denso' },
      { id: 6, component: 'Heavy Duty Blower Assembly', x: 60.3, y: 92.2, oem: 'BM-80055C', stock: 'In Stock', description: 'High-volume blower fan and motor assembly drawing air into the operator cabin.', brands: 'Spal, Valeo, Sanden, Subros, Estra' },
      { id: 7, component: 'Cabin Air Filter', x: 81.2, y: 92.2, oem: 'CF-90066C', stock: 'In Stock', description: 'Filters dust, pollen, and allergens from cabin intake air.', brands: 'Zip Filters, Mahle Filter, Denso, Valeo' },
      { id: 8, component: 'A/C Manual Control Switch Panel', x: 85.6, y: 92.2, oem: 'SP-11088C', stock: 'In Stock', description: 'Operator dial switch module regulating cabin temperature and fan speed levels.', brands: 'Hanon, Doowon, Denso, Behr Hella Service' },
      { id: 9, component: 'A/C Hoses & Pipes', x: 11.8, y: 89.2, oem: 'HP-50033C', stock: 'In Stock', description: 'High and low pressure lines carrying refrigerant liquid and gas between components.', brands: 'Giladard, Subros, Denso, Estra' }
    ]
  },
  {
    id: 'lcv-hvac',
    name: 'Payload & Light Commercial Vehicle A/C System Exploded View Diagram',
    image_url: '/diagrams/lcv-hvac.png',
    hotspots: [
      { id: 1, component: 'A/C Compressor Assembly', x: 5.3, y: 15.2, oem: 'CO-29007C', stock: 'In Stock', description: 'Compresses refrigerant gas and circulates it through the system.', brands: 'Subros, Denso, Sanden, J.K. Automotive, Estra, Hanon' },
      { id: 2, component: 'LCV Condenser Coil', x: 29.5, y: 7.5, oem: 'CN-38012C', stock: 'In Stock', description: 'Condenser coil optimized for payload and light commercial vehicle cab cooling.', brands: 'Subros, Denso, Sanden, Behr Hella Service, Estra, Valeo' },
      { id: 3, component: 'Receiver Drier / Accumulator', x: 88.7, y: 26.2, oem: 'RD-10022C', stock: 'In Stock', description: 'Filters out moisture, debris, and contaminants from the liquid refrigerant.', brands: 'Denso, Sanden, Valeo, Behr Hella Service' },
      { id: 4, component: 'Condenser Fan Assembly', x: 71.4, y: 7.5, oem: 'FN-48092C', stock: 'In Stock', description: 'Pulls cooling airflow through the condenser coil assembly.', brands: 'Spal, Valeo, Sanden, Subros, Estra' },
      { id: 5, component: 'Block Expansion Valve', x: 21.2, y: 52.8, oem: 'EV-68023C', stock: 'In Stock', description: 'Regulates flow of refrigerant into the evaporator core to control cooling output.', brands: 'Fujikoki, Danfoss, Valeo, Denso' },
      { id: 6, component: 'LCV Blower Assembly', x: 60.3, y: 92.2, oem: 'BM-80055C', stock: 'In Stock', description: 'Centrifugal blower motor unit pushing cold air into the passenger compartment.', brands: 'Spal, Valeo, Sanden, Subros, Estra' },
      { id: 7, component: 'Cabin Air Filter', x: 81.2, y: 92.2, oem: 'CF-90066C', stock: 'In Stock', description: 'Filters dust, pollen, and allergens from cabin intake air.', brands: 'Zip Filters, Mahle Filter, Denso, Valeo' },
      { id: 8, component: 'A/C Manual Control Switch Panel', x: 85.6, y: 92.2, oem: 'SP-11088C', stock: 'In Stock', description: 'LCV dash console switch unit regulating climate temperature settings.', brands: 'Hanon, Doowon, Denso, Behr Hella Service' },
      { id: 9, component: 'A/C Hoses & Pipes', x: 11.8, y: 89.2, oem: 'HP-50033C', stock: 'In Stock', description: 'High and low pressure lines carrying refrigerant liquid and gas between components.', brands: 'Giladard, Subros, Denso, Estra' }
    ]
  }
];

export const getDiagram = async (id) => {
  const localFound = staticDiagrams.find(d => d.id === id);
  if (localFound) return localFound;

  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('diagrams')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) return data;
    }
  } catch (err) {
    console.error('Supabase diagram fetch error, falling back:', err);
  }
  // Local DB fallback
  const list = await getLocalData('diagrams');
  return list.find(d => d.id === id) || null;
};
