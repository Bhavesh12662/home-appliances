import React, { useState } from 'react';
import './Admin.css';

function CategoryMgmt({ categories, onAddCategory, onDeleteCategory }) {
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    onAddCategory(newCategory.trim());
    setNewCategory('');
    setError('');
  };

  return (
    <div className="admin-module-container">
      <div className="module-header">
        <h2>Category Management</h2>
      </div>

      <div className="add-form-card">
        <h3>Add New Category</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="form-control"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g. Microwave Oven"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-admin-submit" style={{ width: 'auto' }}>
            Add Category
          </button>
        </form>
        {error && <span className="error-text">{error}</span>}
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{cat}</td>
              <td>
                <button className="btn-delete" onClick={() => onDeleteCategory(cat)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryMgmt;