import React from 'react';
import logo from '../images/logo.png'; // Adjust the path as needed
import "../styles/AdminStyle.css"; // Ensure the correct CSS file is imported

const HeroContainer = ({ title, description }) => {
  return (
    <div className="admin-hero-container">
      <img 
        src={logo}
        alt="Aurora Stories Logo"
        className="admin-hero-logo"
      />
      <h1 className="admin-hero-title">{title}</h1>
      <p className="admin-hero-description">{description}</p>
    </div>
  );
};

export default HeroContainer;
