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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) return <div className="admin-loading">Loading Dashboard Metrics...</div>;

  return (
    <div className="dashboard-wrapper">
      <div className="page-header">
        <h2>Dashboard Overview</h2>
        <p>Real-time analytics and inventory status</p>
      </div>

      {/* Metric Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card revenue-card">
          <span className="stat-title">Total Revenue</span>
          <h3 className="stat-value">₹{stats.totalRevenue?.toLocaleString('en-IN')}</h3>
          <span className="stat-subtitle">From all confirmed orders</span>
        </div>

        <div className="stat-card">
          <span className="stat-title">Total Orders</span>
          <h3 className="stat-value">{stats.totalOrders}</h3>
          <span className="stat-subtitle">Customer purchases</span>
        </div>

        <div className="stat-card">
          <span className="stat-title">Appliances in Catalog</span>
          <h3 className="stat-value">{stats.totalProducts}</h3>
          <span className="stat-subtitle">Across all categories</span>
        </div>

        <div className="stat-card">
          <span className="stat-title">Registered Customers</span>
          <h3 className="stat-value">{stats.totalCustomers}</h3>
          <span className="stat-subtitle">Active accounts</span>
        </div>
      </div>

      {/* Quick Access Control Grid */}
      <div className="quick-links-section">
        <h3>Quick Operations</h3>
        <div className="quick-grid">
          <Link to="/admin/products" className="quick-card">
            <h4>📦 Product Management</h4>
            <p>Add new appliances, modify prices, update stock and descriptions.</p>
          </Link>

          <Link to="/admin/orders" className="quick-card">
            <h4>🛒 Order Lifecycle</h4>
            <p>Review customer shipping addresses and mark delivery statuses.</p>
          </Link>

          <Link to="/admin/categories" className="quick-card">
            <h4>📑 Categories</h4>
            <p>Create and edit appliance sections (Kitchen, Cooling, etc.).</p>
          </Link>

          <Link to="/admin/brands" className="quick-card">
            <h4>🏷️ Brands</h4>
            <p>Manage brand manufacturers (LG, Samsung, Whirlpool, IFB).</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;