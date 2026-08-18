import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotalPrice, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);

  // Address and payment state
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validation rules for delivery address
  const validate = () => {
    const newErrors = {};
    const pinRegex = /^[0-9]{6}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!shippingAddress.street.trim()) newErrors.street = 'Street address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
    
    if (!shippingAddress.postalCode.trim()) {
      newErrors.postalCode = 'PIN Code is required';
    } else if (!pinRegex.test(shippingAddress.postalCode)) {
      newErrors.postalCode = 'Enter a valid 6-digit PIN code';
    }

    if (!shippingAddress.phone.trim()) {
      newErrors.phone = 'Contact number is required';
    } else if (!phoneRegex.test(shippingAddress.phone)) {
      newErrors.phone = 'Enter a valid 10-digit mobile number';
    }

    return newErrors;
  };

  // Submit Order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setServerError('');

    if (cartItems.length === 0) {
      setServerError('Your cart is empty.');
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingAddress,
        paymentMethod,
        totalAmount: cartTotalPrice
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderData, config);

      // Order created successfully: empty cart and redirect to order history
      clearCart();
      navigate('/my-orders', { state: { successMessage: 'Order placed successfully!' } });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Complete Your Order</h2>
      {serverError && <p className="error-banner">{serverError}</p>}

      <div className="checkout-layout">
        {/* Shipping Form */}
        <form onSubmit={handlePlaceOrder} className="checkout-form" noValidate>
          <h3>1. Delivery Address</h3>

          <div className="form-group">
            <label>Street Address / House No.</label>
            <input
              type="text"
              name="street"
              value={shippingAddress.street}
              onChange={handleChange}
              placeholder="123 Main Street, Apartment 4B"
            />
            {errors.street && <span className="field-error">{errors.street}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleChange}
                placeholder="Surat"
              />
              {errors.city && <span className="field-error">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={shippingAddress.state}
                onChange={handleChange}
                placeholder="Gujarat"
              />
              {errors.state && <span className="field-error">{errors.state}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>PIN Code (6 digits)</label>
              <input
                type="text"
                name="postalCode"
                value={shippingAddress.postalCode}
                onChange={handleChange}
                placeholder="395007"
              />
              {errors.postalCode && <span className="field-error">{errors.postalCode}</span>}
            </div>

            <div className="form-group">
              <label>Contact Phone</label>
              <input
                type="tel"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
          </div>

          <h3>2. Payment Method</h3>
          <div className="payment-options">
            <label className="radio-label">
              <input
                type="radio"
                name="paymentMethod"
                value="Cash on Delivery"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery (COD)
            </label>

            <label className="radio-label">
              <input
                type="radio"
                name="paymentMethod"
                value="Online Payment (UPI/Card)"
                checked={paymentMethod === 'Online Payment (UPI/Card)'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Online Payment (UPI / Net Banking / Card)
            </label>
          </div>

          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? 'Processing Order...' : `Place Order (₹${cartTotalPrice.toLocaleString('en-IN')})`}
          </button>
        </form>

        {/* Order Review Sidebar */}
        <div className="checkout-summary">
          <h3>Order Items ({cartItems.length})</h3>
          <div className="checkout-items-list">
            {cartItems.map((item) => (
              <div key={item._id} className="checkout-item">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <hr />
          <div className="checkout-total">
            <span>Total Payable:</span>
            <strong>₹{cartTotalPrice.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;