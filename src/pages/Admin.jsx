import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Package } from 'lucide-react';
import { getProducts, addProduct, updateProduct, deleteProduct, categories, brands } from '../data/products';
import { useToast } from '../context/ToastContext';
import './Admin.css';

const emptyForm = {
  name: '',
  category: 'Car',
  brand: 'Denso',
  price: '',
  image: '',
  description: '',
  inStock: true,
};

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { addToast } = useToast();

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const refreshProducts = () => setProducts(getProducts());

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      addToast('Please fill in required fields', 'error');
      return;
    }

    if (editing) {
      updateProduct(editing, { ...form, price: Number(form.price) });
      addToast('Product updated successfully!');
    } else {
      addProduct({ ...form, price: Number(form.price) });
      addToast('Product added successfully!');
    }

    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    refreshProducts();
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      image: product.image,
      description: product.description,
      inStock: product.inStock,
    });
    setEditing(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      addToast('Product deleted');
      refreshProducts();
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>
              <Package size={28} /> Admin Panel
            </h1>
            <p>Manage your AC spare parts inventory</p>
          </div>
          {!showForm && (
            <button className="add-product-btn" onClick={() => setShowForm(true)} id="add-product-btn">
              <Plus size={18} /> Add Product
            </button>
          )}
        </div>

        {/* FORM */}
        {showForm && (
          <form className="admin-form" onSubmit={handleSubmit} id="product-form">
            <div className="form-header">
              <h2>{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button type="button" className="form-close" onClick={handleCancel}>
                <X size={20} />
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group full">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. AC Compressor – Universal"
                  required
                  id="form-name"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange} id="form-category">
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Brand *</label>
                <select name="brand" value={form.brand} onChange={handleChange} id="form-brand">
                  {brands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 8500"
                  required
                  id="form-price"
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  id="form-image"
                />
              </div>

              <div className="form-group full">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe the product..."
                  id="form-description"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={form.inStock}
                    onChange={handleChange}
                  />
                  In Stock
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn-save" id="form-submit">
                <Save size={16} />
                {editing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        )}

        {/* TABLE */}
        <div className="admin-table-wrap" id="admin-table">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="table-product">
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80';
                        }}
                      />
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td><span className={`table-badge ${product.category.toLowerCase()}`}>{product.category}</span></td>
                  <td>{product.brand}</td>
                  <td className="table-price">₹{product.price.toLocaleString()}</td>
                  <td>
                    <span className={`stock-badge ${product.inStock ? 'in' : 'out'}`}>
                      {product.inStock ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="action-edit" onClick={() => handleEdit(product)} title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button className="action-delete" onClick={() => handleDelete(product.id)} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
