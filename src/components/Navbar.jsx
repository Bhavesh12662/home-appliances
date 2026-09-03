import React, { useContext,useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => { setMenuOpen(false); }

  // Total quantity count across all cart items
  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="client-navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          
          <span className="brand-text">Home<span className="brand-highlight">Deal</span></span>
        </Link>

        {/* Hamburger Button */}
        <button className={`mobile-menu-btn ${menuOpen ? 'active' : ''}`} 
        onClick={() => setMenuOpen(!menuOpen)} 
        aria-label="Toggle navigation menu" aria-expanded={menuOpen} >
          <span></span> 
          <span></span> 
          <span></span>
        </button>

        {/* Navigation Links */}
        <nav className={`navbar-menu ${menuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>

          {/* Cart Icon & Live Count */}
          <Link to="/cart" className="nav-link cart-link" onClick={closeMenu}>
            <span>Cart</span>
            {totalCartCount > 0 && (
              <span className="navbar-badge">{totalCartCount}</span>
            )}
          </Link>

          {/* Auth Conditional Links */}
          {user ? (
            <div className="user-section">
              <Link to="/my-orders" className="nav-link" onClick={closeMenu}>My Orders</Link>
              <Link to="/profile" className="nav-link user-profile-btn" onClick={closeMenu}>
                 {user.name ? user.name.split(' ')[0] : 'Profile'}
              </Link>
              <button onClick={handleLogout} className="navbar-logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="guest-section">
              <Link to="/login" className="nav-link login-btn" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="nav-register-btn" onClick={closeMenu}>Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;