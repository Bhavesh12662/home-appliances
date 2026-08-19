import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Admin.css';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-container">
      {/* 1. Left Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">⚡</span>
          <div>
            <h3>HomeDeal</h3>
            <span className="admin-badge">Admin Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            📦 Products
          </NavLink>
          <NavLink to="/admin/categories" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            📑 Categories
          </NavLink>
          <NavLink to="/admin/brands" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            🏷️ Brands
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            🛒 Orders
          </NavLink>
          <NavLink to="/admin/customers" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            👥 Customers
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* 2. Main Admin Workspace Area */}
      <main className="admin-main">
        <header className="admin-topbar">
          <h4>Management Console</h4>
          <div className="admin-user-info">
            <span>Signed in as: <strong>{user?.name || 'Administrator'}</strong></span>
          </div>
        </header>

        <section className="admin-content-area">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;