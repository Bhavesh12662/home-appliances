import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotalPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <h2>Your Shopping Cart is Empty</h2>
        <p>Looks like you haven't added any home appliances to your cart yet.</p>
        <Link to="/" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <h2>Shopping Cart ({cartItems.length} items)</h2>

      <div className="cart-layout">
        {/* Item List */}
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item-row">
              <img 
                src={item.image || 'https://via.placeholder.com/100'} 
                alt={item.name} 
                className="cart-item-image"
              />

              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p className="cart-item-brand">{item.brand?.name}</p>
                <p className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</p>
              </div>

              <div className="cart-item-quantity-controls">
                <button 
                  onClick={() => updateQuantity(item._id, item.quantity - 1, item.stock)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item._id, item.quantity + 1, item.stock)}
                  disabled={item.quantity >= item.stock}
                >
                  +
                </button>
              </div>

              <div className="cart-item-subtotal">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </div>

              <button 
                className="remove-btn" 
                onClick={() => removeFromCart(item._id)}
                title="Remove item"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Box */}
        <aside className="order-summary-box">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{cartTotalPrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Charges:</span>
            <span>Free</span>
          </div>
          <hr />
          <div className="summary-row total-price-row">
            <strong>Total Amount:</strong>
            <strong>₹{cartTotalPrice.toLocaleString('en-IN')}</strong>
          </div>

          <button className="checkout-btn" onClick={handleProceedToCheckout}>
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;