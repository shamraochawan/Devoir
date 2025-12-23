import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Shop from './pages/Shop'; 
import Admin from './pages/Admin';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart'; 
import { AuthProvider } from './context/AuthContext'; 
import { CartProvider } from './context/CartContext'; 
import { WishlistProvider } from './context/WishlistContext'; // <--- 1. IMPORT
import AdminRoute from './components/AdminRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider> {/* <--- 2. WRAP HERE */}
          <Router>
            <div className="App">
              <Navbar />
              
              <Routes>
                <Route path="/" element={<Shop category="all" />} />
                <Route path="/men" element={<Shop category="men" />} />
                <Route path="/women" element={<Shop category="women" />} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/cart" element={<Cart />} />

                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  } 
                />
              </Routes>

              <Footer />
              
            </div>
          </Router>
        </WishlistProvider> {/* <--- 3. CLOSE WRAPPER */}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;