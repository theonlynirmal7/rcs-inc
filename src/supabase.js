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
    const request = indexedDB.open('rcs_local_db', 3);
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
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } else {
      await initializeLocalDataIfEmpty();
      const localProds = await getLocalData('products');
      return localProds.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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

  async recordVisit(pagePath) {
    const visitRecord = {
      created_at: new Date().toISOString(),
      page_path: pagePath || '/'
    };
    
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('site_visits')
          .insert([visitRecord]);
        if (error) throw error;
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
      page_path: v.page_path || '/'
    }));

    return {
      totalVisits,
      visitsToday,
      chartData,
      recentVisits
    };
  }
};
