import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, variant) => {
    setCart(prev => {
      const uniqueId = `${product._id}-${variant ? variant.colorName : 'default'}`;
      const existing = prev.find(item => item.uniqueId === uniqueId);

      if (existing) {
        return prev.map(item => item.uniqueId === uniqueId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { uniqueId, product, variant, quantity: 1, price: product.price }];
    });
    alert("Added to Cart!");
  };

  const removeFromCart = (uniqueId) => {
    setCart(prev => prev.filter(item => item.uniqueId !== uniqueId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};