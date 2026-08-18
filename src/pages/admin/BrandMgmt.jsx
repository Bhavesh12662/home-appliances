import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const BrandMgmt = () => {
  const { token } = useContext(AuthContext);

  const [brands, setBrands] = useState([]);
  const [brandName, setBrandName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/brands');
      setBrands(res.data);
    } catch (err) {
      setError('Failed to fetch brands.');
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!brandName.trim()) {
      setError('Brand name is required.');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/brands/${editingId}`, { name: brandName }, config);
      } else {
        await axios.post('http://localhost:5000/api/brands', { name: brandName }, config);
      }

      setBrandName('');
      setEditingId(null);
      fetchBrands();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (brand) => {
    setEditingId(brand._id);
    setBrandName(brand.name);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/brands/${id}`, config);
      fetchBrands();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete brand.');
    }
  };

  return (
    <div className="admin-page-container">
      <h2>Brand Management</h2>
      {error && <p className="error-banner">{error}</p>}

      <form onSubmit={handleSubmit} className="admin-form-inline">
        <input
          type="text"
          placeholder="Enter Brand Name (e.g. Samsung, LG, Whirlpool)"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {editingId ? 'Update Brand' : 'Add Brand'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setBrandName(''); }} className="btn-secondary">
            Cancel
          </button>
        )}
      </form>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Brand Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand, index) => (
              <tr key={brand._id}>
                <td>{index + 1}</td>
                <td><strong>{brand.name}</strong></td>
                <td>
                  <button onClick={() => handleEdit(brand)} className="btn-action edit-btn">Edit</button>
                  <button onClick={() => handleDelete(brand._id)} className="btn-action delete-btn">Delete</button>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>No brands registered yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrandMgmt;