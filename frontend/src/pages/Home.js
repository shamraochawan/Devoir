import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import '../App.css';

const Home = () => {
  const [products, setProducts] = useState([]);

  // Fetch products when page loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        
        // Shuffle the products
        if (Array.isArray(data)) {
           const shuffled = data.sort(() => 0.5 - Math.random());
           setProducts(shuffled);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Hero />
      
      <div className="container">
        {products.length === 0 ? (
          <p style={{textAlign: 'center', marginTop: '50px'}}>
             No products found. Go to /admin to add some!
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

export default Home;