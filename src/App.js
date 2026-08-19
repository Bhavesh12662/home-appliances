import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import './pages/admin/Admin.css';
// Client Pages
import Home from './pages/client/Home';
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import ProductDetails from './pages/client/ProductDetails';
import Cart from './pages/client/Cart';
import Checkout from './pages/client/Checkout';
import MyOrders from './pages/client/MyOrders';
import Profile from './pages/client/Profile';

// Admin Pages & Layout
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import CategoryMgmt from './pages/admin/CategoryMgmt';
import BrandMgmt from './pages/admin/BrandMgmt';
import ProductMgmt from './pages/admin/ProductMgmt';
import OrderMgmt from './pages/admin/OrderMgmt';
import CustomerMgmt from './pages/admin/CustomerMgmt';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* 1. Client Storefront (Has Top Navbar) */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/my-orders" element={<MyOrders />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </main>
                </>
              }
            />

            {/* 2. Admin Standalone Login */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* 3. Admin Protected Console (Has Left Sidebar Layout) */}
            <Route element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/products" element={<ProductMgmt />} />
                <Route path="/admin/categories" element={<CategoryMgmt />} />
                <Route path="/admin/brands" element={<BrandMgmt />} />
                <Route path="/admin/orders" element={<OrderMgmt />} />
                <Route path="/admin/customers" element={<CustomerMgmt />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;