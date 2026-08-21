import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const CategoryMgmt = () => {
  const { token } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Failed to fetch categories.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!categoryName.trim()) {
      setError('Category name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        // Update existing category
        await axios.put(`http://localhost:5000/api/categories/${editingId}`, { name: categoryName }, config);
      } else {
        // Create new category
        await axios.post('http://localhost:5000/api/categories', { name: categoryName }, config);
      }

      setCategoryName('');
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setCategoryName(category.name);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`, config);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setCategoryName('');
  };

  return (
    <div className="admin-page-container">
      <h2>Category Management</h2>
      {error && <p className="error-banner">{error}</p>}

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="admin-form-inline">
        <input
          type="text"
          placeholder="Enter Category Name (e.g. Refrigerators)"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {editingId ? 'Update Category' : 'Add Category'}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </form>

      {/* Table of Categories */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat._id}>
                <td>{index + 1}</td>
                <td><strong>{cat.name}</strong></td>
                <td>
                  <button onClick={() => handleEdit(cat)} className="btn-action edit-btn">Edit</button>
                  <button onClick={() => handleDelete(cat._id)} className="btn-action delete-btn">Delete</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>No categories registered yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryMgmt;