import React from 'react';

const ProductFilter = ({ 
  categories, 
  brands, 
  selectedCategory, 
  setSelectedCategory, 
  selectedBrand, 
  setSelectedBrand, 
  priceRange, 
  setPriceRange,
  maxPriceLimit,
  onResetFilters 
}) => {
  return (
    <aside className="filter-sidebar">
      <h3>Filter Products</h3>

      {/* Category Filter */}
      <div className="filter-group">
        <label className="filter-label">Category</label>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div className="filter-group">
        <label className="filter-label">Brand</label>
        <select 
          value={selectedBrand} 
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="filter-select"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Slider */}
      <div className="filter-group">
        <label className="filter-label">
          Max Price: <strong>₹{Number(priceRange).toLocaleString('en-IN')}</strong>
        </label>
        <input 
          type="range" 
          min="1000" 
          max={maxPriceLimit || 100000} 
          step="500" 
          value={priceRange} 
          onChange={(e) => setPriceRange(e.target.value)}
          className="price-slider"
        />
        <div className="price-labels">
          <span>₹1,000</span>
          <span>₹{(maxPriceLimit || 100000).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Reset Filter Button */}
      <button type="button" onClick={onResetFilters} className="reset-filter-btn">
        Reset Filters
      </button>
    </aside>
  );
};

export default ProductFilter;