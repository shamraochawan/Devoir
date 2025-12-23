import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import API_URL from '../api';
import '../App.css';

const ProductCard = ({ product }) => {
  const [activeVariant, setActiveVariant] = useState(null);
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  // Check if this product is in the global wishlist
  const isLiked = wishlist.some(item => item._id === product._id);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setActiveVariant(product.variants[0]);
    }
  }, [product]);

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, activeVariant);
  };

  if (!product || !activeVariant) return null;

  const getImageUrl = (path) => {
    if (!path) return '';
    const cleanPath = path.replace(/\\/g, '/');
    return cleanPath.startsWith('http') ? cleanPath : `${API_URL}/uploads/${cleanPath}`;
  };

  const displayTitle = (activeVariant.variantName && activeVariant.variantName.trim() !== "") 
    ? activeVariant.variantName : product.title;

  return (
    <div className="product-card">
      <div className="image-container">
        <img 
          src={getImageUrl(activeVariant.imagePath)} 
          alt={displayTitle} 
          className="product-image" 
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
        <div style={{display: 'none', width: '100%', height: '100%', background: '#f0f0f0', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0, flexDirection: 'column', color: '#888'}}>
            <span>🖼️</span><span>No Image</span>
        </div>
        
        {/* WISHLIST BUTTON (Left side) */}
        <div 
           className="wishlist-icon" 
           onClick={handleToggleWishlist}
           style={{ color: isLiked ? 'red' : 'black', fontWeight: isLiked ? 'bold' : 'normal', right: '50px' }}
        >
          {isLiked ? '♥' : '♡'}
        </div>

        {/* ADD TO CART BUTTON (Right side) */}
        <div 
           className="wishlist-icon" 
           onClick={handleAddToCart}
           style={{ right: '10px', backgroundColor: 'black', color: 'white', border: '1px solid black' }}
           title="Add to Cart"
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
             <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
           </svg>
        </div>
      </div>

      <div className="product-category">{product.category}</div>
      <h3 className="product-title">{displayTitle}</h3>
      
      {/* PRICE IN RUPEES */}
      <div className="product-price">₹{product.price}</div>

      <div className="swatch-container">
        {product.variants.map((variant, index) => (
          <div 
            key={index}
            className={`color-option ${activeVariant.colorName === variant.colorName ? 'active' : ''}`}
            style={{ backgroundColor: variant.colorName }}
            onClick={() => setActiveVariant(variant)}
          ></div>
        ))}
      </div>
      <div className="availability">Sizes: {product.sizes}</div>
    </div>
  );
};

export default ProductCard;