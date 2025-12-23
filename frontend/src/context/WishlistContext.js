import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API_URL from '../api';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { currentUser } = useAuth();

  // Load Wishlist from Server when User Logs in
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!currentUser) {
        setWishlist([]); 
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/wishlist/${currentUser.email}`);
        const data = await res.json();
        setWishlist(data);
      } catch (err) {
        console.error("Error fetching wishlist");
      }
    };
    fetchWishlist();
  }, [currentUser]);

  const toggleWishlist = async (product) => {
    if (!currentUser) {
      alert("Please login first.");
      return;
    }

    // Optimistic UI Update (Update screen before server responds)
    const exists = wishlist.find(item => item._id === product._id);
    
    if (exists) {
      // Remove immediately
      setWishlist(prev => prev.filter(item => item._id !== product._id));
    } else {
      // Add immediately
      setWishlist(prev => [...prev, product]);
    }

    // Send to Backend
    try {
      await fetch(`${API_URL}/api/wishlist/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email, productId: product._id })
      });
    } catch (err) {
      console.error("Server error updating wishlist");
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};