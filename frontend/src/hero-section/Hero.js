import React from 'react';
import './hero.css'; 
import HeroImage from '../assess/images/heroImage.png'

const HeroSection = ({ title, subtitle, buttonText, buttonLink }) => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        
        

        <div className="hero-text">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-subtitle">{subtitle}</p>
          
        </div>
      </div>
      <div className='darken'></div>
    </section>
  );
};

export default HeroSection;
