import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  // Total quantity count across all cart items
  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="client-navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-logo-icon">⚡</span>
          <span className="brand-text">Home<span className="brand-highlight">Deal</span></span>
        </Link>

        {/* Navigation Links */}
        <nav className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>

          {/* Cart Icon & Live Count */}
          <Link to="/cart" className="nav-link cart-link">
            <span>🛒 Cart</span>
            {totalCartCount > 0 && (
              <span className="navbar-badge">{totalCartCount}</span>
            )}
          </Link>

          {/* Auth Conditional Links */}
          {user ? (
            <div className="user-section">
              <Link to="/my-orders" className="nav-link">My Orders</Link>
              <Link to="/profile" className="nav-link user-profile-btn">
                👤 {user.name ? user.name.split(' ')[0] : 'Profile'}
              </Link>
              <button onClick={handleLogout} className="navbar-logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="guest-section">
              <Link to="/login" className="nav-link login-btn">Login</Link>
              <Link to="/register" className="nav-register-btn">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;