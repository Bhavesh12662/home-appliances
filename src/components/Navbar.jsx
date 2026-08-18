import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Change these two lines:
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { totalItemsCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo">
          ⚡ HomeAppliances
        </Link>

        {/* Links */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>

          {/* Cart Icon & Badge */}
          <Link to="/cart" className="nav-link cart-link">
            Cart
            {totalItemsCount > 0 && <span className="cart-badge">{totalItemsCount}</span>}
          </Link>

          {/* Conditional Auth Links */}
          {user ? (
            <div className="nav-user-menu">
              <Link to="/my-orders" className="nav-link">My Orders</Link>
              <Link to="/profile" className="nav-link">Profile ({user.name?.split(' ')[0]})</Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-btn-register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;