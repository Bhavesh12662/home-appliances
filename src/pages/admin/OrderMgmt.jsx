import React, { useState } from 'react';

function OrderMgmt({ orders = [], onUpdateOrderStatus }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusColors = {
    Pending: '#ffc107',
    Processing: '#17a2b8',
    Shipped: '#007bff',
    Delivered: '#28a745',
    Cancelled: '#dc3545'
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Order Management</h2>

      {/* Orders Summary Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Order ID</th>
            <th style={{ padding: '12px' }}>Customer</th>
            <th style={{ padding: '12px' }}>Total Amount</th>
            <th style={{ padding: '12px' }}>Date</th>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
                No orders placed yet.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}><strong>#{order.id}</strong></td>
                <td style={{ padding: '12px' }}>{order.customerName || 'Guest User'}</td>
                <td style={{ padding: '12px' }}>₹{order.totalAmount}</td>
                <td style={{ padding: '12px' }}>{order.date || new Date().toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateOrderStatus && onUpdateOrderStatus(order.id, e.target.value)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      backgroundColor: statusColors[order.status] || '#f8f9fa',
                      color: order.status === 'Pending' ? '#000' : '#fff',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Pending" style={{ background: '#fff', color: '#000' }}>Pending</option>
                    <option value="Processing" style={{ background: '#fff', color: '#000' }}>Processing</option>
                    <option value="Shipped" style={{ background: '#fff', color: '#000' }}>Shipped</option>
                    <option value="Delivered" style={{ background: '#fff', color: '#000' }}>Delivered</option>
                    <option value="Cancelled" style={{ background: '#fff', color: '#000' }}>Cancelled</option>
                  </select>
                </td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#007bff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '600px', width: '100%' }}>
            <h3>Order Details - #{selectedOrder.id}</h3>
            <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
            <p><strong>Shipping Address:</strong> {selectedOrder.address || 'N/A'}</p>
            
            <h4>Items Ordered:</h4>
            <ul>
              {selectedOrder.items?.map((item, idx) => (
                <li key={idx}>
                  {item.title} x {item.quantity} - ₹{item.price * item.quantity}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                marginTop: '16px', padding: '8px 16px', backgroundColor: '#6c757d',
                color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderMgmt;