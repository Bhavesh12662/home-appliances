import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f10303', color: '#fff' }}>
      <div>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
          Home Appliances Store
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '15px',}}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Products</Link>
        <Link to="/cart" style={{ color: '#fff', textDecoration: 'none' }}>Cart</Link>
        
        {user ? (
          <>
            <Link to="/my-orders" style={{ color: '#fff', textDecoration: 'none' }}>My Orders</Link>
            <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link>
            <button onClick={handleLogoutClick} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;