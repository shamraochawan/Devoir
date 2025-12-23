import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import API_URL from '../api'; // <--- 1. Import the API config
import '../App.css';

const Shop = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // 2. Use the variable here
        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();
        
        let filtered = data;

        // --- SEARCH LOGIC ---
        if (searchQuery) {
           filtered = data.filter(p => 
             p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             p.category.toLowerCase().includes(searchQuery.toLowerCase())
           );
        }
        // --- EXISTING LOGIC ---
        else if (category === 'men') {
          filtered = data.filter(p => p.gender === 'men' || p.gender === 'unisex');
        } 
        else if (category === 'women') {
          filtered = data.filter(p => p.gender === 'women' || p.gender === 'unisex');
        }
        else {
           // Home Page
           filtered = data.reverse().slice(0, 12);
        }
        
        setProducts(filtered);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category, searchQuery]);

  return (
    <div>
      {/* Hide Hero if Searching */}
      {category === 'all' && !searchQuery && <Hero />}
      
      <div className="container">
        <h2 style={{
            textAlign: 'center', 
            marginTop: '55px', 
            fontFamily: 'Stack Sans Notch', 
            textTransform: 'uppercase',
            fontSize: '24px'
        }}>
            {searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : category === 'all' ? 'New Arrivals' : `${category}'s Collection`
            }
        </h2>

        {loading ? (
            <p style={{textAlign:'center'}}>Loading...</p>
        ) : products.length === 0 ? (
          <p style={{textAlign: 'center', marginTop: '50px', color:'#666'}}>
             No products found.
          </p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;