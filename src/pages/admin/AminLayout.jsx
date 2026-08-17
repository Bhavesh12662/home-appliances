import React, { useState } from 'react';
import ProductMgmt from './ProductMgmt';
import OrderMgmt from './OrderMgmt';
import CustomerMgmt from './CustomerMgmt';
import CategoryMgmt from './CategoryMgmt';
import Dashboard from './Dashboard';

function AdminLayout({
  products,
  categories,
  brands,
  orders,
  customers,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onDeleteCustomer,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard products={products} orders={orders} customers={customers} />;
      case 'products':
        return (
          <ProductMgmt
            products={products}
            categories={categories}
            brands={brands}
            onAddProduct={onAddProduct}
            onDeleteProduct={onDeleteProduct}
          />
        );
      case 'categories':
        return <CategoryMgmt categories={categories} brands={brands} />;
      case 'orders':
        return <OrderMgmt orders={orders} onUpdateOrderStatus={onUpdateOrderStatus} />;
      case 'customers':
        return <CustomerMgmt customers={customers} onDeleteCustomer={onDeleteCustomer} />;
      default:
        return <Dashboard products={products} orders={orders} customers={customers} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa' }}>
      {/* Admin Sidebar */}
      <aside style={{ width: '240px', backgroundColor: '#1e293b', color: '#fff', padding: '20px 0', flexShrink: 0 }}>
        <h2 style={{ padding: '0 20px', fontSize: '20px', marginBottom: '30px' }}>Admin Panel</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'products', label: '📦 Products' },
            { id: 'categories', label: '🏷️ Categories & Brands' },
            { id: 'orders', label: '🛒 Orders' },
            { id: 'customers', label: '👥 Customers' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                textAlign: 'left',
                border: 'none',
                background: activeTab === tab.id ? '#334155' : 'transparent',
                color: activeTab === tab.id ? '#38bdf8' : '#cbd5e1',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '20px', marginTop: 'auto' }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1, padding: '24px', overflowY: 'auto' }}>
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default AdminLayout;