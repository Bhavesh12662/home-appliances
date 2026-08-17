import React from 'react';

function MyOrders({ orders }) {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2>My Orders</h2>
      {!orders || orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.orderId} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', pb: '10px' }}>
              <span><strong>Order ID:</strong> {order.orderId}</span>
              <span><strong>Date:</strong> {order.date}</span>
            </div>
            <p style={{ marginTop: '10px' }}><strong>Items:</strong></p>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>{item.title} - Qty: {item.quantity} (₹{item.price} each)</li>
              ))}
            </ul>
            <p><strong>Total Amount:</strong> ₹{order.total}</p>
            <p><strong>Delivery Address:</strong> {order.shipping.address}, {order.shipping.city} - {order.shipping.pincode}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;