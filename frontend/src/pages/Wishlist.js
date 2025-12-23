import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext'; // Use Context
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { currentUser } = useAuth();
  const { wishlist } = useWishlist(); // Get global wishlist

  if (!currentUser) return <h2 style={{textAlign:'center', marginTop:'50px'}}>Please Login to view Wishlist</h2>;

  return (
    <div className="container" style={{marginTop:'50px'}}>
      <h2 style={{textAlign:'center', fontFamily:'Stack Sans Notch', marginBottom:'30px'}}>MY WISHLIST</h2>
      
      {wishlist.length === 0 ? (
         <p style={{textAlign:'center', color:'#666'}}>Your wishlist is empty.</p>
      ) : (
        <div className="product-grid">
          {wishlist.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;