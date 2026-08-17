import React, { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


function ProductDetails({ products, onAddToCart,user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      alert('You must be logged in to place an order.');
      navigate('/login');
    }
  }, [user, navigate])

  const [activeTab, setActiveTab] = useState('description');
  const [pincode, setPincode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="product-details-container" style={{ textAlign: 'center' }}>
        <h3>Product not found</h3>
        <button onClick={() => navigate('/')}>Back to Products</button>
      </div>
    );
  }

  // Calculate dummy original price and discount percentage
  const originalPrice = Math.round(product.price * 1.2);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  const handleBuyNow = () => {
    onAddToCart(product);
    navigate('/checkout');
  };

  const handleCheckDelivery = () => {
    if (/^\d{6}$/.test(pincode)) {
      setDeliveryMessage(`Standard Delivery available to ${pincode} within 3-5 business days.`);
    } else {
      setDeliveryMessage('Please enter a valid 6-digit Pincode.');
    }
  };

  return (
    <div className="product-details-container">
      {/* Top Section: Image & Main Info */}
      <div className="product-top-section">
        <div className="product-image-container">
          <img
            src={product.image || 'https://via.placeholder.com/300'}
            alt={product.title}
            className="product-detail-image"
          />
        </div>

        <div className="product-info-container">
          <h1 className="product-title-text">{product.title}</h1>
          <p className="product-brand-category">
            Brand: <strong>{product.brand}</strong> | Category: <strong>{product.category}</strong>
          </p>

          <div className="price-section">
            <span className="current-price">₹{product.price}</span>
            <span className="mrp-price">₹{originalPrice}</span>
            <span className="discount-badge">{discountPercent}% OFF</span>
          </div>

          <div className="offers-box">
            <h4>Available Offers:</h4>
            <ul>
              <li>Bank Offer: 10% Instant Discount on select Credit Cards.</li>
              <li>No Cost EMI: Available on orders above ₹5,000.</li>
              <li>Brand Warranty: 1 Year Manufacturer Warranty on Product.</li>
            </ul>
          </div>

          <div className="action-buttons">
            <button className="btn-add-cart" onClick={() => onAddToCart(product)}>
              Add to Cart
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>
              Delivery Options:
            </label>
            <div className="pincode-check-box">
              <input
                type="text"
                className="pincode-input"
                placeholder="Enter 6-digit Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button className="btn-check-pin" onClick={handleCheckDelivery}>
                Check
              </button>
            </div>
            {deliveryMessage && <p style={{ fontSize: '0.85rem', color: '#333' }}>{deliveryMessage}</p>}
          </div>
        </div>
      </div>

      {/* Bottom Section: Tabs for Detailed Info */}
      <div className="product-tabs-header">
        <button
          className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        <button
          className={`tab-button ${activeTab === 'specifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('specifications')}
        >
          Specifications
        </button>
        <button
          className={`tab-button ${activeTab === 'terms' ? 'active' : ''}`}
          onClick={() => setActiveTab('terms')}
        >
          Terms & Conditions
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'description' && (
          <div>
            <p>
              Upgrade your home with the high-performance <strong>{product.title}</strong> by {product.brand}. Designed for maximum efficiency, durability, and modern aesthetics, this appliance seamlessly integrates into your modern lifestyle.
            </p>
            <ul>
              <li>Energy-efficient operation certified with high rating standards.</li>
              <li>Durable outer build designed for longevity and easy maintenance.</li>
              <li>Includes safety locks and smart overload protection features.</li>
            </ul>
          </div>
        )}

        {activeTab === 'specifications' && (
          <table className="specs-table">
            <tbody>
              <tr>
                <td>Model Name</td>
                <td>{product.title}</td>
              </tr>
              <tr>
                <td>Brand</td>
                <td>{product.brand}</td>
              </tr>
              <tr>
                <td>Category</td>
                <td>{product.category}</td>
              </tr>
              <tr>
                <td>Power Source</td>
                <td>Electric (220-240V)</td>
              </tr>
              <tr>
                <td>Warranty Summary</td>
                <td>1 Year Comprehensive + Additional Compressor/Motor Warranty</td>
              </tr>
            </tbody>
          </table>
        )}

        {activeTab === 'terms' && (
          <ul className="terms-list">
            <li><strong>Return Policy:</strong> 7-day replacement guarantee in case of manufacturing defects or damage during transit.</li>
            <li><strong>Installation:</strong> Free installation provided by brand technicians within 48 hours of delivery (where applicable).</li>
            <li><strong>Warranty Terms:</strong> Warranty covers defects in materials and workmanship under normal household use. Physical damage is not covered.</li>
            <li><strong>Cancellation:</strong> Orders can be canceled before shipment dispatch for a 100% refund.</li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;