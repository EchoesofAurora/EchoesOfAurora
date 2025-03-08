import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';
import logo from '../images/logo.png';

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <header className="user-header">
      <div className="user-header-container">
        <div className="user-header-logo">
          <img src={logo} alt="Aurora Logo" className="user-header-logo-img" />
        </div>
        <div className="user-header-hamburger" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <nav className={`user-header-nav-bar ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/">Home</Link>
          <Link to="/map">Interactive Map</Link>
          <Link to="/stories">Stories</Link>
          <Link to="/tribes">Tribes</Link>
          <Link to="/about">About</Link>
          <Link to="/contactus">Contact Us</Link>
        </nav>
        <Link to="/Admin/SignIn" className="sign-in-button-link">
          <button className="user-header-sign-in-button">Sign In</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
