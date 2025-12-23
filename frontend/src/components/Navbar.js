import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../App.css'; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { currentUser, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
      setSearchTerm('');
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button className="menu-symbol" onClick={toggleMenu}>☰</button>
          <Link to="/men" className="nav-btn desktop-only">MEN</Link>
          <Link to="/women" className="nav-btn desktop-only">WOMEN</Link>
          
          {isAdmin && (
             <Link to="/admin" className="nav-btn desktop-only" style={{ color: 'red', fontWeight: 'bold' }}>
               ADMIN
             </Link>
          )}
        </div>

        <Link to="/" className="header-middle" title="Home"></Link>

        <div className="header-right">
          <form className="search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="black" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          {currentUser ? (
             <button onClick={handleLogout} className="nav-btn logout-btn">Sign Out</button>
          ) : (
            <Link to="/login" className="account-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </Link>
          )}
        </div>
      </header>

      {/* SIDE MENU */}
      <div className={`overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div className={`side-menu ${isMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="menu-header">
            <div className="header-middle-mobile"></div>
            <button className="close-btn" onClick={toggleMenu}>&times;</button>
          </div>
          
          <Link to="/men" className="nav-btn mobile-link" onClick={toggleMenu}>MEN</Link>
          <Link to="/women" className="nav-btn mobile-link" onClick={toggleMenu}>WOMEN</Link>
          
          {currentUser && (
            <>
               <Link to="/wishlist" className="nav-btn mobile-link" onClick={toggleMenu} style={{fontWeight:'bold'}}>
                  MY WISHLIST 
                  {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
               </Link>

               <Link to="/cart" className="nav-btn mobile-link" onClick={toggleMenu} style={{fontWeight:'bold', color: '#007791'}}>
                  MY CART
                  {cart.length > 0 && <span className="nav-badge">{cart.length}</span>}
               </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" className="nav-btn mobile-link" style={{color:'red'}} onClick={toggleMenu}>ADMIN</Link>
          )}
        </div>
      </div>
      
      <div className="divider-flex">
        <svg className="line" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 4.7 H100" stroke="black" strokeWidth="1" fill="none" /></svg>
        <div className="hex-fixed"><svg viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 4.7 L10 9 H90 L100 4.7 Z" fill="#ffffff" /><path d="M0 4.7 L10 9 H90 L100 4.7" stroke="black" strokeWidth="0.4" fill="none" /></svg></div>
        <svg className="line" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 4.7 H100" stroke="black" strokeWidth="1" fill="none" /></svg>
      </div>
    </>
  );
};

export default Navbar;