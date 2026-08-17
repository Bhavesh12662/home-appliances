import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product, onAddToCart }) {
  // Defensive validation: ensure product data exists before rendering
  if (!product || !product.title) {
    return <div className="error-card">Invalid Product Data</div>;
  }

  const { id, title, brand, category, price, image } = product;

  return (
    <div 
      className="product-card" 
      style={{ 
        border: '1px solid #ccc', 
        padding: '16px', 
        borderRadius: '8px', 
        display: 'flex', 
        flexDirection: 'column', 
        justify: 'space-between',
        backgroundColor: '#fff'
      }}
    >
      <div>
        <img 
          src={image || 'https://via.placeholder.com/150'} 
          alt={title} 
          width="100%" 
          height="150" 
          style={{ objectFit: 'contain', marginBottom: '10px' }} 
        />
        <h3 style={{ fontSize: '1.1rem', margin: '5px 0' }}>{title}</h3>
        <p style={{ margin: '3px 0', fontSize: '0.9rem', color: '#555' }}>
          <strong>Brand:</strong> {brand}
        </p>
        <p style={{ margin: '3px 0', fontSize: '0.9rem', color: '#555' }}>
          <strong>Category:</strong> {category}
        </p>
        <p style={{ margin: '8px 0', fontSize: '1.1rem', color: '#28a745', fontWeight: 'bold' }}>
          ₹{price}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
        {/* View Details Link Button */}
        <Link 
          to={`/product/${id}`} 
          style={{ 
            flex: 1, 
            textAlign: 'center', 
            padding: '8px', 
            backgroundColor: '#17a2b8', 
            color: '#fff', 
            textDecoration: 'none', 
            borderRadius: '4px',
            fontSize: '0.85rem'
          }}
        >
          View Details
        </Link>

        {/* Add to Cart Button */}
        <button 
          onClick={() => onAddToCart(product)}
          style={{ 
            flex: 1, 
            padding: '8px', 
            backgroundColor: '#007bff', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;