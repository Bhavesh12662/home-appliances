import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function Cart({ cart, onUpdateQuantity, onRemoveItem,user }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      alert('You must be logged in to place an order.');
      navigate('/login');
    }
  }, [user, navigate])

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty. <button onClick={() => navigate('/')}>Shop Now</button></p>
      ) : (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Product</th>
                <th style={{ padding: '8px' }}>Price</th>
                <th style={{ padding: '8px' }}>Quantity</th>
                <th style={{ padding: '8px' }}>Total</th>
                <th style={{ padding: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{item.title}</td>
                  <td style={{ padding: '8px' }}>₹{item.price}</td>
                  <td style={{ padding: '8px' }}>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                  </td>
                  <td style={{ padding: '8px' }}>₹{item.price * item.quantity}</td>
                  <td style={{ padding: '8px' }}>
                    <button onClick={() => onRemoveItem(item.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'right' }}>
            <h3>Total Amount: ₹{calculateTotal()}</h3>
            <button 
              onClick={() => navigate('/checkout')} 
              style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Proceed to Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;