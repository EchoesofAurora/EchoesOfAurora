import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/header.css';
import logo from '../images/logo.png';

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const getNavLinkClass = (path) => 
    location.pathname === path ? 'nav-link active' : 'nav-link';

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
          <Link to="/" className={getNavLinkClass("/")}>Home</Link>
          <Link to="/map" className={getNavLinkClass("/map")}>Interactive Map</Link>
          <Link to="/stories" className={getNavLinkClass("/stories")}>Stories</Link>
          <Link to="/tribes" className={getNavLinkClass("/tribes")}>Tribes</Link>
          <Link to="/about" className={getNavLinkClass("/about")}>About</Link>
          <Link to="/contactus" className={getNavLinkClass("/contactus")}>Contact Us</Link>
        </nav>
        <Link to="/Admin/SignIn" className="sign-in-button-link">
          <button className="user-header-sign-in-button">Sign In</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
