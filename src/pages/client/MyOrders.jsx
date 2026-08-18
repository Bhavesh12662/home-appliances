import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const MyOrders = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successBanner, setSuccessBanner] = useState(location.state?.successMessage || '');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get('http://localhost:5000/api/orders/myorders', config);
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) return <div className="loader-container">Loading your orders...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="orders-page-container">
      <h2>My Orders</h2>

      {successBanner && (
        <div className="success-banner">
          {successBanner}
          <button onClick={() => setSuccessBanner('')} className="close-banner-btn">&times;</button>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="no-orders-box">
          <p>You have not placed any orders yet.</p>
          <Link to="/" className="btn-primary">Browse Appliances</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              {/* Order Header */}
              <div className="order-card-header">
                <div>
                  <span className="order-id">Order ID: #{order._id}</span>
                  <span className="order-date">Placed on: {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={`status-badge status-${(order.status || 'Pending').toLowerCase()}`}>
                  {order.status || 'Pending'}
                </div>
              </div>

              {/* Items List */}
              <div className="order-items-grid">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="order-product-row">
                    <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} />
                    <div className="order-product-info">
                      <p className="order-product-name">{item.name}</p>
                      <p className="order-product-qty">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="order-card-footer">
                <div>
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </div>
                <div className="order-total-price">
                  Total: <strong>₹{order.totalAmount?.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;