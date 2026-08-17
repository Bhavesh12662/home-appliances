import React, { useState } from 'react';
import './Admin.css';

function BrandMgmt({ brands, onAddBrand, onDeleteBrand }) {
  const [newBrand, setNewBrand] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newBrand.trim()) {
      setError('Brand name cannot be empty');
      return;
    }
    onAddBrand(newBrand.trim());
    setNewBrand('');
    setError('');
  };

  return (
    <div className="admin-module-container">
      <div className="module-header">
        <h2>Brand Management</h2>
      </div>

      <div className="add-form-card">
        <h3>Add New Brand</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="form-control"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            placeholder="e.g. Whirlpool"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-admin-submit" style={{ width: 'auto' }}>
            Add Brand
          </button>
        </form>
        {error && <span className="error-text">{error}</span>}
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{brand}</td>
              <td>
                <button className="btn-delete" onClick={() => onDeleteBrand(brand)}>
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

export default BrandMgmt;