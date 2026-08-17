import React, { useState } from 'react';
import ProductCard from '../../components/ProductCard.jsx';

// Sample mock data for Home Appliances
const initialProducts = [
  { id: 1, title: 'Double Door Refrigerator', category: 'Refrigerator', brand: 'Samsung', price: 35000, image: '' },
  { id: 2, title: 'Front Load Washing Machine', category: 'Washing Machine', brand: 'LG', price: 28000, image: '' },
  { id: 3, title: 'Solo Microwave Oven', category: 'Microwave', brand: 'Samsung', price: 8000, image: '' },
  { id: 4, title: 'Split AC 1.5 Ton', category: 'Air Conditioner', brand: 'Daikin', price: 42000, image: '' }
];

function Home({ onAddToCart }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState(50000);

  // Filter products dynamically based on search, category, brand, and price
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === '' || product.brand === selectedBrand;
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Products</h2>

      {/* Search and Filters Section */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <label>Search: </label>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <label>Category: </label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Refrigerator">Refrigerator</option>
            <option value="Washing Machine">Washing Machine</option>
            <option value="Microwave">Microwave</option>
            <option value="Air Conditioner">Air Conditioner</option>
          </select>
        </div>

        <div>
          <label>Brand: </label>
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
            <option value="">All Brands</option>
            <option value="Samsung">Samsung</option>
            <option value="LG">LG</option>
            <option value="Daikin">Daikin</option>
          </select>
        </div>

        <div>
          <label>Max Price: ₹{maxPrice}</label>
          <input
            type="range"
            min="5000"
            max="50000"
            step="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))
        ) : (
          <p>No products found matching your filter criteria.</p>
        )}
      </div>
    </div>
  );
}

export default Home;