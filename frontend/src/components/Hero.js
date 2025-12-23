import React from 'react';
import '../App.css';
// Import the image directly. If the filename is wrong, React will tell you!
import mainImage from '../images/devoir-main-image.png'; 

const Hero = () => {
  return (
    <div className="main-image-container">
      <img src={mainImage} alt="Main responsive" className="main-image" />
      <p>ETHREAL</p>
    </div>
  );
};

export default Hero;