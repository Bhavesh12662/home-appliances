import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function Checkout({ cart, user, onPlaceOrder }) {
  const navigate = useNavigate();

  // Redirect guest users to login before letting them view or place an order
  useEffect(() => {
    if (!user) {
      alert('You must be logged in to place an order.');
      navigate('/login');
    }
  }, [user, navigate]);

  const [shippingData, setShippingData] = useState({
    streetAddress: user ? user.streetAddress || '' : '',
    city: user ? user.city || '' : '',
    state: user ? user.state || '' : '',
    pincode: user ? user.pincode || '' : '',
    paymentMethod: 'COD'
  });

  const [errors, setErrors] = useState({});

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!shippingData.streetAddress.trim()) formErrors.streetAddress = 'Street Address is required';
    if (!shippingData.city.trim()) formErrors.city = 'City is required';
    if (!shippingData.state.trim()) formErrors.state = 'State is required';
    if (!/^\d{6}$/.test(shippingData.pincode)) formErrors.pincode = 'Pincode must be exactly 6 digits';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Secondary check: verify user is logged in
    if (!user) {
      alert('Please log in first to complete your order.');
      navigate('/login');
      return;
    }

    if (validateForm()) {
      const orderData = {
        orderId: 'ORD' + Date.now(),
        customerName: user.name,
        customerEmail: user.email,
        items: cart,
        total: totalAmount,
        shipping: shippingData,
        date: new Date().toLocaleDateString()
      };

      onPlaceOrder(orderData);
      alert('Order Placed Successfully!');
      navigate('/my-orders');
    }
  };

  if (!user) {
    return null; // Prevents flashing content while redirecting
  }

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Place Order</h2>
      
      <div className="user-badge">
        Ordering as: <strong>{user.name} ({user.email})</strong>
      </div>

      <div className="checkout-summary">
        <span><strong>Total Items:</strong> {cart.length}</span> | <span><strong>Total Amount:</strong> ₹{totalAmount}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Street Address:</label>
          <textarea
            name="streetAddress"
            className="form-control"
            rows="3"
            value={shippingData.streetAddress}
            onChange={handleChange}
            placeholder="House/Flat No., Building Name, Street"
          />
          {errors.streetAddress && <span className="error-text">{errors.streetAddress}</span>}
        </div>

        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            name="city"
            className="form-control"
            value={shippingData.city}
            onChange={handleChange}
          />
          {errors.city && <span className="error-text">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label>State:</label>
          <input
            type="text"
            name="state"
            className="form-control"
            value={shippingData.state}
            onChange={handleChange}
          />
          {errors.state && <span className="error-text">{errors.state}</span>}
        </div>

        <div className="form-group">
          <label>Pincode:</label>
          <input
            type="text"
            name="pincode"
            className="form-control"
            value={shippingData.pincode}
            onChange={handleChange}
          />
          {errors.pincode && <span className="error-text">{errors.pincode}</span>}
        </div>

        <div className="form-group">
          <label>Payment Method:</label>
          <select
            name="paymentMethod"
            className="form-control"
            value={shippingData.paymentMethod}
            onChange={handleChange}
          >
            <option value="COD">Cash on Delivery (COD)</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <button type="submit" className="btn-submit">
          Confirm & Place Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;