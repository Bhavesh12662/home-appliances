import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function Dashboard({ admin, categories, brands, products, orders, customers }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
    }
  }, [admin, navigate]);

  if (!admin) return null;

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <p>Overview of system statistics and management modules.</p>

      <div className="dashboard-grid">
        <div className="stat-card">
          <p>Total Categories</p>
          <h3>{categories.length}</h3>
        </div>
        <div className="stat-card">
          <p>Total Brands</p>
          <h3>{brands.length}</h3>
        </div>
        <div className="stat-card">
          <p>Total Products</p>
          <h3>{products.length}</h3>
        </div>
        <div className="stat-card">
          <p>Total Orders</p>
          <h3>{orders.length}</h3>
        </div>
        <div className="stat-card">
          <p>Total Customers</p>
          <h3>{customers.length}</h3>
        </div>
        <div className="stat-card">
          <p>Total Revenue</p>
          <h3 style={{ color: '#28a745' }}>₹{totalRevenue}</h3>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;