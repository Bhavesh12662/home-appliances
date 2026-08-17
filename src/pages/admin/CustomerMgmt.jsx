import React from 'react';

function CustomerMgmt({ customers = [], onDeleteCustomer }) {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Customer Management</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Customer ID</th>
            <th style={{ padding: '12px' }}>Name</th>
            <th style={{ padding: '12px' }}>Email</th>
            <th style={{ padding: '12px' }}>Phone</th>
            <th style={{ padding: '12px' }}>Total Orders</th>
            <th style={{ padding: '12px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
                No registered customers found.
              </td>
            </tr>
          ) : (
            customers.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>#{c.id}</td>
                <td style={{ padding: '12px' }}><strong>{c.name}</strong></td>
                <td style={{ padding: '12px' }}>{c.email}</td>
                <td style={{ padding: '12px' }}>{c.phone || 'N/A'}</td>
                <td style={{ padding: '12px' }}>{c.ordersCount ?? 0}</td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => onDeleteCustomer && onDeleteCustomer(c.id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove Account
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerMgmt;