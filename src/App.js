import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';

// Component Imports
import Navbar from './components/Navbar.jsx';
import AdminNavbar from './components/AdminNavbar.jsx';

// Client Pages
import Home from './pages/client/Home.jsx';
import ProductDetails from './pages/client/ProductDetails.jsx';
import Register from './pages/client/Register.jsx';
import Login from './pages/client/Login.jsx';
import Cart from './pages/client/Cart.jsx';
import Checkout from './pages/client/Checkout.jsx';
import MyOrders from './pages/client/MyOrders.jsx';
import Profile from './pages/client/Profile.jsx';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import CategoryMgmt from './pages/admin/CategoryMgmt.jsx';
import BrandMgmt from './pages/admin/BrandMgmt.jsx';
import ProductMgmt from './pages/admin/ProductMgmt.jsx';
import OrderMgmt from './pages/admin/OrderMgmt.jsx';
import CustomerMgmt from './pages/admin/CustomerMgmt.jsx';

const API_BASE_URL = 'http://localhost:5000/api';

function NavigationHandler({ user, onLogout, admin, onAdminLogout }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar user={user} onLogout={onLogout} />}
      {isAdminRoute && <AdminNavbar admin={admin} onAdminLogout={onAdminLogout} />}
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  const [categories, setCategories] = useState(['Refrigerator', 'Washing Machine', 'Microwave', 'Air Conditioner']);
  const [brands, setBrands] = useState(['Samsung', 'LG', 'Daikin', 'Whirlpool']);
  
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch initial data from Express Backend
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCustomers();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/customers`);
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  // Product Handlers (Synced with DB)
  const handleAddProduct = async (newProductData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/products`, newProductData);
      setProducts((prev) => [res.data, ...prev]);
      alert('Product added successfully!');
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Failed to save product to database.');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id && p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Cart Operations
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const productId = product._id || product.id;
      const existing = prevCart.find((item) => (item._id || item.id) === productId);
      if (existing) {
        return prevCart.map((item) =>
          (item._id || item.id) === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    alert(`${product.title} added to cart!`);
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => (item._id || item.id) !== id));
    } else {
      setCart((prev) =>
        prev.map((item) => ((item._id || item.id) === id ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => (item._id || item.id) !== id));
  };

  return (
    <Router>
      <NavigationHandler 
        user={user} 
        onLogout={() => setUser(null)} 
        admin={admin} 
        onAdminLogout={() => setAdmin(null)} 
      />

      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<Home products={products} onAddToCart={handleAddToCart} />} />
        <Route path="/product/:id" element={<ProductDetails products={products} onAddToCart={handleAddToCart} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={(u) => setUser(u)} />} />
        <Route 
          path="/cart" 
          element={
            <Cart 
              cart={cart} 
              onUpdateQuantity={handleUpdateQuantity} 
              onRemoveItem={handleRemoveItem} 
            />
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <Checkout 
              cart={cart} 
              user={user} 
              onPlaceOrder={(o) => { setOrders([o, ...orders]); setCart([]); }} 
            />
          } 
        />
        <Route path="/my-orders" element={<MyOrders orders={orders} />} />
        <Route path="/profile" element={<Profile user={user} onUpdateProfile={(u) => setUser({ ...user, ...u })} />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin onAdminLogin={(a) => setAdmin(a)} />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <Dashboard 
              admin={admin} 
              categories={categories} 
              brands={brands} 
              products={products} 
              orders={orders} 
              customers={customers} 
            />
          } 
        />
        <Route 
          path="/admin/categories" 
          element={
            <CategoryMgmt 
              categories={categories} 
              onAddCategory={(c) => setCategories([...categories, c])} 
              onDeleteCategory={(c) => setCategories(categories.filter((i) => i !== c))} 
            />
          } 
        />
        <Route 
          path="/admin/brands" 
          element={
            <BrandMgmt 
              brands={brands} 
              onAddBrand={(b) => setBrands([...brands, b])} 
              onDeleteBrand={(b) => setBrands(brands.filter((i) => i !== b))} 
            />
          } 
        />
        <Route 
          path="/admin/products" 
          element={
            <ProductMgmt 
              products={products} 
              categories={categories} 
              brands={brands} 
              onAddProduct={handleAddProduct} 
              onDeleteProduct={handleDeleteProduct} 
            />
          } 
        />
        <Route path="/admin/orders" element={<OrderMgmt orders={orders} />} />
        <Route path="/admin/customers" element={<CustomerMgmt customers={customers} />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;