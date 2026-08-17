import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


function AdminNavbar({ admin, onAdminLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onAdminLogout();
    navigate('/admin/login');
  };

  if (!admin) return null;

  return (
    <nav className="admin-navbar">
      <Link to="/admin/dashboard" className="admin-nav-title">
        Admin Portal | Home Appliances
      </Link>
      <div className="admin-nav-links">
        <Link to="/admin/dashboard" className="admin-nav-item">Dashboard</Link>
        <Link to="/admin/categories" className="admin-nav-item">Categories</Link>
        <Link to="/admin/brands" className="admin-nav-item">Brands</Link>
        <Link to="/admin/products" className="admin-nav-item">Products</Link>
        <Link to="/admin/orders" className="admin-nav-item">Orders</Link>
        <Link to="/admin/customers" className="admin-nav-item">Customers</Link>
        <button className="btn-logout-admin" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default AdminNavbar;