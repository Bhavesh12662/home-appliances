import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const OrderMgmt = () => {
  const { token } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/orders', authHeader);
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch store orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        authHeader
      );
      // Update status locally in state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="loader-container">Loading orders...</div>;

  return (
    <div className="admin-page-container">
      <h2>Order Management</h2>
      {error && <p className="error-banner">{error}</p>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td><strong>#{order._id.substring(order._id.length - 6)}</strong></td>
                <td>
                  <div>{order.user?.name || 'Guest'}</div>
                  <small style={{ color: '#6b7280' }}>{order.shippingAddress?.phone}</small>
                </td>
                <td>
                  {order.orderItems?.map((i, idx) => (
                    <div key={idx} style={{ fontSize: '0.85rem' }}>
                      {i.name} (×{i.quantity})
                    </div>
                  ))}
                </td>
                <td><strong>₹{order.totalAmount?.toLocaleString('en-IN')}</strong></td>
                <td>{order.paymentMethod}</td>
                <td>
                  <span className={`status-badge status-${(order.status || 'pending').toLowerCase()}`}>
                    {order.status || 'Pending'}
                  </span>
                </td>
                <td>
                  <select
                    value={order.status}
                    disabled={updatingId === order._id}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="filter-select"
                    style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No orders placed yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderMgmt;