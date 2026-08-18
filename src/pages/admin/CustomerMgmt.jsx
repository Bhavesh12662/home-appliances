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

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/admin/customers', authHeader);
        setCustomers(res.data);
      } catch (err) {
        setError('Failed to fetch registered customers list.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <div className="loader-container">Loading customers...</div>;

  return (
    <div className="admin-page-container">
      <h2>Customer Management</h2>
      {error && <p className="error-banner">{error}</p>}

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
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    backgroundColor: customer.role === 'admin' ? '#fef3c7' : '#e0e7ff',
                    color: customer.role === 'admin' ? '#b45309' : '#3730a3'
                  }}>
                    {customer.role || 'Customer'}
                  </span>
                </td>
                <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerMgmt;