import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Product not found or unable to load details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (type) => {
    if (!product) return;
    if (type === 'inc' && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else if (type === 'dec' && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  if (loading) return <div className="loader-container">Loading appliance specifications...</div>;
  if (error || !product) return <div className="error-container"><p>{error}</p><Link to="/">Back to Home</Link></div>;

  return (
    <div className="product-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back to Catalog
      </button>

      <div className="product-details-grid">
        {/* Product Image */}
        <div className="details-image-box">
          <img 
            src={product.image || 'https://via.placeholder.com/500x400?text=Home+Appliance'} 
            alt={product.name} 
            className="details-image"
          />
        </div>

        {/* Product Meta & Actions */}
        <div className="details-info-box">
          <span className="brand-badge">{product.brand?.name}</span>
          <h1>{product.name}</h1>
          <p className="category-tag">Category: {product.category?.name}</p>
          
          <div className="price-tag">
            ₹{product.price?.toLocaleString('en-IN')}
          </div>

          <div className="stock-info">
            Status: {product.stock > 0 ? (
              <span className="in-stock-label">{product.stock} Units Available</span>
            ) : (
              <span className="out-of-stock-label">Currently Out of Stock</span>
            )}
          </div>

          <div className="product-description">
            <h3>Overview</h3>
            <p>{product.description || 'No detailed specifications provided for this model.'}</p>
          </div>

          {/* Add to Cart Actions */}
          {product.stock > 0 && (
            <div className="cart-action-panel">
              <div className="quantity-controller">
                <button onClick={() => handleQuantityChange('dec')} disabled={quantity <= 1}>-</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange('inc')} disabled={quantity >= product.stock}>+</button>
              </div>

              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          )}

          {addedMessage && <p className="success-banner">Item added to your cart!</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;