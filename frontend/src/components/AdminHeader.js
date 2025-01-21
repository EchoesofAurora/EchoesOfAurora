import React from 'react';
import '../styles/AdminHeader.css'; 
import logo from '../images/logo.png';
import leftFlower from '../images/left-flower.png'
import rightFlower from '../images/right-flower.png'
import iconLeftWrapper from "../images/icon-left-wrapper.svg";
import icon from "../images/icon.svg";


const Header = () => (
  <header className="AdminHeader">
    <div className="left-Flowers">
        
        <img src={leftFlower} alt="NavLeftFlower" className="NavLeftFlowerImg" />
    </div>
    <div className="container">
      <div className="logo">
        <img src={logo} alt="Aurora Logo" className="logo-img" />
      </div>
      <div className="WF-button" onClick={"../dashboard"}>
          <img className="icon-left-wrapper" alt="Icon left wrapper"  src={iconLeftWrapper}/>
          <div className="label">Lynn</div>
          <img className="icon" alt="Icon" src={icon} />
      </div>
      </div>
    <div className="right-Flowers">
        <img src={rightFlower} alt="NavRightFlower" className="NavRightFlowerImg" />
        
    </div>
    
    

  </header>
  
  
);

export default Header;



