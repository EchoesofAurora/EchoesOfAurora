import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css'; 
import logo from '../images/logo.png';

const Header = () => (
  <header className="header">
    <div className="container">
      <div className="logo">
      <img src={logo} alt="Aurora Logo" className="logo-img" />
      </div>
      <nav className="nav-bar">
        <Link to="/">Home</Link>
        <Link to="/stories">Stories</Link>
        <Link to="/map">Interactive Map</Link>
        <Link to="/tribes">Tribes</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact Us</Link>
      </nav>
      <button className="sign-in-button">Sign In</button>
    </div>
  </header>
);

export default Header;
