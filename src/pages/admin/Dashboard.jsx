import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const { token } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalCategories: 0,
    totalRevenue: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.get('http://localhost:5000/api/admin/stats', config);
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [token]);

  if (loading) return <div className="loader-container">Loading Dashboard Metrics...</div>;
  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h2>Admin Overview</h2>
        <span className="admin-badge">Administrator Panel</span>
      </div>

      {/* Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Revenue</h4>
          <p className="stat-value">₹{stats.totalRevenue?.toLocaleString('en-IN')}</p>
        </div>

        <div className="stat-card">
          <h4>Total Orders</h4>
          <p className="stat-value">{stats.totalOrders}</p>
        </div>

        <div className="stat-card">
          <h4>Total Appliances</h4>
          <p className="stat-value">{stats.totalProducts}</p>
        </div>

        <div className="stat-card">
          <h4>Registered Customers</h4>
          <p className="stat-value">{stats.totalCustomers}</p>
        </div>
      </div>

      {/* Module Shortcuts */}
      <h3 className="section-title">Quick Management Links</h3>
      <div className="admin-menu-grid">
        <Link to="/admin/categories" className="admin-menu-card">
          <h4>Categories</h4>
          <p>Organize appliances into Kitchen, Cooling, Laundry, etc.</p>
        </Link>

        <Link to="/admin/brands" className="admin-menu-card">
          <h4>Brands</h4>
          <p>Manage appliance manufacturers (LG, Samsung, Whirlpool, etc.)</p>
        </Link>

        <Link to="/admin/products" className="admin-menu-card">
          <h4>Products</h4>
          <p>Create, update stock, pricing, and delete catalog items.</p>
        </Link>

        <Link to="/admin/orders" className="admin-menu-card">
          <h4>Orders</h4>
          <p>Track order lifecycle and update delivery statuses.</p>
        </Link>

        <Link to="/admin/customers" className="admin-menu-card">
          <h4>Customers</h4>
          <p>Review customer directory and accounts.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;