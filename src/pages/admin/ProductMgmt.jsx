import React, { useState } from 'react';

function ProductMgmt({ products, categories, brands, onAddProduct, onDeleteProduct }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    brand: '',
    price: '',
   description: '',
    image: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price) {
      alert('Please fill out all required fields');
      return;
    }

    // Call the handler passed from App.js
    onAddProduct({
      ...formData,
      id: Date.now(),
      price: Number(formData.price)
    });

    // Reset Form
    setFormData({
      title: '',
      category: '',
      brand: '',
      price: '',
      description: '',
      image: ''
    });
  };

  return (
    <div>
      <h2>Product Management</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default ProductMgmt;