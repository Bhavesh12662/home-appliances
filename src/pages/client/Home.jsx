import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProductCard from '../../components/product/ProductCard';
import ProductFilter from '../../components/product/ProductFilter';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState(100000);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch initial catalog data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/brands')
        ]);

        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);

        // Dynamically compute the maximum price in the catalog
        if (productsRes.data.length > 0) {
          const highestPrice = Math.max(...productsRes.data.map((p) => p.price));
          setPriceRange(highestPrice);
        }
      } catch (err) {
        setError('Failed to load products. Please check if server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter & Search computation (Memoized for performance)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search Query Filter (Matches product name or description)
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // 2. Category Filter
      const matchesCategory = selectedCategory ? product.category?._id === selectedCategory : true;

      // 3. Brand Filter
      const matchesBrand = selectedBrand ? product.brand?._id === selectedBrand : true;

      // 4. Price Filter
      const matchesPrice = Number(product.price) <= Number(priceRange);

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });
  }, [products, searchTerm, selectedCategory, selectedBrand, priceRange]);

  // Reset filters handler
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    if (products.length > 0) {
      const highestPrice = Math.max(...products.map((p) => p.price));
      setPriceRange(highestPrice);
    }
  };

  return (
    <div className="home-container">
      {/* Search Header */}
      <section className="search-section">
        <input 
          type="text" 
          placeholder="Search home appliances (e.g. Refrigerator, Microwave, AC)..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </section>

      {/* Main Content Layout */}
      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <ProductFilter 
          categories={categories}
          brands={brands}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          maxPriceLimit={products.length > 0 ? Math.max(...products.map((p) => p.price)) : 100000}
          onResetFilters={handleResetFilters}
        />

        {/* Product Grid Area */}
        <main className="product-grid-area">
          {loading && <p className="status-text">Loading appliances...</p>}
          {error && <p className="error-banner">{error}</p>}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="no-results">
              <p>No appliances found matching your criteria.</p>
              <button onClick={handleResetFilters}>Clear Filters</button>
            </div>
          )}

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;