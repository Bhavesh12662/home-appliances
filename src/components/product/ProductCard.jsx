import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img 
          src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={product.name} 
          className="product-image"
        />
      </div>

      <div className="product-info">
        <span className="product-brand">{product.brand?.name || 'Generic'}</span>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-category">{product.category?.name}</p>
        
        <div className="product-price-row">
          <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
          <span className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <Link to={`/product/${product._id}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;