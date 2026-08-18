import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Context Providers (Single dot ./)
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// 2. Components & Route Guards
import Navbar from './components/Navbar';
import AdminProtectedRoute from './components/AdminProtectedRoute'; // Adjust to './components/common/AdminProtectedRoute' if inside common folder

// 3. Client Pages
import Home from './pages/client/Home';
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import ProductDetails from './pages/client/ProductDetails';
import Cart from './pages/client/Cart';
import Checkout from './pages/client/Checkout';
import MyOrders from './pages/client/MyOrders';
import Profile from './pages/client/Profile';

// 4. Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
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
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Client Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin Public Route */}
              <Route path="/admin" element={<AdminLogin />} />

              {/* Admin Protected Routes */}
              <Route element={<AdminProtectedRoute />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/categories" element={<CategoryMgmt />} />
                <Route path="/admin/brands" element={<BrandMgmt />} />
                <Route path="/admin/products" element={<ProductMgmt />} />
                <Route path="/admin/orders" element={<OrderMgmt />} />
                <Route path="/admin/customers" element={<CustomerMgmt />} />
              </Route>
            </Routes>
          </main>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;