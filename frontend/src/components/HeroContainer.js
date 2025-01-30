import React from 'react';
import logo from '../images/logo.png'; // Adjust the path as needed
import "../styles/AdminStyle.css"; // Ensure the correct CSS file is imported

const HeroContainer = ({ title, description }) => {
  return (
    <div className="hero-container">
      <img 
        src={logo}
        alt="Aurora Stories Logo"
        className="hero-logo"
      />
      <h1 className="hero-title">{title}</h1>
      <p className="hero-description">{description}</p>
    </div>
  );
};

export default HeroContainer;
