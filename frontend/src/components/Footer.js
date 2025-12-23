import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // We will add the styles in Step 2

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Column 1: Brand & About */}
        <div className="footer-col">
          <h3 className="footer-logo">DEVOIR</h3>
          <p className="footer-desc">
            Redefining style with comfort. Quality clothing for the modern generation.
          </p>
        </div>

        {/* Column 2: Shop */}
        <div className="footer-col">
          <h4>SHOP</h4>
          <ul>
            <li><Link to="/men">Men's Collection</Link></li>
            <li><Link to="/women">Women's Collection</Link></li>
            <li><Link to="/">New Arrivals</Link></li>
          </ul>
        </div>

        {/* Column 3: Customer Care */}
        <div className="footer-col">
          <h4>SUPPORT</h4>
          <ul>
            <li><Link to="#">Privacy Policy</Link></li>
            <li><Link to="#">Terms & Conditions</Link></li>
            <li><Link to="#">Return Policy</Link></li>
            <li><Link to="#">Contact Us</Link></li>
          </ul>
        </div>

        {/* Column 4: Social Media */}
        <div className="footer-col">
          <h4>FOLLOW US</h4>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Devoir Clothing. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;