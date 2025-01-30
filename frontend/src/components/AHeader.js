import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AHeader.css'; 
import logo from '../images/logo.png';
import leftFlower from '../images/left-flower.png'
import rightFlower from '../images/right-flower.png'


const Header = () => (
  <header className="Aheader">
    <div className="left-Flowers">
        
        <img src={leftFlower} alt="NavLeftFlower" className="NavLeftFlowerImg" />
    </div>
    <div className="container">
      <div className="logo">
        <img src={logo} alt="Aurora Logo" className="logo-img" />
      </div>
      <Link href="/adminSignIn" className="WF-button">Sign In</Link>

    </div>
    <div className="right-Flowers">
        <img src={rightFlower} alt="NavRightFlower" className="NavRightFlowerImg" />
        
    </div>
  </header>
);

export default Header;