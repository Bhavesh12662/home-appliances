import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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
import AdminLayout from '../pages/admin/AminLayout.jsx';

// Helper component to conditionally render Navbars based on current URL path
function NavigationHandler({ user, onLogout, admin, onAdminLogout }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Show Client Navbar ONLY on client-side routes */}
      {!isAdminRoute && <Navbar user={user} onLogout={onLogout} />}

      {/* Show Admin Navbar ONLY on admin routes */}
      {isAdminRoute && <AdminNavbar admin={admin} onAdminLogout={onAdminLogout} />}
    </>
  );
}

function AppRputes() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  const [categories, setCategories] = useState(['Refrigerator', 'Washing Machine', 'Microwave', 'Air Conditioner']);
  const [brands, setBrands] = useState(['Samsung', 'LG', 'Daikin', 'Whirlpool']);
  const [products, setProducts] = useState([
    { id: 1, title: 'Double Door Refrigerator', category: 'Refrigerator', brand: 'Samsung', price: 35000, image: '' },
    { id: 2, title: 'Front Load Washing Machine', category: 'Washing Machine', brand: 'LG', price: 28000, image: '' }
  ]);
  
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([
    { name: 'Dasari Bhavesh', email: 'bhavesh@gmail.com', phone: '9664977619' }
  ]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    alert(`${product.title} added to cart!`);
  };

  return (
    <Router>
      {/* Conditionally renders navbars */}
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
        <Route path="/cart" element={<Cart cart={cart} onUpdateQuantity={(id, q) => setCart(cart.map(i => i.id === id ? {...i, quantity: q} : i))} onRemoveItem={(id) => setCart(cart.filter(i => i.id !== id))} />} />
        <Route path="/checkout" element={<Checkout cart={cart} user={user} onPlaceOrder={(o) => { setOrders([o, ...orders]); setCart([]); }} />} />
        <Route path="/my-orders" element={<MyOrders orders={orders} />} />
        <Route path="/profile" element={<Profile user={user} onUpdateProfile={(u) => setUser({ ...user, ...u })} />} />
~
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin onAdminLogin={(a) => setAdmin(a)} />} />
        <Route path='/admin/layout' element={<AdminLayout admin={admin} categories={categories} brands={brands} products={products} orders={orders} customers={customers} />} />
        <Route path="/admin/dashboard" element={<Dashboard admin={admin} categories={categories} brands={brands} products={products} orders={orders} customers={customers} />} />
        <Route path="/admin/categories" element={<CategoryMgmt categories={categories} onAddCategory={(c) => setCategories([...categories, c])} onDeleteCategory={(c) => setCategories(categories.filter(i => i !== c))} />} />
        <Route path="/admin/brands" element={<BrandMgmt brands={brands} onAddBrand={(b) => setBrands([...brands, b])} onDeleteBrand={(b) => setBrands(brands.filter(i => i !== b))} />} />
        <Route path="/admin/products" element={<ProductMgmt products={products} categories={categories} brands={brands} onAddProduct={(p) => setProducts([...products, p])} onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))} />} />
        <Route path="/admin/orders" element={<OrderMgmt orders={orders} />} />
        <Route path="/admin/customers" element={<CustomerMgmt customers={customers} />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;