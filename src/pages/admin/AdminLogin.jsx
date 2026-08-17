import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function AdminLogin({ onAdminLogin }) {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = {};

    if (!credentials.username.trim()) {
      formErrors.username = 'Admin username is required';
    }

    if (!credentials.password) {
      formErrors.password = 'Password is required';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Hardcoded Admin Authentication Check
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const adminUser = { username: 'admin', role: 'admin' };
        onAdminLogin(adminUser);
        alert('Admin Login Successful!');
        navigate('/admin/dashboard');
      } else {
        setErrors({ auth: 'Invalid Admin Credentials (Use admin / admin123)' });
      }
    }
  };

  return (
    <div className="admin-login-container">
      <h2 className="admin-login-title">Admin Panel Login</h2>

      {errors.auth && <div className="error-text" style={{ textAlign: 'center', marginBottom: '15px' }}>{errors.auth}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Admin Username:</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={credentials.username}
            onChange={handleChange}
            placeholder="admin"
          />
          {errors.username && <span className="error-text">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={credentials.password}
            onChange={handleChange}
            placeholder="admin123"
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <button type="submit" className="btn-admin-submit">
          Login to Dashboard
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;