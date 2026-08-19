import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ProductMgmt = () => {
  const { token } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    stock: '',
    image: '',
    description: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchAllData = async () => {
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/categories'),
        axios.get('http://localhost:5000/api/brands')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setBrands(brandRes.data);
    } catch (err) {
      setServerError('Failed to fetch catalog data.');
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle local image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, image: '' })); // Prioritize direct upload
    }
  };

  const validate = () => {
    const err = {};
    if (!formData.name.trim()) err.name = 'Product name is required';
    if (!formData.category) err.category = 'Select a category';
    if (!formData.brand) err.brand = 'Select a brand';
    if (!formData.price || Number(formData.price) <= 0) err.price = 'Enter valid price';
    if (formData.stock === '' || Number(formData.stock) < 0) err.stock = 'Invalid stock count';
    if (!formData.description.trim()) err.description = 'Description is required';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = formData.image;

      // Upload image to backend if a new file was chosen
      if (imageFile) {
        setUploadingImage(true);
        const data = new FormData();
        data.append('image', imageFile);

        const uploadRes = await axios.post(
          'http://localhost:5000/api/products/upload',
          data,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        );
        finalImageUrl = uploadRes.data.imageUrl;
      }

      const payload = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: finalImageUrl || 'https://via.placeholder.com/300x200?text=Appliance',
        description: formData.description
      };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, payload, authHeader);
      } else {
        await axios.post('http://localhost:5000/api/products', payload, authHeader);
      }

      handleCloseModal();
      fetchAllData();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      category: product.category?._id || product.category || '',
      brand: product.brand?._id || product.brand || '',
      price: product.price,
      stock: product.stock,
      image: product.image || '',
      description: product.description || ''
    });
    setImagePreview(product.image || '');
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, authHeader);
      fetchAllData();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const handleCloseModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: '',
      brand: '',
      price: '',
      stock: '',
      image: '',
      description: ''
    });
    setImageFile(null);
    setImagePreview('');
    setErrors({});
    setShowModal(false);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header-row">
        <h2>Product Management</h2>
        <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setShowModal(true)}>
          + Add New Appliance
        </button>
      </div>

      {serverError && <p className="error-banner">{serverError}</p>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    src={item.image || 'https://via.placeholder.com/50'}
                    alt={item.name}
                    style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px', background: '#f8fafc' }}
                  />
                </td>
                <td><strong>{item.name}</strong></td>
                <td>{item.category?.name || 'N/A'}</td>
                <td>{item.brand?.name || 'N/A'}</td>
                <td>₹{item.price?.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`product-stock ${item.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                    {item.stock}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(item)} className="btn-action edit-btn">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="btn-action delete-btn">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? 'Edit Appliance' : 'Add New Appliance'}</h3>
              <button className="close-modal-btn" onClick={handleCloseModal}>&times;</button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>Appliance Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. 5 Star Inverter AC"
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="filter-select">
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.category && <span className="field-error">{errors.category}</span>}
                </div>

                <div className="form-group">
                  <label>Brand *</label>
                  <select name="brand" value={formData.brand} onChange={handleChange} className="filter-select">
                    <option value="">Select Brand</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                  {errors.brand && <span className="field-error">{errors.brand}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="34999"
                  />
                  {errors.price && <span className="field-error">{errors.price}</span>}
                </div>

                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="10"
                  />
                  {errors.stock && <span className="field-error">{errors.stock}</span>}
                </div>
              </div>

              {/* Upload from Device (All Formats) */}
              <div className="form-group">
                <label>Upload Appliance Image (JPEG, PNG, WEBP, GIF, SVG, AVIF)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ border: '1px dashed #94a3b8', padding: '10px' }}
                />
              </div>

              {/* Or Provide Image URL */}
              <div className="form-group">
                <label>Or Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={(e) => {
                    handleChange(e);
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://example.com/appliance.png"
                />
              </div>

              {/* Live Preview */}
              {imagePreview && (
                <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Image Preview:</span>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Description & Technical Specifications *</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Appliance specifications..."
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontFamily: 'inherit' }}
                />
                {errors.description && <span className="field-error">{errors.description}</span>}
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={loading || uploadingImage} className="btn-primary" style={{ width: 'auto' }}>
                  {uploadingImage ? 'Uploading Image...' : loading ? 'Saving...' : editingId ? 'Update Appliance' : 'Add Appliance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMgmt;