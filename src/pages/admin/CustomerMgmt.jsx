import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const CustomerMgmt = () => {
  const { token } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // 1. Define fetchCustomers function
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/customers', authHeader);
      setCustomers(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customer list.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch on initial component load
  useEffect(() => {
    fetchCustomers();
  }, []);

  // 3. Toggle Role (Client <-> Admin)
  const handleRoleToggle = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'client' : 'admin';
    if (!window.confirm(`Change role to ${newRole}?`)) return;

    try {
      await axios.put(`http://localhost:5000/api/admin/customers/${id}/role`, { role: newRole }, authHeader);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  // 4. Delete Customer
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer account?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/customers/${id}`, authHeader);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete customer');
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header-row">
        <h2>Customer Management</h2>
      </div>

      {error && <p className="error-banner">{error}</p>}

      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Contact Phone</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer._id}>
                  <td>{index + 1}</td>
                  <td><strong>{customer.name}</strong></td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || 'N/A'}</td>
                  <td>
                    <span className={`product-stock ${customer.role === 'admin' ? 'in-stock' : 'out-stock'}`}>
                      {customer.role}
                    </span>
                  </td>
                  <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleRoleToggle(customer._id, customer.role)}
                      className="btn-action edit-btn"
                    >
                      Toggle Role
                    </button>
                    <button
                      onClick={() => handleDelete(customer._id)}
                      className="btn-action delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>No registered users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerMgmt;